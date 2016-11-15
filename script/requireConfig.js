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

// provides configurations for require.js
'use strict';

require.config({
    paths: {
        jquery: 'libs/jquery-1.12.3.min',
        bootstrap: 'libs/bootstrap-3.3.6-dist/js/bootstrap',
        underscore: 'libs/underscore-1.8.3.min',
        backbone: 'libs/backbone-1.3.3.min',
        backbone_dual: 'libs/Backbone.dualStorage-1.4.0/backbone.dualstorage.amd',
        moment: 'libs/moment.min',
        leaflet: 'libs/leaflet',

        SPGPS: 'utils/SPGPS',
        
        geolocate: 'libs/geolocate',

        iconRepository: 'map/icons/iconRepository',
        iconFactory: 'map/icons/iconFactory',
        map: 'map/map',

        mapReadingView: 'views/mapReadingView',
        listReadingView: 'views/listReadingView',
        cardView: 'views/cardView',
        errorView: 'views/errorView',
        readingView: 'views/readingView',
        storyListView: 'views/storyListView',
        storyView: 'views/storyView',
        debugView: 'views/debugView',

        Card: 'models/card',
        CardState: 'models/cardState',
        Story: 'models/story',
        Reading: 'models/reading',
        Marker: 'models/marker',
        User: 'models/user',
        LogEvent: 'models/logEvent',

        comparisonCondition: 'models/conditions/comparisonCondition',
        locationCondition: 'models/conditions/locationCondition',
        logicalCondition: 'models/conditions/logicalCondition',
        timeRangeCondition: 'models/conditions/timeRangeCondition',
        timePassedCondition:'models/conditions/timePassedCondition',
        storyFunction: 'models/storyFunction',

        StoryRepository: 'repositories/storyRepository',
        ReadingRepository: 'repositories/readingRepository',
        StoryReadingCollectionRepository: 'repositories/storyReadingCollectionRepository',
        MediaCacheRepository: 'repositories/mediaCacheRepository',
        LogEventCollectionRepository: 'repositories/logEventCollectionRepository',

        CardCollection: 'collections/cardCollection',
        CardStateCollection: 'collections/cardStateCollection',
        StoryCollection: 'collections/storyCollection',
        MarkerCollection: 'collections/markerCollection',
        StoryReadingCollection: 'collections/storyReadingCollection',
        LogEventCollection: 'collections/logEventCollection',

        CacheManager: 'utils/localStorageCacheManager'        
    }
});

require(['app'], function(App){
    App.initialize();    
});