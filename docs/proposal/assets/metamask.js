const singleton = {};

class MetaMaskConnector {
  account = undefined;

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
    /*
    {
      blockchain: "rinkeby",
      name: "DAI Test",
      address: "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
      symbol: "DAI",
      decimal: 18,
    },
    */
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
    throw new Error("You must connect the wallet first");
  }

  async getBlockchain() {
    switch (ethereum.chainId) {
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

  async getAccountBalance() {
    const balance = await ethereum.request({
      method: "eth_getBalance",
      params: [this.account, "latest"],
    });
    console.log(balance);
    return BigInt(balance === "0x" ? "0x0" : balance);
  }

  async getTokenBalance(token, owner) {
    const balance = await ethereum.request({
      method: "eth_call",
      params: [
        {
          from: this.account,
          to: token.address,
          data: `0x70a08231${owner.replace(/^0x/gi, "").padStart(64, 0)}`,
        },
      ],
    });

    return BigInt(balance === "0x" ? "0x0" : balance);
  }

  async donate(blockchain, tokenSymbol, value) {
    if ((await this.getAccountBalance()) <= 10n ** 9n) {
      throw new Error("Insufficient balance to pay for transaction fee");
    }

    const [token] = this.tokenData.filter(
      (i) => i.symbol === tokenSymbol && i.blockchain === blockchain
    );

    if (typeof token === "undefined") {
      throw new Error("Network or token was not supported");
    }

    const unit = BigInt(10) ** BigInt(token.decimal);
    const tokenBalance = await this.getTokenBalance(token, this.account);
    const bValue = BigInt(value) * unit;

    if (tokenBalance < bValue) {
      throw new Error(
        `Insufficient token balance, you have ${tokenBalance / unit} ${
          token.symbol
        }`
      );
    }

    if (this.isInstalled() && this.account) {
      [this.account] = await ethereum.request({
        method: "eth_requestAccounts",
      });
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: this.account,
            to: token.address,
            value: 0,
            data: `0xa9059cbb0000000000000000000000007ed1908819cc4e8382d3fdf145b7e2555a9fb6db${bValue
              .toString(16)
              .padStart(64, 0)}`,
          },
        ],
      });
    }
  }

  static getInstance() {
    if (typeof singleton["metamask"] === "undefined") {
      singleton["metamask"] = new MetaMaskConnector();
    }
    return singleton["metamask"];
  }
}
