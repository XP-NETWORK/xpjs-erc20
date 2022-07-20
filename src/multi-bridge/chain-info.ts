import BigNumber from "bignumber.js";
import { SupportedCurrency } from "crypto-exchange-rate";
import { evmBridgeFactory } from "../chains/evm";
import { ChainMetaMap, ChainNonce, ChainNonces } from "./meta";

type ChainInfo = {
  [K in ChainNonces]: {
    name: string;
    decimals: BigNumber;
    factory: ChainMetaMap[K];
    currency: SupportedCurrency;
    blockExplorer: string;
  };
};

const EVM_DECIMALS = new BigNumber(10).exponentiatedBy(18);

export const ChainInfo: ChainInfo = {
  [ChainNonce.Ethereum]: {
    name: "Ethereum",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.ETH,
    // TODO
    blockExplorer: "",
  },
  [ChainNonce.Ropsten]: {
    name: "Ropsten",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.ETH,
    // TODO
    blockExplorer: "",
  },
  [ChainNonce.BSC]: {
    name: "BSC",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.BNB,
    // TODO
    blockExplorer: "",
  },
  [ChainNonce.BSCTestNet]: {
    name: "BSC TestNet",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.BNB,
    // TODO
    blockExplorer: "",
  },
  [ChainNonce.Polygon]: {
    name: "Polygon",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.MATIC,
    // TODO
    blockExplorer: "",
  },
  [ChainNonce.Mumbai]: {
    name: "Mumbai",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.MATIC,
    // TODO
    blockExplorer: "",
  },
  [ChainNonce.Fantom]: {
    name: "Fantom",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.FTM,
    // TODO
    blockExplorer: "",
  },
  [ChainNonce.FantomTestNet]: {
    name: "Fantom TestNet",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.FTM,
    // TODO
    blockExplorer: "",
  },
};
