"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOptionsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const options_model_1 = require("./options.model");
class UpdateOptionsDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(options_model_1.Option, ['singleton', 'updated_at'])) {
}
exports.UpdateOptionsDto = UpdateOptionsDto;
//# sourceMappingURL=options.dto.js.map