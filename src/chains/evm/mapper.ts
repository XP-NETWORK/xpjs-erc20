import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { DummyErc20, DummyErc20__factory } from "web3-erc20-contracts-types";
import { BridgeChainMapper } from "..";

export type EvmBridgeChainMapper = BridgeChainMapper<
  DummyErc20,
  ethers.BigNumber,
  ethers.ContractTransaction,
  string
>;

export function evmMapper(
  provider: ethers.providers.Provider
): EvmBridgeChainMapper {
  return {
    txnToDomain(txn) {
      return txn.hash;
    },
    addrFromDomain(addr) {
      return addr;
    },
    tokenFromDomain(token) {
      return DummyErc20__factory.connect(token, provider);
    },
    bigNumToDomain(bign) {
      return new BigNumber(bign.toString());
    },
    bigNumFromDomain(bign) {
      return ethers.BigNumber.from(bign.toString(10));
    },
  };
}
