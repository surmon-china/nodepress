"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveGeneralAuthor = exports.GeneralAuthorType = void 0;
var GeneralAuthorType;
(function (GeneralAuthorType) {
    GeneralAuthorType["Anonymous"] = "anonymous";
    GeneralAuthorType["Guest"] = "guest";
    GeneralAuthorType["User"] = "user";
})(GeneralAuthorType || (exports.GeneralAuthorType = GeneralAuthorType = {}));
const resolveGeneralAuthor = (author, user) => {
    if (user?._id) {
        return {
            user: user._id,
            author_name: user.name ?? null,
            author_email: user.email ?? null,
            author_type: GeneralAuthorType.User
        };
    }
    if (author.author_email || author.author_name) {
        return {
            user: null,
            author_name: author.author_name ?? null,
            author_email: author.author_email ?? null,
            author_type: GeneralAuthorType.Guest
        };
    }
    return {
        user: null,
        author_name: null,
        author_email: null,
        author_type: GeneralAuthorType.Anonymous
    };
};
exports.resolveGeneralAuthor = resolveGeneralAuthor;
//# sourceMappingURL=author.constant.js.map