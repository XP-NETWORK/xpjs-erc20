import BigNumber from "bignumber.js";
import { SupportedCurrency } from "crypto-exchange-rate";
import { algoBridgeFactory } from "../chains/algo";
import { evmBridgeFactory } from "../chains/evm";
import { ChainMetaMap, ChainNonce, ChainNonces } from "./meta";

type ChainInfo = {
  [K in ChainNonces]: {
    name: string;
    decimals: BigNumber;
    factory: ChainMetaMap[K];
    currency: SupportedCurrency;
    blockExplorer: string;
    addrExplorer: string;
    txExplorer: string;
    xpnetToken: string;
  };
};

const EVM_DECIMALS = new BigNumber(10).exponentiatedBy(18).integerValue();
const ALGO_DECIMALS = new BigNumber(10).exponentiatedBy(6).integerValue();

export const ChainInfo: ChainInfo = {
  [ChainNonce.Ethereum]: {
    name: "Ethereum",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.ETH,
    // TODO
    blockExplorer: "",
    addrExplorer: "",
    txExplorer: "",
    xpnetToken: "",
  },
  [ChainNonce.Ropsten]: {
    name: "Ropsten",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.ETH,
    // TODO
    blockExplorer: "",
    addrExplorer: "",
    txExplorer: "",
    xpnetToken: "",
  },
  [ChainNonce.BSC]: {
    name: "BSC",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.BNB,
    // TODO
    blockExplorer: "",
    addrExplorer: "https://bscscan.com/address/",
    txExplorer: "https://bscscan.com/tx/",
    xpnetToken: "0x8cf8238abf7b933Bf8BB5Ea2C7E4Be101c11de2A",
  },
  [ChainNonce.BSCTestNet]: {
    name: "BSC TestNet",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.BNB,
    // TODO
    blockExplorer: "",
    addrExplorer: "",
    txExplorer: "",
    xpnetToken: "",
  },
  [ChainNonce.Polygon]: {
    name: "Polygon",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.MATIC,
    // TODO
    blockExplorer: "",
    addrExplorer: "",
    txExplorer: "",
    xpnetToken: "",
  },
  [ChainNonce.Mumbai]: {
    name: "Mumbai",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.MATIC,
    // TODO
    blockExplorer: "",
    addrExplorer: "",
    txExplorer: "",
    xpnetToken: "",
  },
  [ChainNonce.Fantom]: {
    name: "Fantom",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.FTM,
    // TODO
    blockExplorer: "",
    addrExplorer: "",
    txExplorer: "",
    xpnetToken: "",
  },
  [ChainNonce.FantomTestNet]: {
    name: "Fantom TestNet",
    decimals: EVM_DECIMALS,
    factory: evmBridgeFactory,
    currency: SupportedCurrency.FTM,
    // TODO
    blockExplorer: "",
    addrExplorer: "",
    txExplorer: "",
    xpnetToken: "",
  },
  [ChainNonce.Algorand]: {
    name: "Algorand",
    decimals: ALGO_DECIMALS,
    factory: algoBridgeFactory,
    currency: SupportedCurrency.ALGO,
    // TODO
    blockExplorer: "",
    addrExplorer: "https://algoexplorer.io/address/",
    txExplorer: "https://algoexplorer.io/tx/",
    xpnetToken: "855071472",
  },
  [ChainNonce.AlgorandTestnet]: {
    name: "Algorand TestNet",
    decimals: ALGO_DECIMALS,
    factory: algoBridgeFactory,
    currency: SupportedCurrency.ALGO,
    // TODO
    blockExplorer: "",
    addrExplorer: "",
    txExplorer: "",
    xpnetToken: "",
  },
};
