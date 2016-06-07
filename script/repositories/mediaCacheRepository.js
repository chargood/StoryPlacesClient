define(['CacheManager', 'underscore', 'jquery'], function (CacheManager, _, $) {
    'use strict';

    var cacheFull = false;

    var buildImageKey = function (storyId, imageId) {
        return storyId + ':' + imageId;
    };

    var buildUrl = function (image) {
        return 'story/' + image.storyId + '/media/' + image.mediaId;
    };

    var buildSettingsObject = function (image) {
        return {
            method: 'GET',
            headers: {
                Accept: "text/plain; charset=utf-8",
                "Content-Type": "text/plain; charset=utf-8"
            }
        };
    };

    var populateCache = function (images) {

        // clear any existing cache
        CacheManager.clear();
        cacheFull = false;

        _.each(images, function (image) {

            var key = buildImageKey(image.storyId, image.mediaId);
            
            // if not already in cache
            if (CacheManager.get(key) === undefined) {
                var settings = buildSettingsObject(image);
                var url = buildUrl(image);
                $.ajax(url, settings)
                    .done(function (data) {
                        if (!cacheFull) {
                            try {
                                CacheManager.set(key, data);
                            } catch (exception) {
                                if (exception.name === 'QuotaExceededError' ||
                                    exception.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                                    // Fallback code comes here.
                                    cacheFull = true;
                                }
                            }
                        }
                    })
                    .fail(function () {
                        console.log("Failed to get media storyId:" + image.storyId + " mediaId:" + image.mediaId);                        
                    });
            }
        });
    };

    var getCacheItem = function (storyId, imageId) {
        var key = buildImageKey(storyId, imageId);
        return CacheManager.get(key);
    };

    return {
        populateCache: populateCache,
        getCacheItem: getCacheItem
    };
});