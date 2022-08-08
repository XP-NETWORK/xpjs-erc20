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
    },
    [meta_1.ChainNonce.Ropsten]: {
        name: "Ropsten",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.ETH,
        // TODO
        blockExplorer: "",
    },
    [meta_1.ChainNonce.BSC]: {
        name: "BSC",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.BNB,
        // TODO
        blockExplorer: "",
    },
    [meta_1.ChainNonce.BSCTestNet]: {
        name: "BSC TestNet",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.BNB,
        // TODO
        blockExplorer: "",
    },
    [meta_1.ChainNonce.Polygon]: {
        name: "Polygon",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.MATIC,
        // TODO
        blockExplorer: "",
    },
    [meta_1.ChainNonce.Mumbai]: {
        name: "Mumbai",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.MATIC,
        // TODO
        blockExplorer: "",
    },
    [meta_1.ChainNonce.Fantom]: {
        name: "Fantom",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.FTM,
        // TODO
        blockExplorer: "",
    },
    [meta_1.ChainNonce.FantomTestNet]: {
        name: "Fantom TestNet",
        decimals: EVM_DECIMALS,
        factory: evm_1.evmBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.FTM,
        // TODO
        blockExplorer: "",
    },
    [meta_1.ChainNonce.Algorand]: {
        name: "Algorand",
        decimals: ALGO_DECIMALS,
        factory: algo_1.algoBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.ALGO,
        // TODO
        blockExplorer: "",
    },
    [meta_1.ChainNonce.AlgorandTestnet]: {
        name: "Algorand TestNet",
        decimals: ALGO_DECIMALS,
        factory: algo_1.algoBridgeFactory,
        currency: crypto_exchange_rate_1.SupportedCurrency.ALGO,
        // TODO
        blockExplorer: "",
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW4taW5mby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tdWx0aS1icmlkZ2UvY2hhaW4taW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnRUFBcUM7QUFDckMsK0RBQXlEO0FBQ3pELHlDQUFtRDtBQUNuRCx1Q0FBaUQ7QUFDakQsaUNBQStEO0FBWS9ELE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDMUUsTUFBTSxhQUFhLEdBQUcsSUFBSSxzQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUU3RCxRQUFBLFNBQVMsR0FBYztJQUNsQyxDQUFDLGlCQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDckIsSUFBSSxFQUFFLFVBQVU7UUFDaEIsUUFBUSxFQUFFLFlBQVk7UUFDdEIsT0FBTyxFQUFFLHNCQUFnQjtRQUN6QixRQUFRLEVBQUUsd0NBQWlCLENBQUMsR0FBRztRQUMvQixPQUFPO1FBQ1AsYUFBYSxFQUFFLEVBQUU7S0FDbEI7SUFDRCxDQUFDLGlCQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDcEIsSUFBSSxFQUFFLFNBQVM7UUFDZixRQUFRLEVBQUUsWUFBWTtRQUN0QixPQUFPLEVBQUUsc0JBQWdCO1FBQ3pCLFFBQVEsRUFBRSx3Q0FBaUIsQ0FBQyxHQUFHO1FBQy9CLE9BQU87UUFDUCxhQUFhLEVBQUUsRUFBRTtLQUNsQjtJQUNELENBQUMsaUJBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNoQixJQUFJLEVBQUUsS0FBSztRQUNYLFFBQVEsRUFBRSxZQUFZO1FBQ3RCLE9BQU8sRUFBRSxzQkFBZ0I7UUFDekIsUUFBUSxFQUFFLHdDQUFpQixDQUFDLEdBQUc7UUFDL0IsT0FBTztRQUNQLGFBQWEsRUFBRSxFQUFFO0tBQ2xCO0lBQ0QsQ0FBQyxpQkFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3ZCLElBQUksRUFBRSxhQUFhO1FBQ25CLFFBQVEsRUFBRSxZQUFZO1FBQ3RCLE9BQU8sRUFBRSxzQkFBZ0I7UUFDekIsUUFBUSxFQUFFLHdDQUFpQixDQUFDLEdBQUc7UUFDL0IsT0FBTztRQUNQLGFBQWEsRUFBRSxFQUFFO0tBQ2xCO0lBQ0QsQ0FBQyxpQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BCLElBQUksRUFBRSxTQUFTO1FBQ2YsUUFBUSxFQUFFLFlBQVk7UUFDdEIsT0FBTyxFQUFFLHNCQUFnQjtRQUN6QixRQUFRLEVBQUUsd0NBQWlCLENBQUMsS0FBSztRQUNqQyxPQUFPO1FBQ1AsYUFBYSxFQUFFLEVBQUU7S0FDbEI7SUFDRCxDQUFDLGlCQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDbkIsSUFBSSxFQUFFLFFBQVE7UUFDZCxRQUFRLEVBQUUsWUFBWTtRQUN0QixPQUFPLEVBQUUsc0JBQWdCO1FBQ3pCLFFBQVEsRUFBRSx3Q0FBaUIsQ0FBQyxLQUFLO1FBQ2pDLE9BQU87UUFDUCxhQUFhLEVBQUUsRUFBRTtLQUNsQjtJQUNELENBQUMsaUJBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNuQixJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSxZQUFZO1FBQ3RCLE9BQU8sRUFBRSxzQkFBZ0I7UUFDekIsUUFBUSxFQUFFLHdDQUFpQixDQUFDLEdBQUc7UUFDL0IsT0FBTztRQUNQLGFBQWEsRUFBRSxFQUFFO0tBQ2xCO0lBQ0QsQ0FBQyxpQkFBVSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQzFCLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsUUFBUSxFQUFFLFlBQVk7UUFDdEIsT0FBTyxFQUFFLHNCQUFnQjtRQUN6QixRQUFRLEVBQUUsd0NBQWlCLENBQUMsR0FBRztRQUMvQixPQUFPO1FBQ1AsYUFBYSxFQUFFLEVBQUU7S0FDbEI7SUFDRCxDQUFDLGlCQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDckIsSUFBSSxFQUFFLFVBQVU7UUFDaEIsUUFBUSxFQUFFLGFBQWE7UUFDdkIsT0FBTyxFQUFFLHdCQUFpQjtRQUMxQixRQUFRLEVBQUUsd0NBQWlCLENBQUMsSUFBSTtRQUNoQyxPQUFPO1FBQ1AsYUFBYSxFQUFFLEVBQUU7S0FDbEI7SUFDRCxDQUFDLGlCQUFVLENBQUMsZUFBZSxDQUFDLEVBQUU7UUFDNUIsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixRQUFRLEVBQUUsYUFBYTtRQUN2QixPQUFPLEVBQUUsd0JBQWlCO1FBQzFCLFFBQVEsRUFBRSx3Q0FBaUIsQ0FBQyxJQUFJO1FBQ2hDLE9BQU87UUFDUCxhQUFhLEVBQUUsRUFBRTtLQUNsQjtDQUNGLENBQUMifQ==