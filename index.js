'use strict';

const pretty = require('pretty');
const path = require('path');
const fs = require('fs');
const showdown = require('showdown');
var converter = new showdown.Converter();
const { scanDir, std, colors, generateID } = require('./libs/fp');
var categoriesContent, tagsContent, randomContent = [];

/**
 * Parse configuration from files and arguments
 */
function config() {
  let conf = {
    currentPath: process.cwd()
  };
  conf.blogPath = path.resolve(conf.currentPath, 'blog');
  conf.buildPath = path.resolve(conf.currentPath, 'docs');
  std.info(`aBlog project was found "${conf.blogPath}"`);
  if (!fs.existsSync(conf.blogPath)) std.fatal(`Blog path ${conf.blogPath} not found`);
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

/**
 * Read metadata from MD files
 * @param {*} filename 
 * @param {*} fileContent 
 */
function readMetadata(filename, fileContent) {
  let data = (/^-{3,3}(.|\n)+-{3,3}$/m).exec(fileContent);
  let ret = {};
  if (data && data.index >= 0) {
    let metas = data[data.index].split('\n');
    for (let i = 0; i < metas.length; i++) {
      let el = metas[i];
      if (el.indexOf(':') > 0) {
        let splited = el.split(':');
        if (splited.length >= 2) {
          let value = splited.splice(1).join(':').trim();
          let key = splited[0].trim();
          ret[key] = value;
        }
      }
    }
    if (ret.tags) ret.tags = ret.tags.split(',').map((v) => v.trim());
    if (ret.categories) ret.categories = ret.categories.split(',').map((v) => v.trim());
  } else {
    std.warn(`Could not find metadata in "${filename}" ${colors.yellow('skip')}`);
  }
  return ret;
}

/**
 * Reducing and mapping topics
 * @param {*} basename 
 * @param {*} appendee 
 * @param {*} kinds 
 */
function reducer(basename, appendee, topics) {
  for (let i = 0; i < topics.length; i++) {
    let topic = topics[i];
    if (!appendee[topic]) appendee[topic] = [];
    if (appendee[topic].indexOf(basename) >= 0) continue;
    appendee[topic].push(basename);
  }
}

function render(templateContent, data) {
  let ret = templateContent;
  for (let i in data) {
    ret = ret.replace(new RegExp(`\\$\{${i}}`, 'img'), data[i]);
  }
  return ret;
}

function writeHtml(filePath, fileContent) {
  return fs.writeFileSync(path.resolve.apply(null, filePath), pretty(fileContent));
}

function main() {
  let cacher = {};
  cacher.categories = {};
  cacher.contents = {};
  cacher.tags = {};
  const { currentPath, blogPath, buildPath } = config();
  let templateIndex = fs.readFileSync(path.resolve(currentPath, 'template/index.html')).toString();
  //Get all .MD files
  let fileList = scanDir(blogPath, /.+\.md/i);
  for (let i = 0; i < fileList.length; i++) {
    let filename = fileList[i];
    let basename = path.basename(filename).replace(/\.md$/ig, '');
    let fileContent = fs.readFileSync(filename).toString();
    let metadata = readMetadata(filename, fileContent);
    if (metadata
      && metadata.categories
      && metadata.tags
      && metadata.title) {
      cacher[basename] = metadata;
      reducer(basename, cacher.categories, metadata.categories);
      reducer(basename, cacher.tags, metadata.tags);
    } else {
      std.warn(`Invalid metadata in "${filename}"`);
    }
  }

  for (let i = 0; i < fileList.length; i++) {
    let filename = fileList[i];
    let basename = path.basename(filename).replace(/\.md$/ig, '');
    let fileContent = fs.readFileSync(filename).toString();
    let writeContent = converter.makeHtml(fileContent.replace(/^-{3,3}(.|\n)+-{3,3}$/m, '').trim());
    tagsContent = Object.keys(cacher.tags)
      .map((i) => `<span class="article-tag"><a href="tag-${generateID(i)}.html">${i}</a></span>`)
      .sort()
      .join('\n');
    categoriesContent = Object.keys(cacher.categories)
      .map((i) => `<span class="article-category"><a href="category-${generateID(i)}.html">${i}</a></span>`)
      .sort()
      .join('<br/>\n');
    writeHtml([buildPath, `${basename}.html`],
      render(templateIndex, {
        title: cacher[basename].title,
        content: writeContent,
        tags: tagsContent,
        categories: categoriesContent
      }));
    cacher.contents[basename] = writeContent;
    randomContent.push(writeContent);
  }

  for (let i in cacher.categories) {
    let articles = cacher.categories[i];
    let cache = [`<h1>Categories > ${i}</h1>`];
    let filename = `category-${generateID(i)}.html`;
    for (let c = 0; c < articles.length; c++) {
      let articleId = articles[c];
      cache.push(`<a href="${articleId}.html">${cacher[articleId].title}</a>`);
    }
    writeHtml([buildPath, filename], render(templateIndex, {
      title: i,
      content: cache.join('<br/>\n'),
      tags: tagsContent,
      categories: categoriesContent
    }));
  }

  for (let i in cacher.tags) {
    let articles = cacher.tags[i];
    let cache = [`<h1>Hashtags > ${i}</h1>`];
    let filename = `tag-${generateID(i)}.html`;
    for (let c = 0; c < articles.length; c++) {
      let articleId = articles[c];
      cache.push(`<a href="${articleId}.html">${cacher[articleId].title}</a>`);
    }
    writeHtml([buildPath, filename], render(templateIndex, {
      title: i,
      content: cache.join('<br/>\n'),
      tags: tagsContent,
      categories: categoriesContent
    }));
  }

  let homeContent = [];
  let duplicated = [];
  while (homeContent.length < Math.min(randomContent.length, 10)) {
    let rnd = parseInt(randomContent.length * Math.random());
    if (duplicated.indexOf(rnd) >= 0) continue;
    homeContent.push(randomContent[rnd]);
    duplicated.push(rnd);
  }

  writeHtml([buildPath, 'index.html'],
    render(templateIndex, {
      title: 'Home',
      content: homeContent.join('</br>\n'),
      categories: categoriesContent,
      tags: tagsContent
    }));
}

main();

