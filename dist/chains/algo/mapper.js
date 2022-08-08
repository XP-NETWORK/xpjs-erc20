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
        tokenFromDomain: (t) => parseInt(t),
        bigNumFromDomain: (b) => BigInt(b.toString(10)),
        bigNumToDomain: (b) => new bignumber_js_1.default(b.toString()),
    };
}
exports.algoMapper = algoMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYWlucy9hbGdvL21hcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBOEI7QUFDOUIsZ0VBQXFDO0FBVXJDLFNBQWdCLFVBQVU7SUFDeEIsT0FBTztRQUNMLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyQixjQUFjLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLGlCQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMvQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDbkMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLGNBQWMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxzQkFBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUNuRCxDQUFDO0FBQ0osQ0FBQztBQVJELGdDQVFDIn0=