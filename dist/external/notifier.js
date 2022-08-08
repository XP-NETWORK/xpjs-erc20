"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evNotifier = void 0;
const axios_1 = __importDefault(require("axios"));
const meta_1 = require("../multi-bridge/meta");
function evNotifier(url) {
    const api = axios_1.default.create({
        baseURL: url,
    });
    async function web3Notify(chainNonce, txHash) {
        api.post("/tx/web3", {
            chain_nonce: chainNonce,
            tx_hash: txHash,
        });
    }
    async function algorandNotify(txHash) {
        api.post("/tx/algorand", {
            tx_hash: txHash,
        });
    }
    return {
        async notifyValidator(fromChain, txHash) {
            switch (fromChain) {
                case meta_1.ChainNonce.Algorand:
                case meta_1.ChainNonce.AlgorandTestnet:
                    await algorandNotify(txHash);
                    break;
                default:
                    await web3Notify(fromChain, txHash);
                    break;
            }
        },
    };
}
exports.evNotifier = evNotifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXh0ZXJuYWwvbm90aWZpZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLCtDQUFrRDtBQUlsRCxTQUFnQixVQUFVLENBQUMsR0FBVztJQUNwQyxNQUFNLEdBQUcsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLE9BQU8sRUFBRSxHQUFHO0tBQ2IsQ0FBQyxDQUFDO0lBRUgsS0FBSyxVQUFVLFVBQVUsQ0FBQyxVQUFrQixFQUFFLE1BQWM7UUFDMUQsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsV0FBVyxFQUFFLFVBQVU7WUFDdkIsT0FBTyxFQUFFLE1BQU07U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssVUFBVSxjQUFjLENBQUMsTUFBYztRQUMxQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixPQUFPLEVBQUUsTUFBTTtTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsT0FBTztRQUNMLEtBQUssQ0FBQyxlQUFlLENBQUMsU0FBaUIsRUFBRSxNQUFjO1lBQ3JELFFBQVEsU0FBUyxFQUFFO2dCQUNqQixLQUFLLGlCQUFVLENBQUMsUUFBUSxDQUFDO2dCQUN6QixLQUFLLGlCQUFVLENBQUMsZUFBZTtvQkFDN0IsTUFBTSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzdCLE1BQU07Z0JBQ1I7b0JBQ0UsTUFBTSxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNwQyxNQUFNO2FBQ1Q7UUFDSCxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUEvQkQsZ0NBK0JDIn0=