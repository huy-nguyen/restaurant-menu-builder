import * as _ from 'lodash';
import {Promise} from 'es6-promise';
import * as $ from 'jquery';
import {
  IMenuItemRaw
} from './Interfaces';

// ES6 promise wrapper for jquery's `ajax`. The type argument `T` stands for the
// data type expected back from the ajax call:
export function ajax<T>(options: JQueryAjaxSettings) {
  function constructorCallback(
    resolve: (value: T) => void,
    reject: (error?: any) => void) {
    $.ajax(options).done(resolve).fail(reject);
  }
  return new Promise<T>(constructorCallback);
}
// Utility function. Like `_.extend` but always extend onto an emptpy object to
// make sure we don't modify the oeriginal object. E.g. `extend(a, b, c) is the
// same as `_.extend({}, a, b, c)`.
export function extend(...args: any[]) {
  args.unshift({});
  return _.extend.apply(null, args);
}

// Return true if `input` is neither `undefined`, `null` nor `NaN`.
export function doesExist(input: any): boolean {
  return !(input === void 0 || input === null || _.isNaN(input));
}
