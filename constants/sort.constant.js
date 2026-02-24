"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortMode = exports.SortOrder = void 0;
var SortOrder;
(function (SortOrder) {
    SortOrder[SortOrder["Asc"] = 1] = "Asc";
    SortOrder[SortOrder["Desc"] = -1] = "Desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
var SortMode;
(function (SortMode) {
    SortMode[SortMode["Oldest"] = 1] = "Oldest";
    SortMode[SortMode["Latest"] = -1] = "Latest";
    SortMode[SortMode["Hottest"] = 2] = "Hottest";
})(SortMode || (exports.SortMode = SortMode = {}));
//# sourceMappingURL=sort.constant.js.map