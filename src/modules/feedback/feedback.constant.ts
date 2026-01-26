/**
 * @file Feedback constants
 * @module module/feedback/constant
 * @author Surmon <https://github.com/surmon-china>
 */

export enum FeedbackEmotion {
  Terrible = 1,
  Bad = 2,
  Neutral = 3,
  Great = 4,
  Amazing = 5
}

export const emotionsMap = new Map(
  [
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
  ].map((item) => [item.value, item])
)

export const FEEDBACK_EMOTIONS = Array.from(emotionsMap.values())
export const FEEDBACK_EMOTION_VALUES = FEEDBACK_EMOTIONS.map((e) => e.value)
