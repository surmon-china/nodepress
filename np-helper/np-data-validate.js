/**
 * Data helper module.
 * @file 数据助手模块
 * @module helper/data-validate
 * @author Surmon <https://github.com/surmon-china>
 */

const isArray = array => Array.isArray(array)

const isString = string => typeof string === 'string'

// 数组是否无效
const arrayIsInvalid = array => !array || !array.length

// 检查数字是否有效
const numberIsInvalid = number => number === null || isNaN(number)

// 数组去重
const arrayUniq = (a, b = []) => [...new Set([...a, ...b])]

// 获取对象值数组
const getObjectValues = object => Object.keys(object).map(key => object[key])

exports.isArray = isArray
exports.isString = isString
exports.arrayUniq = arrayUniq
exports.arrayIsInvalid = arrayIsInvalid
exports.numberIsInvalid = numberIsInvalid
exports.getObjectValues = getObjectValues
