define(['CacheManager', 'underscore', 'jquery'], function (CacheManager, _, $) {
    'use strict';

    var cacheFull = false;
    var keyPrefix = "cache-manager:";

    var buildStoryKey = function (storyId) {
        return keyPrefix + storyId;
    };

    var buildMediaKey = function (storyId, mediaId) {
        return buildStoryKey(storyId) + ':' + mediaId;
    };

    var buildUrl = function (storyId, mediaId) {
        return 'storyplaces/story/' + storyId + '/media/' + mediaId + '?data';
    };

    var buildSettingsObject = function () {
        return {
            method: 'GET',
            headers: {
                Accept: "application/json; charset=utf-8"
            }
        };
    };

    var populateCacheItem = function (storyId, mediaId, cacheKey) {
        var settings = buildSettingsObject(mediaId);
        var url = buildUrl(storyId, mediaId);

        $.ajax(url, settings)

            .done(function (data) {
                if (!cacheFull) {
                    try {
                        var dataString = JSON.stringify(data);
                        CacheManager.set(cacheKey, dataString);
                    } catch (exception) {
                        if (exception.name === 'QuotaExceededError' || exception.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            cacheFull = true;
                        }
                    }
                }
            })

            .fail(function (err) {
                console.log("Failed to get media storyId:" + storyId + " mediaId:" + mediaId);
            });
    };

    var populateCache = function (storyId, mediaIds) {

        // clear any existing cache for other stories
        var storyKey = buildStoryKey(storyId);
        CacheManager.clear(keyPrefix, storyKey);
        cacheFull = false;

        _.each(mediaIds, function (mediaId) {

            var key = buildMediaKey(storyId, mediaId);

            if (CacheManager.get(key) == undefined) {
                populateCacheItem(storyId, mediaId, key);
            }
        });
    };

    var getCacheItem = function (storyId, mediaId) {
        var key = buildMediaKey(storyId, mediaId);
        return CacheManager.get(key);
    };

    return {
        populate: populateCache,
        getItem: getCacheItem
    };
});