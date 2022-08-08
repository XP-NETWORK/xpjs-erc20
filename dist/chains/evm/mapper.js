"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmMapper = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const web3_erc20_contracts_types_1 = require("web3-erc20-contracts-types");
function evmMapper(provider) {
    return {
        txnToDomain(txn) {
            return txn.transactionHash;
        },
        addrFromDomain(addr) {
            return addr;
        },
        tokenFromDomain(token) {
            return web3_erc20_contracts_types_1.DummyErc20__factory.connect(token, provider);
        },
        bigNumToDomain(bign) {
            return new bignumber_js_1.default(bign.toString());
        },
        bigNumFromDomain(bign) {
            return ethers_1.ethers.BigNumber.from(bign.toString(10));
        },
    };
}
exports.evmMapper = evmMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYWlucy9ldm0vbWFwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdFQUFxQztBQUNyQyxtQ0FBZ0M7QUFDaEMsMkVBQTZFO0FBVTdFLFNBQWdCLFNBQVMsQ0FDdkIsUUFBbUM7SUFFbkMsT0FBTztRQUNMLFdBQVcsQ0FBQyxHQUFHO1lBQ2IsT0FBTyxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQzdCLENBQUM7UUFDRCxjQUFjLENBQUMsSUFBSTtZQUNqQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxlQUFlLENBQUMsS0FBSztZQUNuQixPQUFPLGdEQUFtQixDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUNELGNBQWMsQ0FBQyxJQUFJO1lBQ2pCLE9BQU8sSUFBSSxzQkFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDRCxnQkFBZ0IsQ0FBQyxJQUFJO1lBQ25CLE9BQU8sZUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQXBCRCw4QkFvQkMifQ==