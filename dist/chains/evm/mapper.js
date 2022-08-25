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
        accountFromDomain(acc) {
            return acc;
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
        default(p) {
            return p;
        },
    };
}
exports.evmMapper = evmMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYWlucy9ldm0vbWFwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdFQUFxQztBQUNyQyxtQ0FBZ0M7QUFDaEMsMkVBQTZFO0FBVTdFLFNBQWdCLFNBQVMsQ0FDdkIsUUFBbUM7SUFFbkMsT0FBTztRQUNMLFdBQVcsQ0FBQyxHQUFHO1lBQ2IsT0FBTyxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQzdCLENBQUM7UUFDRCxjQUFjLENBQUMsSUFBSTtZQUNqQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxpQkFBaUIsQ0FBQyxHQUFHO1lBQ25CLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELGVBQWUsQ0FBQyxLQUFLO1lBQ25CLE9BQU8sZ0RBQW1CLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBQ0QsY0FBYyxDQUFDLElBQUk7WUFDakIsT0FBTyxJQUFJLHNCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUNELGdCQUFnQixDQUFDLElBQUk7WUFDbkIsT0FBTyxlQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELE9BQU8sQ0FBQyxDQUFDO1lBQ1AsT0FBTyxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUExQkQsOEJBMEJDIn0=