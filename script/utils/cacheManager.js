define([], function(){
    'use strict';
    
    // represents an abstraction layer over the caching mechanism.
    
    var clear = function() {
        localStorage.clear();
    };
    
    var add = function(key, value) {
        localStorage.setItem(key, value);
    };
    
    var get = function(key){
        localStorage.getItem(key);
    };
    
    return {        
        add: add,
        clear: clear,
        get: get
    };
});