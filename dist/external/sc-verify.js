"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scVerifyRepo = void 0;
const axios_1 = __importDefault(require("axios"));
function handleScVerifyErr(e) {
    var _a;
    if (((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) != 404) {
        console.warn("sc-verify: getWrappedToken: unhandled error", e.message, "resp", e.response);
    }
    return undefined;
}
function scVerifyRepo(baseURL) {
    const client = axios_1.default.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
        },
    });
    return {
        async getWrappedToken(nativeChainId, wrappedChainId, nativeToken) {
            const res = await client
                .post("/token/by-native", {
                nativeChain: nativeChainId,
                wrappedChain: wrappedChainId,
                nativeToken,
            })
                .catch(handleScVerifyErr);
            return res === null || res === void 0 ? void 0 : res.data.data.wrappedToken;
        },
        async getTokenPairByWrapped(wrappedChainId, wrappedToken) {
            const res = await client
                .post("/token/by-wrapped", {
                wrappedChain: wrappedChainId,
                wrappedToken: wrappedToken,
            })
                .catch(handleScVerifyErr);
            return res === null || res === void 0 ? void 0 : res.data.data;
        },
    };
}
exports.scVerifyRepo = scVerifyRepo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2MtdmVyaWZ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V4dGVybmFsL3NjLXZlcmlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBMEM7QUFpQjFDLFNBQVMsaUJBQWlCLENBQUMsQ0FBYTs7SUFDdEMsSUFBSSxDQUFBLE1BQUEsQ0FBQyxDQUFDLFFBQVEsMENBQUUsTUFBTSxLQUFJLEdBQUcsRUFBRTtRQUM3QixPQUFPLENBQUMsSUFBSSxDQUNWLDZDQUE2QyxFQUM3QyxDQUFDLENBQUMsT0FBTyxFQUNULE1BQU0sRUFDTixDQUFDLENBQUMsUUFBUSxDQUNYLENBQUM7S0FDSDtJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRCxTQUFnQixZQUFZLENBQUMsT0FBZTtJQUMxQyxNQUFNLE1BQU0sR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDO1FBQzFCLE9BQU87UUFDUCxPQUFPLEVBQUU7WUFDUCxjQUFjLEVBQUUsa0JBQWtCO1NBQ25DO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTztRQUNMLEtBQUssQ0FBQyxlQUFlLENBQ25CLGFBQXFCLEVBQ3JCLGNBQXNCLEVBQ3RCLFdBQW1CO1lBRW5CLE1BQU0sR0FBRyxHQUFHLE1BQU0sTUFBTTtpQkFDckIsSUFBSSxDQUEwQixrQkFBa0IsRUFBRTtnQkFDakQsV0FBVyxFQUFFLGFBQWE7Z0JBQzFCLFlBQVksRUFBRSxjQUFjO2dCQUM1QixXQUFXO2FBQ1osQ0FBQztpQkFDRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUU1QixPQUFPLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNyQyxDQUFDO1FBQ0QsS0FBSyxDQUFDLHFCQUFxQixDQUFDLGNBQXNCLEVBQUUsWUFBb0I7WUFDdEUsTUFBTSxHQUFHLEdBQUcsTUFBTSxNQUFNO2lCQUNyQixJQUFJLENBQTBCLG1CQUFtQixFQUFFO2dCQUNsRCxZQUFZLEVBQUUsY0FBYztnQkFDNUIsWUFBWSxFQUFFLFlBQVk7YUFDM0IsQ0FBQztpQkFDRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUU1QixPQUFPLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3hCLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQW5DRCxvQ0FtQ0MifQ==