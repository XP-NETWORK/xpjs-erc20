"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.algoBridgeFactory = exports.typedAlgoSigner = void 0;
const bridge_1 = require("./bridge");
const mapper_1 = require("./mapper");
var signer_1 = require("./signer");
Object.defineProperty(exports, "typedAlgoSigner", { enumerable: true, get: function () { return signer_1.typedAlgoSigner; } });
function algoBridgeFactory(p) {
    return [(0, bridge_1.algoBridgeChain)(p), (0, mapper_1.algoMapper)()];
}
exports.algoBridgeFactory = algoBridgeFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2hhaW5zL2FsZ28vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXdFO0FBQ3hFLHFDQUE2RDtBQUM3RCxtQ0FBd0Q7QUFBbEMseUdBQUEsZUFBZSxPQUFBO0FBSXJDLFNBQWdCLGlCQUFpQixDQUFDLENBQWE7SUFDN0MsT0FBTyxDQUFDLElBQUEsd0JBQWUsRUFBQyxDQUFDLENBQUMsRUFBRSxJQUFBLG1CQUFVLEdBQUUsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFGRCw4Q0FFQyJ9