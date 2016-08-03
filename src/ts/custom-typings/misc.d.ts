/* Test-relatd ambient declarations: */
// Essentially we are disabling type checking for these test libraries because
// such type checking isn't very useful in test assertions.

// We can safely assume these variables exist inside test files because `karma`
// will have already loaded these variables into the global scope (because we
// declare `mocha` and `chai` in the list of frameworks in `karma.conf.js`):
declare var expect: any;
declare var it: any;
declare var xit: any;
declare var describe: any;
declare var xdescribe: any;
declare var beforeEach: any;
declare var afterEach: any;
declare var chai: any;

declare module 'chai' {
  export var expect: Function;
  export var use: Function
}

declare module 'chai-deep-match' {
  var a: any;
  export = a;
}

declare module 'sinon' {
  var a: any;
  export = a;
}

declare module 'mocha' {
  var a: any;
  export = a;
}
