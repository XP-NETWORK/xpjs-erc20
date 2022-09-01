import { ethers, Signer, BigNumber } from "ethers";
import { FullBridgeChain } from "..";
import { Bridge__factory, DummyErc20 } from "web3-erc20-contracts-types";

export type EvmBridgeChain = FullBridgeChain<
  Signer,
  DummyErc20,
  ethers.BigNumber,
  ethers.ContractReceipt,
  string
>;

export type EvmParams = {
  provider: ethers.providers.Provider;
  bridgeAddr: string;
};

// TODO
const TRANSFER_NATIVE_COST = ethers.BigNumber.from(100000);
// TODO
const TRANSFER_WRAPPED_COST = ethers.BigNumber.from(100000);

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
      const reqd = await allowanceRequired(
        token,
        await sender.getAddress(),
        amt
      );
      if (reqd.lte(0)) return undefined;

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
