define([], function(){
    'use strict';
    
    // represents an abstraction layer over the caching mechanism.
    
    var clear = function() {
        localStorage.clear();
    };
    
    var set = function(key, value) {
        localStorage.setItem(key, value);
    };
    
    var get = function(key){
        localStorage.getItem(key);
    };
    
    return {        
        set: set,
        clear: clear,
        get: get
    };
});