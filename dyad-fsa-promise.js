"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Dyad = require("dyad");
var flux_standard_action_1 = require("flux-standard-action");
var store = Dyad.getInstance();
function middleware(action, next) {
    if (flux_standard_action_1.isFSA(action)) {
        var _payload = action.payload;
        if (_payload && typeof _payload.then === 'function') {
            return _payload.then(function (payload) {
                store.dispatch(__assign({}, action, { payload: payload }));
            }).catch(function (payload) {
                store.dispatch(__assign({}, action, { payload: payload, error: true }));
                return Promise.reject(payload);
            });
        }
        return next(action);
    }
    return action && typeof action.then === 'function'
        ? action.then(function (x) { return store.dispatch(x); })
        : next(action);
}
exports.middleware = middleware;
