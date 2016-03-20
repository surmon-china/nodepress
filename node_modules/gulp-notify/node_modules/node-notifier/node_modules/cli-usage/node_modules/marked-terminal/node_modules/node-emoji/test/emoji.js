/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var should = require('should');
var emoji = require('../index');

describe("emoji.js", function () {
  describe("class", function () {
    describe("get(emoji)", function () {
      it("should return an emoji code", function () {
        var coffee = emoji.get('coffee');
        should.exist(coffee);
        coffee.should.be.exactly('☕️');
      });

      it("should support github flavored markdown emoji", function () {
        var coffee = emoji.get(':coffee:');
        should.exist(coffee);
        coffee.should.be.exactly('☕️');
      });
    });

    describe("which(emoji_code)", function () {
      it("should return name of the emoji", function () {
        var coffee = emoji.which('☕️');
        should.exist(coffee);
        coffee.should.be.exactly('coffee');
      });
    });
  });

  describe("object", function () {
    it("should return an emoji code", function () {
      var coffee = emoji.emoji.coffee;
      should.exist(coffee);
      coffee.should.be.exactly('☕️');
    });
  });
});