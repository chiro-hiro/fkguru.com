const singleton = {};
const fundStorage = "0x68bE199e497FAe7ed11339BE388BF4a403CD1698";

const onceTimePrefix = "\xca\xfe";
const specialPrefix = "\xbe\xef";
const getOnceTimeEventName = (v) => `${onceTimePrefix}${v}`;
const getSpecialName = (v) => `${specialPrefix}${v}`;
const isOnceTime = (v) => v.substr(0, 2) === onceTimePrefix;
const isSpecial = (v) => v.substr(0, 2) === specialPrefix;

function hexStringToBytes32(a) {
  return `${a.toLowerCase().replace(/^0x/gi, "").padStart(64, 0)}`;
}

class EventDispatcher {
  constructor() {
    this.events = {};
  }

  isExists(eventName) {
    return typeof this.events[eventName] !== "undefined";
  }

  then(callback) {
    return this.once(getSpecialName("then"), callback);
  }

  catch(callback) {
    return this.once(getSpecialName("catch"), callback);
  }

  resolve(value) {
    return this.emit(getSpecialName("then"), value);
  }

  reject(error) {
    return this.emit(getSpecialName("catch"), error);
  }

  eventNames() {
    const result = [];
    Object.keys(this.events).forEach((e) => {
      if (!isSpecial(e)) {
        const eventName = isOnceTime(e) ? e.substr(2) : e;
        if (!result.includes(eventName)) {
          result.push(eventName);
        }
      }
    });
    return result;
  }

  removeAllListeners(eventName) {
    Object.keys(this.events).forEach((e) => {
      if (typeof eventName === "string") {
        if (e === eventName || e === getOnceTimeEventName(e)) {
          delete this.events[e];
        }
      } else {
        delete this.events[e];
      }
    });
    return this;
  }

  on(eventName, callback) {
    if (arguments.length < 2)
      throw new Error(
        "Wrong number of arguments, eventName and callback is need"
      );
    if (typeof eventName !== "string")
      throw new TypeError("Event name was not a string");
    if (typeof callback !== "function")
      throw new TypeError("Callback was not a function");
    if (!this.isExists(eventName)) {
      this.events[eventName] = [callback];
    } else {
      this.events[eventName].push(callback);
    }
    return this;
  }

  once(eventName, callback) {
    if (arguments.length < 2)
      throw new Error(
        "Wrong number of arguments, eventName and callback is need"
      );
    return this.on(getOnceTimeEventName(eventName), callback);
  }

  emit(eventName, ...params) {
    if (typeof eventName !== "string")
      throw new TypeError("Event name was not a string");
    const onceTimeEvent = getOnceTimeEventName(eventName);
    // Listened event
    if (this.isExists(eventName)) {
      for (let i = 0; i < this.events[eventName].length; i += 1) {
        const callback = this.events[eventName][i];
        if (typeof callback === "function") callback.bind(null)(...params);
      }
    }
    // Listened once
    if (this.isExists(onceTimeEvent)) {
      for (let i = 0; i < this.events[onceTimeEvent].length; i += 1) {
        const callback = this.events[onceTimeEvent][i];
        if (typeof callback === "function") callback.bind(null)(...params);
      }
      // Remove once time event after success called
      delete this.events[onceTimeEvent];
    }
    return this;
  }
}

class MetaMaskConnector extends EventDispatcher {
  account = null;

  tokenData = [
    // Ethereum blockchain
    {
      blockchain: "ethereum",
      name: "Tether USD (USDT)",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      symbol: "USDT",
      decimal: 6,
    },
    {
      blockchain: "ethereum",
      name: "Dai Stablecoin (DAI)",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      symbol: "DAI",
      decimal: 18,
    },
    {
      blockchain: "ethereum",
      name: "USD Coin (USDC)",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      symbol: "USDC",
      decimal: 6,
    },
    {
      blockchain: "ethereum",
      name: "Binance USD (BUSD)",
      address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
      symbol: "BUSD",
      decimal: 18,
    },
    // Binance smart chain
    {
      blockchain: "binance",
      name: "Binance-Peg BSC-USD",
      address: "0x55d398326f99059fF775485246999027B3197955",
      symbol: "USDT",
      decimal: 18,
    },
    {
      blockchain: "binance",
      name: "Binance-Peg Dai Token (DAI)",
      address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
      symbol: "DAI",
      decimal: 18,
    },
    {
      blockchain: "binance",
      name: "Binance-Peg USD Coin (USDC)",
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      symbol: "USDC",
      decimal: 18,
    },
    {
      blockchain: "binance",
      name: "Binance-Peg BUSD Token (BUSD)",
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      symbol: "BUSD",
      decimal: 18,
    },
    // Test
    {
      blockchain: "rinkeby",
      name: "Test Token",
      address: "0x495762ACe22f55AE4Bdba150EEBFe89A86a7A75D",
      symbol: "TET",
      decimal: 18,
    },
  ];

  isInstalled() {
    return typeof window.ethereum !== "undefined";
  }

  async connect() {
    [this.account] = await ethereum.request({
      method: "eth_requestAccounts",
    });
  }

  getAddress() {
    if (typeof this.account === "string") {
      return this.account;
    }
    return null;
  }

  _getBlockchain(chainId) {
    switch (chainId) {
      case 1:
      case "0x1":
      case "0x01":
        return "ethereum";
      case 56:
      case "0x38":
        return "binance";
      case 4:
      case "0x4":
      case "0x04":
        return "rinkeby";
      default:
        return "error";
    }
  }

  getBlockchain() {
    return this._getBlockchain(ethereum.chainId);
  }

  async getAccountBalance() {
    const balance = await ethereum.request({
      method: "eth_getBalance",
      params: [this.account, "latest"],
    });
    console.log(balance);
    return BigInt(balance === "0x" ? "0x0" : balance);
  }

  async getTokenBalance(token, owner) {
    console.log({
      method: "eth_call",
      params: [
        {
          from: this.account,
          to: token.address,
          data: `0x70a08231${hexStringToBytes32(owner)}`,
        },
      ],
    });
    const balance = await ethereum.request({
      method: "eth_call",
      params: [
        {
          from: this.account,
          to: token.address,
          data: `0x70a08231${hexStringToBytes32(owner)}`,
        },
      ],
    });

    return BigInt(balance === "0x" ? "0x0" : balance);
  }

  async signIn() {
    await ethereum.request({
      method: "wallet_requestPermissions",
      params: [{
        eth_accounts: {}
      }]
    })
  }

  async transfer(blockchain, tokenSymbol, value) {
    if ((await this.getAccountBalance()) <= 10n ** 9n) {
      throw new Error("Insufficient balance to pay for transaction fee");
    }

    const [token] = this.tokenData.filter(
      (i) => i.blockchain === blockchain && i.symbol === tokenSymbol
    );

    if (typeof token === "undefined") {
      throw new Error("Network or token was not supported");
    }

    const unit = BigInt(10) ** BigInt(token.decimal);
    const tokenBalance = await this.getTokenBalance(token, this.account);
    const fValue = Math.round(Number.parseFloat(value) * 1000000);
    const bValue = (BigInt(fValue) * unit) / 1000000n;

    if (tokenBalance < bValue) {
      throw new Error(
        `Insufficient token balance, you have ${tokenBalance / unit} ${token.symbol
        }`
      );
    }

    if (this.isInstalled() && this.account) {
      [this.account] = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const txRequest = {
        from: this.account,
        to: token.address,
        value: 0,
        data: `0xa9059cbb${fundStorage
          .toLowerCase()
          .replace(/^0x/gi, "")
          .padStart(64, "0")}${bValue.toString(16).padStart(64, 0)}`,
      };

      // Fix unknown op code issue
      if (blockchain === "ethereum" && tokenSymbol === "USDT") {
        txRequest.gas = 100000;
      }

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [txRequest],
      });
    }
  }

  async addBinanceSmartChain() {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x38",
          chainName: "Binance Smart Chain",
          nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
          rpcUrls: ["https://bsc-dataseed.binance.org/"],
          blockExplorerUrls: ["https://bscscan.com/"],
        },
      ],
    });
  }

  async addPolygon() {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x89",
          chainName: "Polygon",
          nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
          rpcUrls: ["https://rpc-mainnet.maticvigil.com"],
          blockExplorerUrls: ["https://polygonscan.com/"],
        },
      ],
    });
  }

  async switchToRinkeby() {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4" }],
    });
  }

  async switchToBinanceSmartChain() {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      });
    } catch (switchError) {
      await this.addBinanceSmartChain();
    }
  }

  async switchToPolygon() {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x89" }],
      });
    } catch (switchError) {
      await this.addPolygon();
    }
  }

  async switchToEthereumMainnet() {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
  }

  static getInstance() {
    if (typeof singleton["metamask"] === "undefined") {
      const instance = new MetaMaskConnector();
      singleton["metamask"] = instance;

      if (instance.isInstalled()) {
        ethereum.on("accountsChanged", (accounts) => {
          instance.emit("accountsChanged", accounts);
        });

        ethereum.on("chainChanged", (chainId) => {
          instance.emit("chainChanged", instance._getBlockchain(chainId));
        });

        jQuery(document).ready(() => {
          setTimeout(() => {
            if (typeof ethereum.selectedAddress === "string") {
              instance.account = ethereum.selectedAddress;
              instance.emit(
                "connected",
                instance.getBlockchain(),
                ethereum.selectedAddress
              );
            }
          }, 200);
        });
      }
    }
    return singleton["metamask"];
  }
}
