import BigNumber from "bignumber.js";
import { ExchangeRateRepo } from "crypto-exchange-rate";
import { chainMapCombine, MappedBridgeChain } from "../chains";
import { ScVerifyRepo } from "../external/sc-verify";
import { ChainInfo } from "./chain-info";
import { ChainNonces } from "./meta";
import {
  InferBridgeChain,
  InferChainArgs,
  InferChainMeta,
  InferParams,
} from "./type-utils";

export type Erc20MultiBridge = {
  inner<T extends ChainNonces>(nonce: T): Promise<InferBridgeChain<T>>;

  tokenBalance<T extends ChainNonces>(
    nonce: T,
    token: string,
    addr: string
  ): Promise<BigNumber>;

  estimateFees<S extends ChainNonces, R extends ChainNonces>(
    sourceNonce: S,
    token: string,
    targetNonce: R
  ): Promise<BigNumber>;

  preTransfer<T extends ChainNonces>(
    nonce: T,
    sender: InferChainArgs<T>[0],
    token: string,
    amt: BigNumber
  ): Promise<string | undefined>;

  transferTokens<T extends ChainNonces, R extends ChainNonces>(
    nonce: T,
    sender: InferChainArgs<T>[0],
    token: string,
    chainNonce: R,
    amt: BigNumber,
    to: string,
    txFee?: BigNumber
  ): Promise<string>;
};

export type MultiBridgeParams = Partial<{
  [K in ChainNonces]: InferParams<K>;
}>;

export type MultiBridgeDeps = {
  scVerify: ScVerifyRepo;
  exchangeRate: ExchangeRateRepo;
};

type SupBridgeChain<T extends ChainNonces> = MappedBridgeChain<
  InferBridgeChain<T>
>;

export function erc20MultiBridge(
  p: MultiBridgeParams,
  d: MultiBridgeDeps
): Erc20MultiBridge {
  let innerCache: Partial<{
    [K in ChainNonces]: InferChainMeta<K>;
  }> = {};
  let chainCache: Partial<{
    [K in ChainNonces]: SupBridgeChain<K>;
  }> = {};

  function getChainParams<T extends ChainNonces>(nonce: T): InferParams<T> {
    const params = p[nonce];
    if (!params) throw Error("chain not enabled!");

    return params;
  }

  function inner<T extends ChainNonces>(nonce: T): InferChainMeta<T> {
    const cachedInner = innerCache[nonce];
    if (cachedInner) return cachedInner! as InferChainMeta<T>;

    const uChain = ChainInfo[nonce].factory(
      getChainParams(nonce)
    ) as InferChainMeta<T>;
    innerCache[nonce] = uChain as any;

    return uChain;
  }

  function getChain<T extends ChainNonces>(nonce: T): SupBridgeChain<T> {
    const cachedChain = chainCache[nonce];
    if (cachedChain) return cachedChain!;

    const uChain = inner<T>(nonce);
    const chain = chainMapCombine(uChain as any);
    chainCache[nonce] = chain;

    return chain;
  }

  async function isWrappedToken(chainNonce: number, token: string) {
    const res = await d.scVerify.getTokenPairByWrapped(chainNonce, token);
    return res != undefined;
  }

  function checkDecimals(val: BigNumber, fromC: ChainNonces, toC: ChainNonces) {
    return val
      .div(ChainInfo[fromC].decimals)
      .times(ChainInfo[toC].decimals)
      .integerValue()
      .div(ChainInfo[toC].decimals)
      .times(ChainInfo[fromC].decimals)
      .eq(val);
  }

  const estimateFees: Erc20MultiBridge["estimateFees"] = async (
    sn,
    token,
    tn
  ) => {
    const chain = getChain(tn);
    let estimator;
    if (await isWrappedToken(sn, token)) {
      estimator = chain.estimateTransferWrapped;
    } else {
      estimator = chain.estimateTransferNative;
    }
    const estimate = await estimator();
    const exRate = await d.exchangeRate.getExchangeRate(
      ChainInfo[tn].currency,
      ChainInfo[sn].currency
    );

    return estimate
      .div(ChainInfo[tn].decimals)
      .times(exRate * 1.1)
      .times(ChainInfo[sn].decimals)
      .integerValue();
  };

  return {
    inner: <T extends ChainNonces>(n: T) => Promise.resolve(inner(n)[0]),
    tokenBalance: async (n, token, addr) => {
      const chain = getChain(n);
      return await chain.tokenBalance(token, addr);
    },
    estimateFees,
    async preTransfer(n, s, t, a) {
      if (await isWrappedToken(n, t)) return undefined;

      const chain = getChain(n);

      return await chain.preTransfer(s, t, a);
    },
    async transferTokens(n, s, t, cn, a, to, tf) {
      if (!checkDecimals(a, n, cn))
        throw Error(
          "Target Chain is not precise enough! round your value to prevent loss"
        );

      const chain = getChain(n);
      const txFee = tf || (await estimateFees(n, t, cn));

      let res;
      if (await isWrappedToken(n, t)) {
        res = chain.transferWrapped(s, t, cn, a, to, txFee);
      } else {
        res = chain.transferNative(s, t, cn, a, to, txFee);
      }

      return await res;
    },
  };
}
