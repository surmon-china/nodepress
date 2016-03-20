# node-emoji
_simple emoji support for node.js projects_

## Installation
To install `node-emoji`, you need [node.js](http://nodejs.org/) and [npm](https://github.com/npm/npm#super-easy-install). :rocket:

Once you have that set-up, just run `npm install --save node-emoji` in your project directory. :ship:

You're now ready to use emoji in your node projects! Awesome! :metal:

## Using the class
```javascript
var emoji = require('node-emoji');
console.log(emoji.get('coffee')); // returns the emoji code for coffee (displays emoji on terminals that support it)
console.log(emoji.which(emoji.get('coffee'))); // returns coffee
console.log(emoji.get(':fast_forward:')); // also supports github flavored markdown emoji (http://www.emoji-cheat-sheet.com/)
```

## Using the object
```javascript
var emoji = require('node-emoji').emoji;
console.log(emoji.coffee); // returns the emoji code for coffee (displays emoji on terminals that support it)
console.log(emoji.fast_forward); // returns the emoji code for fast_forward (displays emoji on terminals that support it)
```

## Adding new emoji
Emoji come from [js-emoji](https://github.com/iamcal/js-emoji/blob/master/emoji.js#L164-L1010) (Thanks a lot :thumbsup:).

To update the list or add custom emoji, clone this repository and put them into `lib/emojifile.js`.
Then run `npm run-script emojiparse` in the project directory or `node emojiparse` in the lib directory.
This should generate the new emoji.json file and output `Done.`.

That's all, you now have more emoji you can use! :clap: