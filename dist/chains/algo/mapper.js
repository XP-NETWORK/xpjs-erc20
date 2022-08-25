"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.algoMapper = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
function algoMapper() {
    return {
        txnToDomain: (s) => s,
        addrFromDomain: (a) => algosdk_1.default.decodeAddress(a),
        accountFromDomain(acc) {
            return acc;
        },
        tokenFromDomain: (t) => parseInt(t),
        bigNumFromDomain: (b) => BigInt(b.toString(10)),
        bigNumToDomain: (b) => new bignumber_js_1.default(b.toString()),
        default: (p) => p,
    };
}
exports.algoMapper = algoMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYWlucy9hbGdvL21hcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBOEI7QUFDOUIsZ0VBQXFDO0FBVXJDLFNBQWdCLFVBQVU7SUFDeEIsT0FBTztRQUNMLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyQixjQUFjLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLGlCQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMvQyxpQkFBaUIsQ0FBQyxHQUFHO1lBQ25CLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNuQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0MsY0FBYyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLHNCQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xELE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNsQixDQUFDO0FBQ0osQ0FBQztBQVpELGdDQVlDIn0=