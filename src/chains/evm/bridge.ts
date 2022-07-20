import { ethers, Signer } from "ethers";
import { FullBridgeChain } from "..";
import { Bridge__factory, DummyErc20 } from "web3-erc20-contracts-types";

export type EvmBridgeChain = FullBridgeChain<
  Signer,
  DummyErc20,
  ethers.BigNumber,
  ethers.ContractTransaction,
  string
>;

export type EvmParams = {
  provider: ethers.providers.Provider;
  bridgeAddr: string;
};

// TODO
const TRANSFER_NATIVE_COST = ethers.BigNumber.from(0);
// TODO
const TRANSFER_WRAPPED_COST = ethers.BigNumber.from(0);

export function evmBridgeChain(p: EvmParams): EvmBridgeChain {
  const bridge = Bridge__factory.connect(p.bridgeAddr, p.provider);

  const allowanceRequired = async (
    token: DummyErc20,
    owner: string,
    amt: ethers.BigNumber
  ): Promise<ethers.BigNumber> => {
    const allowance = await token.allowance(owner, bridge.address);
    return amt.sub(allowance);
  };

  async function estimateFee(
    gasLimit: ethers.BigNumber
  ): Promise<ethers.BigNumber> {
    return gasLimit.mul(await p.provider.getGasPrice());
  }

  return {
    tokenBalance(token, address) {
      return token.connect(p.provider).balanceOf(address);
    },
    estimateTransferNative() {
      return estimateFee(TRANSFER_NATIVE_COST);
    },
    estimateTransferWrapped() {
      return estimateFee(TRANSFER_WRAPPED_COST);
    },
    async preTransfer(sender, token_, amt) {
      const token = token_.connect(sender);
      const reqd = await allowanceRequired(
        token,
        await sender.getAddress(),
        amt
      );
      if (reqd.lte(0)) return undefined;

      return await token.approve(bridge.address, amt);
    },
    transferNative(sender, nativeToken, chainNonce, amt, txFee) {
      return bridge
        .connect(sender)
        .sendNative(nativeToken.address, amt, chainNonce, { value: txFee });
    },
    transferWrapped(sender, wToken, chainNonce, amt, txFee) {
      return bridge
        .connect(sender)
        .sendWrapped(wToken.address, amt, chainNonce, { value: txFee });
    },
  };
}
