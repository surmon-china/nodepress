"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEEDBACK_EMOTION_VALUES = exports.FEEDBACK_EMOTIONS = exports.emotionsMap = exports.FeedbackEmotion = void 0;
var FeedbackEmotion;
(function (FeedbackEmotion) {
    FeedbackEmotion[FeedbackEmotion["Terrible"] = 1] = "Terrible";
    FeedbackEmotion[FeedbackEmotion["Bad"] = 2] = "Bad";
    FeedbackEmotion[FeedbackEmotion["Neutral"] = 3] = "Neutral";
    FeedbackEmotion[FeedbackEmotion["Great"] = 4] = "Great";
    FeedbackEmotion[FeedbackEmotion["Amazing"] = 5] = "Amazing";
})(FeedbackEmotion || (exports.FeedbackEmotion = FeedbackEmotion = {}));
exports.emotionsMap = new Map([
    {
        value: FeedbackEmotion.Terrible,
        text: FeedbackEmotion[FeedbackEmotion.Terrible],
        emoji: '😠'
    },
    {
        value: FeedbackEmotion.Bad,
        text: FeedbackEmotion[FeedbackEmotion.Bad],
        emoji: '🙁'
    },
    {
        value: FeedbackEmotion.Neutral,
        text: FeedbackEmotion[FeedbackEmotion.Neutral],
        emoji: '😐'
    },
    {
        value: FeedbackEmotion.Great,
        text: FeedbackEmotion[FeedbackEmotion.Great],
        emoji: '😃'
    },
    {
        value: FeedbackEmotion.Amazing,
        text: FeedbackEmotion[FeedbackEmotion.Amazing],
        emoji: '🥰'
    }
].map((item) => [item.value, item]));
exports.FEEDBACK_EMOTIONS = Array.from(exports.emotionsMap.values());
exports.FEEDBACK_EMOTION_VALUES = exports.FEEDBACK_EMOTIONS.map((e) => e.value);
//# sourceMappingURL=feedback.constant.js.map