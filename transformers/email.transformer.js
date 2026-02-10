"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linesToEmailContent = exports.getUserAgentText = exports.getLocationText = exports.getTimeText = void 0;
const ua_parser_js_1 = require("ua-parser-js");
const getTimeText = (date) => {
    const dtf = new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const parts = dtf.formatToParts(date);
    const f = (type) => parts.find((p) => p.type === type)?.value;
    return `${f('year')}-${f('month')}-${f('day')} ${f('hour')}:${f('minute')}:${f('second')}`;
};
exports.getTimeText = getTimeText;
const getLocationText = (location) => {
    return [location.country, location.region, location.city].join(' · ');
};
exports.getLocationText = getLocationText;
const getUserAgentText = (userAgent) => {
    const parsed = (0, ua_parser_js_1.UAParser)(userAgent);
    const browser = parsed.browser.name ? `${parsed.browser.name}/${parsed.browser.version}` : 'Unknown Browser';
    const os = parsed.os.name ? `${parsed.os.name}/${parsed.os.version}` : 'Unknown OS';
    const device = parsed.device.vendor ? `${parsed.device.vendor} ${parsed.device.model}` : 'PC/Generic';
    return [browser, os, device].join(' · ');
};
exports.getUserAgentText = getUserAgentText;
const linesToEmailContent = (lines) => {
    return {
        text: lines.join('\n'),
        html: lines.map((text) => `<p>${text}</p>`).join('\n')
    };
};
exports.linesToEmailContent = linesToEmailContent;
//# sourceMappingURL=email.transformer.js.map