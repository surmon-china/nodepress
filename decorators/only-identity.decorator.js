"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlyIdentity = exports.METADATA_ONLY_IDENTITY_KEY = exports.IdentityRole = void 0;
const common_1 = require("@nestjs/common");
var identity_constant_1 = require("../constants/identity.constant");
Object.defineProperty(exports, "IdentityRole", { enumerable: true, get: function () { return identity_constant_1.IdentityRole; } });
exports.METADATA_ONLY_IDENTITY_KEY = 'app:only_identity';
const OnlyIdentity = (...roles) => (0, common_1.SetMetadata)(exports.METADATA_ONLY_IDENTITY_KEY, roles);
exports.OnlyIdentity = OnlyIdentity;
//# sourceMappingURL=only-identity.decorator.js.map