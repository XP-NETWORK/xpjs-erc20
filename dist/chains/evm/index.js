"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmBridgeFactory = void 0;
const bridge_1 = require("./bridge");
const mapper_1 = require("./mapper");
function evmBridgeFactory(p) {
    return [(0, bridge_1.evmBridgeChain)(p), (0, mapper_1.evmMapper)(p.provider)];
}
exports.evmBridgeFactory = evmBridgeFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2hhaW5zL2V2bS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUU7QUFDckUscUNBQTJEO0FBSTNELFNBQWdCLGdCQUFnQixDQUFDLENBQVk7SUFDM0MsT0FBTyxDQUFDLElBQUEsdUJBQWMsRUFBQyxDQUFDLENBQUMsRUFBRSxJQUFBLGtCQUFTLEVBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUZELDRDQUVDIn0=