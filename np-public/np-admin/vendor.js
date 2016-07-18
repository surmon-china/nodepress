// For vendors for example jQuery, Lodash, angular2-jwt just import them here unless you plan on
// chunking vendors files for async loading. You would need to import the async loaded vendors
// at the entry point of the async loaded file. Also see custom-typings.d.ts as you also need to
// run `typings install x` where `x` is your module
"use strict";
// Angular 2
require('@angular/platform-browser');
require('@angular/platform-browser-dynamic');
require('@angular/core');
require('@angular/common');
require('@angular/http');
require('@angular/router');
// RxJS
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');
// Web dependencies
require('jquery');
require('bootstrap-loader');
require('font-awesome-sass-loader');
require('lodash');
if ('production' === ENV) {
}
else {
}
