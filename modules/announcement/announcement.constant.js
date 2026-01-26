"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANNOUNCEMENT_STATUSES = exports.AnnouncementStatus = void 0;
var AnnouncementStatus;
(function (AnnouncementStatus) {
    AnnouncementStatus[AnnouncementStatus["Draft"] = 0] = "Draft";
    AnnouncementStatus[AnnouncementStatus["Published"] = 1] = "Published";
})(AnnouncementStatus || (exports.AnnouncementStatus = AnnouncementStatus = {}));
exports.ANNOUNCEMENT_STATUSES = [AnnouncementStatus.Draft, AnnouncementStatus.Published];
//# sourceMappingURL=announcement.constant.js.map