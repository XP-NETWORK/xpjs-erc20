"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmBridgeChain = void 0;
const ethers_1 = require("ethers");
const web3_erc20_contracts_types_1 = require("web3-erc20-contracts-types");
// TODO
const TRANSFER_NATIVE_COST = ethers_1.ethers.BigNumber.from(100000);
// TODO
const TRANSFER_WRAPPED_COST = ethers_1.ethers.BigNumber.from(100000);
function evmBridgeChain(p) {
    const bridge = web3_erc20_contracts_types_1.Bridge__factory.connect(p.bridgeAddr, p.provider);
    const allowanceRequired = async (token, owner, amt) => {
        const allowance = await token.allowance(owner, bridge.address);
        return amt.sub(allowance);
    };
    async function estimateFee(gasLimit) {
        return gasLimit.mul(await p.provider.getGasPrice());
    }
    return {
        tokenBalance(token, address) {
            return token.connect(p.provider).balanceOf(address);
        },
        async tokenParams(token) {
            return {};
        },
        estimateTransferNative() {
            return estimateFee(TRANSFER_NATIVE_COST);
        },
        estimateTransferWrapped() {
            return estimateFee(TRANSFER_WRAPPED_COST);
        },
        async preTransfer(sender, token_, amt) {
            const token = token_.connect(sender);
            const reqd = await allowanceRequired(token, await sender.getAddress(), amt);
            if (reqd.lte(0))
                return undefined;
            return await token.approve(bridge.address, amt).then((tx) => tx.wait());
        },
        transferNative(sender, nativeToken, chainNonce, amt, to, txFee) {
            return bridge
                .connect(sender)
                .sendNative(nativeToken.address, amt, chainNonce, to, { value: txFee })
                .then((tx) => tx.wait());
        },
        transferWrapped(sender, wToken, chainNonce, amt, to, txFee) {
            return bridge
                .connect(sender)
                .sendWrapped(wToken.address, amt, chainNonce, to, { value: txFee })
                .then((tx) => tx.wait());
        },
    };
}
exports.evmBridgeChain = evmBridgeChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYWlucy9ldm0vYnJpZGdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUF3QztBQUV4QywyRUFBeUU7QUFlekUsT0FBTztBQUNQLE1BQU0sb0JBQW9CLEdBQUcsZUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0QsT0FBTztBQUNQLE1BQU0scUJBQXFCLEdBQUcsZUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUQsU0FBZ0IsY0FBYyxDQUFDLENBQVk7SUFDekMsTUFBTSxNQUFNLEdBQUcsNENBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFakUsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLEVBQzdCLEtBQWlCLEVBQ2pCLEtBQWEsRUFDYixHQUFxQixFQUNNLEVBQUU7UUFDN0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0QsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVCLENBQUMsQ0FBQztJQUVGLEtBQUssVUFBVSxXQUFXLENBQ3hCLFFBQTBCO1FBRTFCLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsT0FBTztRQUNMLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTztZQUN6QixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBQ0QsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLO1lBQ3JCLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUNELHNCQUFzQjtZQUNwQixPQUFPLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCx1QkFBdUI7WUFDckIsT0FBTyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUM1QyxDQUFDO1FBQ0QsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUc7WUFDbkMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyQyxNQUFNLElBQUksR0FBRyxNQUFNLGlCQUFpQixDQUNsQyxLQUFLLEVBQ0wsTUFBTSxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQ3pCLEdBQUcsQ0FDSixDQUFDO1lBQ0YsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxPQUFPLFNBQVMsQ0FBQztZQUVsQyxPQUFPLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDMUUsQ0FBQztRQUNELGNBQWMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEtBQUs7WUFDNUQsT0FBTyxNQUFNO2lCQUNWLE9BQU8sQ0FBQyxNQUFNLENBQUM7aUJBQ2YsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7aUJBQ3RFLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUNELGVBQWUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEtBQUs7WUFDeEQsT0FBTyxNQUFNO2lCQUNWLE9BQU8sQ0FBQyxNQUFNLENBQUM7aUJBQ2YsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7aUJBQ2xFLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDN0IsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBdkRELHdDQXVEQyJ9