"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.erc20MultiBridge = exports.TransferError = void 0;
const chains_1 = require("../chains");
const chain_info_1 = require("./chain-info");
class TransferError extends Error {
    constructor(e) {
        super(e.reason);
        this.name = "TransferError";
        this.data = e.data;
    }
}
exports.TransferError = TransferError;
function erc20MultiBridge(p, d) {
    let innerCache = {};
    let chainCache = {};
    function getChainParams(nonce) {
        const params = p[nonce];
        if (!params)
            throw Error("chain not enabled!");
        return params;
    }
    function inner(nonce) {
        const cachedInner = innerCache[nonce];
        if (cachedInner)
            return cachedInner;
        const uChain = chain_info_1.ChainInfo[nonce].factory(getChainParams(nonce));
        innerCache[nonce] = uChain;
        return uChain;
    }
    function getChain(nonce) {
        const cachedChain = chainCache[nonce];
        if (cachedChain)
            return cachedChain;
        const uChain = inner(nonce);
        const chain = (0, chains_1.chainMapCombine)(uChain);
        chainCache[nonce] = chain;
        return chain;
    }
    async function isWrappedToken(chainNonce, token) {
        const res = await d.scVerify.getTokenPairByWrapped(chainNonce, token);
        return res != undefined;
    }
    function checkDecimals(val, fromC, toC) {
        return val
            .div(chain_info_1.ChainInfo[fromC].decimals)
            .times(chain_info_1.ChainInfo[toC].decimals)
            .integerValue()
            .div(chain_info_1.ChainInfo[toC].decimals)
            .times(chain_info_1.ChainInfo[fromC].decimals)
            .eq(val);
    }
    const estimateFees = async (sn, token, tn) => {
        const chain = getChain(tn);
        let estimator;
        if (await isWrappedToken(sn, token)) {
            estimator = chain.estimateTransferWrapped;
        }
        else {
            estimator = chain.estimateTransferNative;
        }
        const estimate = await estimator();
        const exRate = await d.exchangeRate.getExchangeRate(chain_info_1.ChainInfo[tn].currency, chain_info_1.ChainInfo[sn].currency);
        return estimate
            .div(chain_info_1.ChainInfo[tn].decimals)
            .times(exRate * 1.1)
            .times(chain_info_1.ChainInfo[sn].decimals)
            .integerValue();
    };
    return {
        inner: (n) => Promise.resolve(inner(n)[0]),
        balance: async (n, addr) => {
            const chain = getChain(n);
            return await chain.balance(addr);
        },
        tokenBalance: async (n, token, addr) => {
            const chain = getChain(n);
            return await chain.tokenBalance(token, addr);
        },
        tokenParams: async (n, token) => {
            const chain = getChain(n);
            return await chain.tokenParams(token);
        },
        estimateFees,
        async preTransfer(n, s, t, a) {
            if (await isWrappedToken(n, t))
                return undefined;
            const chain = getChain(n);
            return await chain.preTransfer(s, t, a);
        },
        async transferTokens(n, s, t, cn, a, to, tf) {
            if (!checkDecimals(a, n, cn))
                throw Error("Target Chain is not precise enough! round your value to prevent loss");
            const chain = getChain(n);
            const toChain = getChain(cn);
            const txFee = tf || (await estimateFees(n, t, cn));
            const tokenPair = await d.scVerify.getTokenPairByWrapped(n, t);
            let transferCheck;
            let transferFunc;
            let targetToken;
            if (tokenPair) {
                transferFunc = chain.transferWrapped;
                targetToken = tokenPair.nativeToken;
                transferCheck = toChain.preReceiveNativeCheck;
            }
            else {
                const wrappedToken = await d.scVerify.getWrappedToken(n, cn, t);
                if (!wrappedToken)
                    throw Error("Unsupported token");
                targetToken = wrappedToken;
                transferFunc = chain.transferNative;
                transferCheck = toChain.preReceiveForeignCheck;
            }
            const check = transferCheck && (await transferCheck(targetToken, to));
            if (check)
                throw new TransferError(check);
            const txHash = await transferFunc(s, t, cn, a, to, txFee);
            await d.notifier.notifyValidator(n, txHash);
            return txHash;
        },
    };
}
exports.erc20MultiBridge = erc20MultiBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbXVsdGktYnJpZGdlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHNDQUF3RTtBQUd4RSw2Q0FBeUM7QUFTekMsTUFBYSxhQUFpQixTQUFRLEtBQUs7SUFHekMsWUFBWSxDQUFhO1FBQ3ZCLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7UUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7Q0FDRjtBQVJELHNDQVFDO0FBMERELFNBQWdCLGdCQUFnQixDQUM5QixDQUFvQixFQUNwQixDQUFrQjtJQUVsQixJQUFJLFVBQVUsR0FFVCxFQUFFLENBQUM7SUFDUixJQUFJLFVBQVUsR0FFVCxFQUFFLENBQUM7SUFFUixTQUFTLGNBQWMsQ0FBd0IsS0FBUTtRQUNyRCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU07WUFBRSxNQUFNLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRS9DLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxTQUFTLEtBQUssQ0FBd0IsS0FBUTtRQUM1QyxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsSUFBSSxXQUFXO1lBQUUsT0FBTyxXQUFpQyxDQUFDO1FBRTFELE1BQU0sTUFBTSxHQUFHLHNCQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUNyQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQ0QsQ0FBQztRQUN2QixVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBYSxDQUFDO1FBRWxDLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxTQUFTLFFBQVEsQ0FBd0IsS0FBUTtR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