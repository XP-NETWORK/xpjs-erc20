"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainInfo = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const crypto_exchange_rate_1 = require("crypto-exchange-rate");
const algo_1 = require("../chains/algo");
const evm_1 = require("../chains/evm");
const meta_1 = require("./meta");
const EVM_DECIMALS = new bignumber_js_1.default(10).exponentiatedBy(18).integerValue();
const ALGO_DECIMALS = new bignumber_js_1.default(10).exponentiatedBy(6).integerValue();
exports.ChainInfo = {
    [meta_1.ChainNonce.Ethereum]: {
        name: "Ethereum",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.ETH,
        // TODO
        blockExplorer: "",
        addrExplorer: "",
        txExplorer: "",
        xpnetToken: "",
    },
    [meta_1.ChainNonce.Ropsten]: {
        name: "Ropsten",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.ETH,
        // TODO
        blockExplorer: "",
        addrExplorer: "",
        txExplorer: "",
        xpnetToken: "",
    },
    [meta_1.ChainNonce.BSC]: {
        name: "BSC",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.BNB,
        // TODO
        blockExplorer: "",
        addrExplorer: "https://bscscan.com/address/",
        txExplorer: "https://bscscan.com/tx/",
        xpnetToken: "0x8cf8238abf7b933Bf8BB5Ea2C7E4Be101c11de2A",
    },
    [meta_1.ChainNonce.BSCTestNet]: {
        name: "BSC TestNet",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.BNB,
        // TODO
        blockExplorer: "",
        addrExplorer: "",
        txExplorer: "",
        xpnetToken: "",
    },
    [meta_1.ChainNonce.Polygon]: {
        name: "Polygon",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.MATIC,
        // TODO
        blockExplorer: "",
        addrExplorer: "",
        txExplorer: "",
        xpnetToken: "",
    },
    [meta_1.ChainNonce.Mumbai]: {
        name: "Mumbai",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.MATIC,
        // TODO
        blockExplorer: "",
        addrExplorer: "",
        txExplorer: "",
        xpnetToken: "",
    },
    [meta_1.ChainNonce.Fantom]: {
        name: "Fantom",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.FTM,
        // TODO
        blockExplorer: "",
        addrExplorer: "",
        txExplorer: "",
        xpnetToken: "",
    },
    [meta_1.ChainNonce.FantomTestNet]: {
        name: "Fantom TestNet",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.FTM,
        // TODO
        blockExplorer: "",
        addrExplorer: "",
        txExplorer: "",
        xpnetToken: "",
    },
    [meta_1.ChainNonce.Algorand]: {
        name: "Algorand",
        decimals: ALGO_DECIMALS,
        factory: algo_1.algoBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.ALGO,
        // TODO
        blockExplorer: "",
        addrExplorer: "https://algoexplorer.io/address/",
        txExplorer: "https://algoexplorer.io/tx/",
        xpnetToken: "855071472",
    },
    [meta_1.ChainNonce.AlgorandTestnet]: {
        name: "Algorand TestNet",
        decimals: ALGO_DECIMALS,
        factory: algo_1.algoBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.ALGO,
        // TODO
        blockExplorer: "",
        addrExplorer: "",
        txExplorer: "",
        xpnetToken: "",
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW4taW5mby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tdWx0aS1icmlkZ2UvY2hhaW4taW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnRUFBcUM7QUFDckMsK0RBQXlEO0FBQ3pELHlDQUFtRDtBQUNuRCx1Q0FBaUQ7QUFDakQsaUNBQStEO0FBZS9ELE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDMUUsTUFBTSxhQUFhLEdBQUcsSUFBSSxzQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUU3RCxRQUFBLFNBQVMsR0FBYztJQUNsQyxDQUFDLGlCQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDckIsSUFBSSxFQUFFLFVBQVU7UUFDaEIsUUFBUSxFQUFFLFlBQVk7UUFDdEIsT0FBTyxFQUFFLHNCQUFnQjtRQUN6QixRQUFRLEVBQUUsd0NBQWlCLENBQUMsR0FBRztRQUMvQixPQUFPO1FBQ1AsYUFBYSxFQUFFLEVBQUU7UUFDakIsWUFBWSxFQUFFLEVBQUU7UUFDaEIsVUFBVSxFQUFFLEVBQUU7UUFDZCxVQUFVLEVBQUUsRUFBRTtLQUNmO0lBQ0QsQ0FBQyxpQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BCLElBQUksRUFBRSxTQUFTO1FBQ2YsUUFBUSxFQUFFLFlBQVk7UUFDdEIsT0FBTyxFQUFFLHNCQUFnQjtRQUN6QixRQUFRLEVBQUUsd0NBQWlCLENBQUMsR0FBRztRQUMvQixPQUFPO1FBQ1AsYUFBYSxFQUFFLEVBQUU7UUFDakIsWUFBWSxFQUFFLEVBQUU7UUFDaEIsVUFBVSxFQUFFLEVBQUU7UUFDZCxVQUFVLEVBQUUsRUFBRTtLQUNmO0lBQ0QsQ0FBQyxpQkFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFF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