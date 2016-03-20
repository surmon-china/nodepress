/*jslint node: true*/
"use strict";

/**
 * Emoji class
 */
function Emoji() {
  try {
    this.emoji = require('./emoji.json');
  } catch (err) {
    throw new Error('emoji.json invalid or not readable.');
  }
}

module.exports = new Emoji();

/**
 * get emoji code from name
 * @param  {string} emoji
 * @return {string}
 */
Emoji.prototype.get = function get(emoji) {
  if (emoji.indexOf(':') > -1) {
    // :emoji: (http://www.emoji-cheat-sheet.com/)
    emoji = emoji.substr(1, emoji.length-2);
  }
  if (this.emoji.hasOwnProperty(emoji)) return this.emoji[emoji];
};

/**
 * get emoji name from code
 * @param  {string} emoji_code
 * @return {string}
 */
Emoji.prototype.which = function which(emoji_code) {
  for (var prop in this.emoji) {
    if (this.emoji.hasOwnProperty(prop)) {
      if (this.emoji[prop] === emoji_code) return prop;
    }
  }
};