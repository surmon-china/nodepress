"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = exports.UserIdentityProvider = void 0;
var UserIdentityProvider;
(function (UserIdentityProvider) {
    UserIdentityProvider["GitHub"] = "github";
    UserIdentityProvider["Google"] = "google";
})(UserIdentityProvider || (exports.UserIdentityProvider = UserIdentityProvider = {}));
var UserType;
(function (UserType) {
    UserType[UserType["Moderator"] = 1] = "Moderator";
    UserType[UserType["Standard"] = 2] = "Standard";
    UserType[UserType["Patron"] = 3] = "Patron";
})(UserType || (exports.UserType = UserType = {}));
//# sourceMappingURL=user.constant.js.map