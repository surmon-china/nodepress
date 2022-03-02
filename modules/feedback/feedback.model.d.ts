import { IPLocation } from '@app/processors/helper/helper.service.ip';
export declare enum FeedbackEmotion {
    Terrible = 1,
    Bad = 2,
    Neutral = 3,
    Great = 4,
    Amazing = 5
}
export declare const FEEDBACK_EMOTIONS: {
    value: FeedbackEmotion;
    text: string;
    emoji: string;
}[];
export declare const FEEDBACK_EMOTION_VALUES: FeedbackEmotion[];
export declare class FeedbackBase {
    tid: number;
    emotion: number;
    get emotion_text(): string;
    get emotion_emoji(): string;
    content: string;
    user_name: string | null;
    user_email: string | null;
}
export declare class Feedback extends FeedbackBase {
    id: number;
    marked: boolean;
    remark: string;
    origin: string | null;
    user_agent?: string;
    ip: null | string;
    ip_location: Partial<IPLocation> | null;
    create_at?: Date;
    update_at?: Date;
}
export declare const FeedbackProvider: import("@nestjs/common").Provider<any>;
