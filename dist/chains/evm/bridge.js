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
        async balance(address) {
            return await p.provider.getBalance(address);
        },
        tokenBalance(token, address) {
            return token.connect(p.provider).balanceOf(address);
        },
        async tokenParams(token) {
            const symbol = await token.connect(p.provider).symbol();
            return { symbol };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYWlucy9ldm0vYnJpZGdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtRDtBQUVuRCwyRUFBeUU7QUFlekUsT0FBTztBQUNQLE1BQU0sb0JBQW9CLEdBQUcsZUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0QsT0FBTztBQUNQLE1BQU0scUJBQXFCLEdBQUcsZUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUQsU0FBZ0IsY0FBYyxDQUFDLENBQVk7SUFDekMsTUFBTSxNQUFNLEdBQUcsNENBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFakUsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLEVBQzdCLEtBQWlCLEVBQ2pCLEtBQWEsRUFDYixHQUFxQixFQUNNLEVBQUU7UUFDN0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0QsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVCLENBQUMsQ0FBQztJQUVGLEtBQUssVUFBVSxXQUFXLENBQ3hCLFFBQTBCO1FBRTFCLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsT0FBTztRQUNMLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTztZQUNuQixPQUFPLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNELFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTztZQUN6QixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBQ0QsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLO1lBQ3JCLE1BQU0sTUFBTSxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDeEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQ3BCLENBQUM7UUFDRCxzQkFBc0I7WUFDcEIsT0FBTyxXQUFXLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsdUJBQXVCO1lBQ3JCLE9BQU8sV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUNELEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHO1lBQ25DLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckMsTUFBTSxJQUFJLEdBQUcsTUFBTSxpQkFBaUIsQ0FDbEMsS0FBSyxFQUNMLE1BQU0sTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUN6QixHQUFHLENBQ0osQ0FBQztZQUNGLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsT0FBTyxTQUFTLENBQUM7WUFFbEMsT0FBTyxNQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFDRCxjQUFjLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLO1lBQzVELE9BQU8sTUFBTTtpQkFDVixPQUFPLENBQUMsTUFBTSxDQUFDO2lCQUNmLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO2lCQUN0RSxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFDRCxlQUFlLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLO1lBQ3hELE9BQU8sTUFBTTtpQkFDVixPQUFPLENBQUMsTUFBTSxDQUFDO2lCQUNmLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO2lCQUNsRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQTNERCx3Q0EyREMifQ==