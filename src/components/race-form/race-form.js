angular.module('kayak-handicap')
    .directive('raceForm', function () {
        "use strict";
        return {
            templateUrl: 'race-form/race-form.html',
            restrict: 'E',
            scope: {},
            bindToController: true,
            controllerAs: 'form',
            controller: function (RaceService) {
                var ctrl = this;

                ctrl.members = [
                    {name: 'Person0 Lastname', id: 1},
                    {name: 'Person1 Lastname', id: 2},
                    {name: 'Person2 Lastname', id: 3},
                    {name: 'Person3 Lastname', id: 4},
                    {name: 'Person4 Lastname', id: 5},
                    {name: 'Person5 Lastname', id: 6}
                ];

                ctrl.boatTypes = [
                    {id: 1, name: 'K1', seats: 1},
                    {id: 2, name: 'K2', seats: 2},
                    {id: 3, name: 'K4', seats: 4}
                ];

                var today = new Date();
                ctrl.race = {
                    date: today.getUTCFullYear() + '-' + (today.getUTCMonth() + 1) + '-' + today.getUTCDate(),
                    participations: [],
                    timekeepers: []
                };

                ctrl.save = function () {
                    RaceService.save(ctrl.race);
                };

                ctrl.addParticipation = function () {
                    ctrl.race.participations.push({
                        boatType: ctrl.boatTypes[0],
                        participants: [ctrl.members[0]]
                    });
                };

                ctrl.addTimekeeper = function () {
                    ctrl.race.timekeepers.push(ctrl.members[0]);
                };

                ctrl.getSeats = function (boatType) {
                    return new Array(boatType.seats);
                };

                if (ctrl.race.participations.length === 0) {
                    ctrl.addParticipation();
                }
            }
        };
    });