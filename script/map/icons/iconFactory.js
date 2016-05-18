/**
 * Created by kep1u13 on 05/05/2016.
 */

define([
    'iconRepository'
], function (iconRepository) {
    var IconFactory = {
        getIconForCardState: function(cardState) {
            if (! cardState.get('visible')) {
                return iconRepository.redIcon;
            }

            if (cardState.get('selected')) {
                return iconRepository.blueIcon;
            }

            if (cardState.get('suitable')) {
                return iconRepository.greenIcon;
            }

            return iconRepository.redIcon;
        }
    }

    return IconFactory;
});
