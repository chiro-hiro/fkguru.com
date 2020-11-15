"use strict";
const { scanDir, std, colors, generateID } = require("./libs/fp");
const path = require("path");
const pretty = require("pretty");
const fs = require("fs");
const showdown = require("showdown");
var converter = new showdown.Converter();

function config() {
  let conf = {
    currentPath: process.cwd(),
  };
  conf.blogPath = path.resolve(conf.currentPath, "blog");
  conf.buildPath = path.resolve(conf.currentPath, "docs");
  std.info(`aBlog project was found "${conf.blogPath}"`);
  if (!fs.existsSync(conf.blogPath))
    std.fatal(`Blog path ${conf.blogPath} not found`);
  if (!fs.existsSync(conf.buildPath)) {
    try {
      std.info(`Create build path "${conf.buildPath}"`);
      fs.mkdirSync(conf.buildPath);
    } catch (err) {
      throw err;
    }
  } else {
    std.info(`Found build path "${conf.buildPath}"`);
  }
  return conf;
}

// Credit to: https://www.tunglt.com/2018/11/bo-dau-tieng-viet-javascript-es6/
function removeAccents(str) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

function render(templateContent, data) {
  let ret = templateContent;
  for (let i in data) {
    ret = ret.replace(new RegExp(`\\$\{${i}}`, "img"), data[i]);
  }
  return ret;
}

function writeHtml(filePath, fileContent) {
  return fs.writeFileSync(path.resolve(filePath), pretty(fileContent));
}

function renderWrite(filePath, templateContent, data) {
  return writeHtml(filePath, pretty(render(templateContent, data)));
}

function convertCatArray(a) {
  let r = {};
  for (let i = 0; i < a.length; i++) {
    let c = a[i];
    let t = r;
    for (let j = 0; j < c.length; j++) {
      if (j === c.length - 1) {
        t[c[j]] = true;
      } else {
        if (typeof t[c[j]] === "undefined") {
          t[c[j]] = {};
        }
        t = t[c[j]];
      }
    }
  }
  return r;
}

function renderLink(n) {
  return `<a alt="${getTittle(n)}" href="${htmlFileName(n)}">${getTittle(
    n
  )}</a>`;
}

function getTittle(n) {
  return n.toString().replace(/(\.md)$/gi, "");
}

function htmlFileName(n) {
  return removeAccents(n.toString())
    .toLowerCase()
    .replace(/(\.md)$/gi, "")
    .replace(/[^a-zA-z0-9]/g, "-")
    .replace(/--{1,}/g, "-")
    .concat(".html");
}

function renderCategories(c, l = 0) {
  let r = "";
  l += 1;
  for (let i in c) {
    if (c[i] === true) {
      r += `<li>${renderLink(i)}</li>`;
    } else {
      r += `<li class="li-parent-${l}">${i}${renderCategories(c[i], l)}</li>`;
    }
  }
  return `<ul class="ul-parent-${l}">${r}</ul>`;
}

(() => {
  let conf = config();
  let postList = scanDir(conf.blogPath);
  let categories = scanDir(conf.blogPath).map((i) =>
    i.replace(path.join(conf.blogPath, "./"), "").split("/")
  );

  let renderedCategories = renderCategories(convertCatArray(categories));
  let template = fs
    .readFileSync(path.resolve(conf.currentPath, "./template/index.html"))
    .toString();
  let randomContent = [];

  for (let i = 0; i < postList.length; i++) {
    let fileName = path.basename(postList[i]);
    randomContent.push(
      converter.makeHtml(fs.readFileSync(postList[i]).toString()).trim()
    );
    renderWrite(path.join(conf.buildPath, htmlFileName(fileName)), template, {
      title: getTittle(fileName),
      categories: renderedCategories,
      content: randomContent[randomContent.length - 1],
    });
  }
  let homeContent = [];
  let duplicated = [];
  while (homeContent.length < Math.min(randomContent.length, 10)) {
    let rnd = parseInt(randomContent.length * Math.random());
    if (duplicated.indexOf(rnd) >= 0) continue;
    homeContent.push(randomContent[rnd]);
    duplicated.push(rnd);
  }
  renderWrite(path.join(conf.buildPath, "./index.html"), template, {
    title: "F*K Guru",
    categories: renderedCategories,
    content: homeContent.join("<br/>\n"),
  });
})();
