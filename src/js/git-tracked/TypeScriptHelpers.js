// Helpers for typescript export; These helper functions are exported as global
// functions so that we don't have to emit them into every Typescript-generated
// file. See tsc --noEmitHelpers flag. Adapted from
// https://github.com/Microsoft/TypeScript/blob/master/src/compiler/emitter.ts
var __extends = (this && this.__extends) || function (d, b) {
  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = (this && this.__metadata) || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param = (this && this.__param) || function (paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
};

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
    generator = generator.call(thisArg, _arguments);
    function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
    function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
    function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
    function step(verb, value) {
      var result = generator[verb](value);
      result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
    }
    step("next", void 0);
  });
};

var __assign = (this && this.__assign) || Object.assign || function(t) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
      t[p] = s[p];
  }
  return t;
};
