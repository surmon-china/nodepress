"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identity = exports.IdentityRole = void 0;
var IdentityRole;
(function (IdentityRole) {
    IdentityRole["Guest"] = "guest";
    IdentityRole["Admin"] = "admin";
    IdentityRole["User"] = "user";
})(IdentityRole || (exports.IdentityRole = IdentityRole = {}));
class Identity {
    role;
    token;
    payload;
    constructor(options) {
        this.role = options.role;
        this.token = options.token ?? null;
        this.payload = options.payload ?? null;
    }
    get isGuest() {
        return this.role === IdentityRole.Guest;
    }
    get isAdmin() {
        return this.role === IdentityRole.Admin;
    }
    get isUser() {
        return this.role === IdentityRole.User;
    }
}
exports.Identity = Identity;
//# sourceMappingURL=identity.constant.js.map