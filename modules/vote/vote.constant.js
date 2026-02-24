"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteTargetType = exports.VoteType = void 0;
var VoteType;
(function (VoteType) {
    VoteType[VoteType["Upvote"] = 1] = "Upvote";
    VoteType[VoteType["Downvote"] = -1] = "Downvote";
})(VoteType || (exports.VoteType = VoteType = {}));
var VoteTargetType;
(function (VoteTargetType) {
    VoteTargetType["Article"] = "article";
    VoteTargetType["Comment"] = "comment";
})(VoteTargetType || (exports.VoteTargetType = VoteTargetType = {}));
//# sourceMappingURL=vote.constant.js.map