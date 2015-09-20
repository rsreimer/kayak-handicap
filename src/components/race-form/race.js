angular.module('kayak-handicap')
    .service('RaceService', function ($http, apiUrl) {
        "use strict";

        this.save = function(race) {
            race.participations.forEach(participation => {
                participation.boatType = participation.boatType.id;
                participation.participants = participation.participants.map(participant => participant.id);
            });

            race.timekeepers = race.timekeepers.map(timekeeper => timekeeper.id);

            $http.post(apiUrl + 'race', race);
        };
    });