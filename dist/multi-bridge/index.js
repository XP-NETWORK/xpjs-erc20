"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.erc20MultiBridge = void 0;
const chains_1 = require("../chains");
const chain_info_1 = require("./chain-info");
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
        tokenBalance: async (n, token, addr) => {
            const chain = getChain(n);
            return await chain.tokenBalance(token, addr);
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
            const txFee = tf || (await estimateFees(n, t, cn));
            let res;
            if (await isWrappedToken(n, t)) {
                res = chain.transferWrapped(s, t, cn, a, to, txFee);
            }
            else {
                res = chain.transferNative(s, t, cn, a, to, txFee);
            }
            return await res;
        },
    };
}
exports.erc20MultiBridge = erc20MultiBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbXVsdGktYnJpZGdlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHNDQUErRDtBQUUvRCw2Q0FBeUM7QUF1RHpDLFNBQWdCLGdCQUFnQixDQUM5QixDQUFvQixFQUNwQixDQUFrQjtJQUVsQixJQUFJLFVBQVUsR0FFVCxFQUFFLENBQUM7SUFDUixJQUFJLFVBQVUsR0FFVCxFQUFFLENBQUM7SUFFUixTQUFTLGNBQWMsQ0FBd0IsS0FBUTtRQUNyRCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU07WUFBRSxNQUFNLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRS9DLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxTQUFTLEtBQUssQ0FBd0IsS0FBUTtRQUM1QyxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsSUFBSSxXQUFXO1lBQUUsT0FBTyxXQUFpQyxDQUFDO1FBRTFELE1BQU0sTUFBTSxHQUFHLHNCQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUNyQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQ0QsQ0FBQztRQUN2QixVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBYSxDQUFDO1FBRWxDLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxTQUFTLFFBQVEsQ0FBd0IsS0FBUTtRQUMvQyxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsSUFBSSxXQUFXO1lBQUUsT0FBTyxXQUFZLENBQUM7UUFFckMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFJLEtBQUssQ0FBQyxDQUFDO1FBQy9CLE1BQU0sS0FBSyxHQUFHLElBQUEsd0JBQWUsRUFBQyxNQUFhLENBQUMsQ0FBQztRQUM3QyxVQUFVLENB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