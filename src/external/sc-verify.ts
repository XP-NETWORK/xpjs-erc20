import axios, { AxiosError } from "axios";

type TokenQueryResp = {
  nativeChain: number;
  wrappedChain: number;
  nativeToken: string;
  wrappedToken: string;
};

type ApiResp<T> = {
  status: string;
  code: number;
  data: T;
};

export type ScVerifyRepo = ReturnType<typeof scVerifyRepo>;

function handleScVerifyErr(e: AxiosError) {
  if (e.response?.status != 404) {
    console.warn(
      "sc-verify: getWrappedToken: unhandled error",
      e.message,
      "resp",
      e.response
    );
  }
  return undefined;
}

export function scVerifyRepo(baseURL: string) {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    async getWrappedToken(
      nativeChainId: number,
      wrappedChainId: number,
      nativeToken: string
    ) {
      const res = await client
        .post<ApiResp<TokenQueryResp>>("/token/by-native", {
          nativeChain: nativeChainId,
          wrappedChain: wrappedChainId,
          nativeToken,
        })
        .catch(handleScVerifyErr);

      return res?.data.data.wrappedToken;
    },
    async getTokenPairByWrapped(wrappedChainId: number, wrappedToken: string) {
      const res = await client
        .post<ApiResp<TokenQueryResp>>("/token/by-wrapped", {
          wrappedChain: wrappedChainId,
          wrappedToken: wrappedToken,
        })
        .catch(handleScVerifyErr);

      return res?.data.data;
    },
  };
}
