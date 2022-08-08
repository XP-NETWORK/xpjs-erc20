"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainNetBridgeDeps = void 0;
const exchange_rate_1 = require("./exchange-rate");
const notifier_1 = require("./notifier");
const sc_verify_1 = require("./sc-verify");
function mainNetBridgeDeps() {
    return {
        scVerify: (0, sc_verify_1.scVerifyRepo)("https://token-sc-verify.xp.network"),
        exchangeRate: (0, exchange_rate_1.exchangeRateRepo)("https://testing-bridge.xp.network/exchange"),
        notifier: (0, notifier_1.evNotifier)("https://token-notifier.xp.network"),
    };
}
exports.mainNetBridgeDeps = mainNetBridgeDeps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHRlcm5hbC9kZXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUFtRDtBQUNuRCx5Q0FBd0M7QUFDeEMsMkNBQTJDO0FBRTNDLFNBQWdCLGlCQUFpQjtJQUMvQixPQUFPO1FBQ0wsUUFBUSxFQUFFLElBQUEsd0JBQVksRUFBQyxvQ0FBb0MsQ0FBQztRQUM1RCxZQUFZLEVBQUUsSUFBQSxnQ0FBZ0IsRUFDNUIsNENBQTRDLENBQzdDO1FBQ0QsUUFBUSxFQUFFLElBQUEscUJBQVUsRUFBQyxtQ0FBbUMsQ0FBQztLQUMxRCxDQUFDO0FBQ0osQ0FBQztBQVJELDhDQVFDIn0=