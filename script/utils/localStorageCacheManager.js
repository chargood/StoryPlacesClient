define(['underscore'], function () {
    'use strict';

    // represents an abstraction layer over the caching mechanism.

    var clear = function (keyMustStartWith, keyMustNotStartWith) {

       for (var index = 0; index < localStorage.length; index++) {
            var key = localStorage.key(index);
            
            if (keyMustStartWith != undefined && !key.startsWith(keyMustStartWith)) {
                continue;
            }
            
            if (keyMustNotStartWith != undefined && key.startsWith(keyMustNotStartWith)) {
                continue;
            }
            
            localStorage.removeItem(key);
        }
    };

    var set = function (key, value) {
        localStorage.setItem(key, value);
    };

    var get = function (key) {
        return localStorage.getItem(key);
    };

    return {
        set: set,
        clear: clear,
        get: get
    };
});