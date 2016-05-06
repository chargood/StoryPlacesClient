/**
 * Created by kep1u13 on 05/05/2016.
 */

define([
    'iconRepository'
], function (iconRepository) {
    var IconFactory = {
        getIconForCard: function(card) {
            if (! card.get('visible')) {
                return iconRepository.redIcon;
            }

            if (card.get('selected')) {
                return iconRepository.blueIcon;
            }

            if (card.get('suitable')) {
                return iconRepository.greenIcon;
            }

            return iconRepository.redIcon;
        }
    }

    return IconFactory;
});
