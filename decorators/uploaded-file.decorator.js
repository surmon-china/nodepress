"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadedFile = void 0;
const common_1 = require("@nestjs/common");
exports.UploadedFile = (0, common_1.createParamDecorator)(async (_, context) => {
    const request = context.switchToHttp().getRequest();
    const file = await request.file();
    if (!file)
        throw new common_1.BadRequestException('No file uploaded');
    const buffer = await file.toBuffer();
    const fields = {};
    for (const [key, field] of Object.entries(file.fields ?? {})) {
        const item = Array.isArray(field) ? field[0] : field;
        if (item && item.type === 'field') {
            fields[key] = item.value;
        }
    }
    const uploadedFile = {
        file: file.file,
        fileName: file.filename,
        fileSize: buffer.byteLength,
        mimetype: file.mimetype,
        encoding: file.encoding,
        buffer,
        fields
    };
    return uploadedFile;
});
//# sourceMappingURL=uploaded-file.decorator.js.map