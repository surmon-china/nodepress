"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventKeys = void 0;
var EventKeys;
(function (EventKeys) {
    EventKeys["RedisError"] = "redis.error";
    EventKeys["DatabaseError"] = "database.error";
    EventKeys["AdminLoggedIn"] = "admin.logged_in";
    EventKeys["AdminLoggedOut"] = "admin.logged_out";
    EventKeys["OptionsUpdated"] = "options.updated";
    EventKeys["FeedbackCreated"] = "feedback.created";
    EventKeys["CommentCreated"] = "comment.created";
    EventKeys["CommentCreateFailed"] = "comment.create_failed";
    EventKeys["ArticleCreated"] = "article.created";
    EventKeys["ArticleUpdated"] = "article.updated";
    EventKeys["ArticleDeleted"] = "article.deleted";
    EventKeys["ArticleViewed"] = "article.viewed";
})(EventKeys || (exports.EventKeys = EventKeys = {}));
//# sourceMappingURL=events.constant.js.map