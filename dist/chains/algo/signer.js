"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typedAlgoSigner = void 0;
/**
 * This library is written in typescript.
 * unfortunately the browser extension injects the AlgoSigner in a way we can't get a typed object wwithout this hack.
 *
 * @return Strongly typed AlgoSigner from extension
 */
function typedAlgoSigner() {
    //@ts-expect-error why do you inject libraries like this :|
    if (typeof AlgoSigner === "undefined") {
        throw Error("algosigner not available!");
    }
    //@ts-expect-error why do you inject libraries like this :|
    return AlgoSigner;
}
exports.typedAlgoSigner = typedAlgoSigner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYWlucy9hbGdvL3NpZ25lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUE2QkE7Ozs7O0dBS0c7QUFDSCxTQUFnQixlQUFlO0lBQzdCLDJEQUEyRDtJQUMzRCxJQUFJLE9BQU8sVUFBVSxLQUFLLFdBQVcsRUFBRTtRQUNyQyxNQUFNLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0tBQzFDO0lBRUQsMkRBQTJEO0lBQzNELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUM7QUFSRCwwQ0FRQyJ9