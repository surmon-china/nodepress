/**
 * @file Sort constants
 * @module constants/sort
 * @author Surmon <https://github.com/surmon-china>
 */

export enum SortOrder {
  Asc = 1,
  Desc = -1
}

export enum SortMode {
  Oldest = SortOrder.Asc,
  Latest = SortOrder.Desc,
  Hottest = 2
}
