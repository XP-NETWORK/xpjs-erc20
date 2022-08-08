import { exchangeRateRepo } from "./exchange-rate";
import { evNotifier } from "./notifier";
import { scVerifyRepo } from "./sc-verify";

export function mainNetBridgeDeps() {
  return {
    scVerify: scVerifyRepo("https://token-sc-verify.xp.network"),
    exchangeRate: exchangeRateRepo(
      "https://testing-bridge.xp.network/exchange"
    ),
    notifier: evNotifier("https://token-notifier.xp.network"),
  };
}
