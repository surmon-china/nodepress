/**
 * Data helper module.
 * @file 数据助手模块
 * @module helper/data-validate
 * @author Surmon <https://github.com/surmon-china>
 */

export const isArray = (array): array is Array<any> => Array.isArray(array);

export const isString = (value): value is string => typeof value === 'string';

export const isObject = (value): value is object => value != null && typeof value === 'object' && isArray(value) === false;

// 无效数组
export const isInvalidArray = (array): boolean => !array || !isArray(array) || !array.length;

// 检查数字是否无效
export const isInvalidNumber = (number): boolean => number === null || number === undefined || isNaN(number);

// 数组去重
export const arrayUniq = (a, b = []) => [...new Set([...a, ...b])];

// 获取对象值数组
export const objectValues = object => Object.keys(object).map(key => object[key]);
