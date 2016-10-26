/* *****************************************************************************
 *
 * StoryPlaces
 *

This application was developed as part of the Leverhulme Trust funded 
StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk

Copyright (c) 2016
  University of Southampton
    Charlie Hargood, cah07r.ecs.soton.ac.uk
    Kevin Puplett, k.e.puplett.soton.ac.uk
	David Pepper, d.pepper.soton.ac.uk

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * The name of the Universities of Southampton nor the name of its 
	  contributors may be used to endorse or promote products derived from 
	  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

***************************************************************************** */

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