/**
 * Created by kep1u13 on 05/05/2016.
 */

define([
    'iconRepository'
], function (iconRepository) {
    return {
        getIconFromMarkerState: function (marker) {
            if (marker.state == "suitable") {
                return iconRepository.greenIcon;
            }

            if (marker.state == "suitable-nolocation") {
                return iconRepository.redIcon;
            }

            return undefined;
        },
    }
});
