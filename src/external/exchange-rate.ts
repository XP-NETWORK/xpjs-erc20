import {
  cachedExchangeRateRepo,
  networkBatchExchangeRateRepo,
  NetworkModel,
} from "crypto-exchange-rate";

export function exchangeRateRepo(baseUrl: string) {
  const baseService = NetworkModel.batchExchangeRateService(baseUrl);

  return cachedExchangeRateRepo(
    networkBatchExchangeRateRepo(
      baseService,
      NetworkModel.exchangeRateDtoMapper()
    )
  );
}
