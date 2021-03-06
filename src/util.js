import {
    bool, checkPropTypes, func, number, oneOfType, string
} from 'prop-types';
import { Component } from 'react';

export const isComponent = (val) => val && val.prototype instanceof Component;

export const result = (val, ...args) => {
    if (isComponent(val)) {
        return val;
    }
    return typeof val === 'function' ? val(
        ...args)
                                     : val;
};

export const stringOrFunc = oneOfType([string, func]);
export const numberOrFunc = oneOfType([number, func]);
export const boolOrFunc   = oneOfType([bool, func]);
export const EMPTY_ARRAY  = Object.freeze([]);
export const EMPTY_OBJ    = Object.freeze({});
export const indexOf      = Function.call.bind(Array.prototype.indexOf);


export const copyWithout = (arr, index) => {
    const copy = arr.concat();
    copy.splice(index, 1);
    return copy;
};

export const toggle = (arr, value) => {
    const idx = indexOf(arr, value);
    if (idx > -1) {
        return copyWithout(arr, idx);
    }
    return arr.concat(value);
};
export const listen = (target, event, callback) => {
    target.addEventListener(event, callback);
    return () => target.removeEventListener(event, callback);
};

export const stop    = (fn) => function (e) {
    if (!e || (typeof e.stopPropagation !== 'function')) {
        return fn && fn.call(this, e);
    }
    e.stopPropagation();
    e.preventDefault();
    return fn && fn.call(this, e);
};
export const reverse = (fn) => (...args) => fn(...args) * -1;

export const clamp = (value, min, max) => min <= max ? Math.max(min,
    Math.min(value, max)) : clamp(value, max, min);

export const execLoop = (c) => typeof c === 'function' && c();

export const classes = (...args) => args.filter(Boolean).join(' ');

export const ignoreKeys = (...args) => {
    const ignoredKeys = uniqueKeys(args);

    return (obj) => {
        if (!obj) {
            return obj;
        }
        return Object.keys(obj).reduce(function (ret, key) {
            if (indexOf(ignoredKeys, key) === -1) {
                ret[key] = obj[key];
            }
            return ret;
        }, {});
    };
};

const uniqueKeys$inner       = (ret, key) => {
    if (indexOf(ret, key) === -1) {
        ret.push(key);
    }
    return ret;
};
const uniqueKeys$innerString = (ret, arg) => {
    if (typeof arg === 'string') {
        if (indexOf(ret, arg) === -1) {
            ret.push(arg);
        }
        return ret;
    }

    return (Array.isArray(arg) ? arg : Object.keys(arg)).reduce(
        uniqueKeys$inner, ret);
};

export const uniqueKeys = (args, ret = []) => args.reduce(
    uniqueKeys$innerString, ret);

export const createShouldComponentUpdate = (...args) => {
    const propKeys = uniqueKeys(args);
    const length   = propKeys.length;
    return function (newProps, newState) {
        for (let i = 0; i < length; i++) {
            const key = propKeys[i];
            if (this.props[key] !== newProps[key]) {
                return true;
            }
        }
        const stateKeys = Object.keys(newState);
        for (let i = 0, l = stateKeys.length; i < l; i++) {
            const key = stateKeys[i];
            if (this.state[key] !== newState[key]) {
                return true;
            }
        }
        return false;
    };
};

export const toString = (val) => val == null ? '' : String(val);

export const fire = (fn, ...args) => (fn ? fn(...args) !== false
                                         : true);

export const makeCompare = (formatter, key, options) => {
    if (typeof formatter !== 'function') {
        formatter = (data) => data[key];
    }
    return (a, b) => {
        if (a === b || !(a || b)) {
            return 0;
        }
        if (!b) {
            return 1;
        }
        if (!a) {
            return -1;
        }
        a = formatter(a, key, options);
        b = formatter(b, key, options);
        if (a === b || !(a || b)) {
            return 0;
        }
        if (!b) {
            return 1;
        }
        if (!a) {
            return -1;
        }
        return a > b ? 1 : -1;
    }
};

export const orProp         = (which = []) => {
    const [current, ...rest] = which;
    if (rest.length === 0) {
        if (current) {
            return current;
        }
        throw new Error(
            'Needs at least 2 elements in the array, the validator for this field and the other field to check')
    }

    function checkType(isRequired, props, propName, componentName,
                       location) {
        if (props[propName] == null) {
            let multi = 0;
            for (let i = 0, l = rest.length; i < l; i++) {
                if (props[rest[i]]) {
                    multi++;
                }
            }

            if (multi > 1 || isRequired && multi === 0) {
                return new Error(
                    `Required either "${propName}" or one of "${rest.join(
                        ',')}" where not specified in ${componentName}`);
            }
        } else {

            for (let i = 0, l = rest.length; i < l; i++) {
                if (props[props[rest[i]]]) {
                    return new Error(
                        `Either ${propName} or only one of ${rest.join(
                            ',')} not both. in ${componentName}`)
                }
            }

            return checkPropTypes({ [propName]: current }, props, propName,
                componentName, location);
        }
    }


    const chainedCheckType      = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;

};
export const contains       = (arr, value) => arr && arr.includes(value);
export const rowDataFactory = (example) => (offset, count,
                                            { sortColumn, sortDirection } = {}) => {
    let ret;
    if (sortColumn && sortDirection) {
        let {
                columnKey,
                sorter,
                formatter,
            } = sortColumn;

        let data = example.concat();
        if (typeof sorter !== 'function') {
            sorter = makeCompare(formatter, columnKey, sortColumn);
        }
        data.sort(sortDirection === 'DESC' ? reverse(sorter) : sorter);
        ret = data.slice(offset, offset + count);
    } else {
        ret = example.slice(offset, offset + count);
    }
    return ret;
};

export const scrollContext = {
    subscribe  : func,
    unsubscribe: func,
    getParent  : func
};
