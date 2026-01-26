/**
 * @file Announcement constants
 * @module module/announcement/constant
 * @author Surmon <https://github.com/surmon-china>
 */

export enum AnnouncementStatus {
  Draft = 0,
  Published = 1
}

export const ANNOUNCEMENT_STATUSES = [AnnouncementStatus.Draft, AnnouncementStatus.Published] as const
