import algosdk from "algosdk";
import BigNumber from "bignumber.js";
import { BridgeChainMapper } from "..";

export type AlgoBridgeChainMapper = BridgeChainMapper<
  number,
  bigint,
  string,
  algosdk.Address
>;

export function algoMapper(): AlgoBridgeChainMapper {
  return {
    txnToDomain: (s) => s,
    addrFromDomain: (a) => algosdk.decodeAddress(a),
    tokenFromDomain: (t) => parseInt(t),
    bigNumFromDomain: (b) => BigInt(b.toString(10)),
    bigNumToDomain: (b) => new BigNumber(b.toString()),
    default: (p) => p,
  };
}
