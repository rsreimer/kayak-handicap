'use strict';

app
  .directive('raceForm', function () {
    return {
      templateUrl: 'components/race-form/race-form.html',
      restrict: 'E',
      scope: {},
      bindToController: true,
      controllerAs: 'race',
      controller: function () {
        var ctrl = this;

        ctrl.members = [
          {name: 'a', id: 1},
          {name: 'b', id: 2},
          {name: 'c', id: 3},
          {name: 'd', id: 4},
          {name: 'e', id: 5},
          {name: 'f', id: 6},
          {name: 'g', id: 7}
        ];

        ctrl.boatTypes = [
          {name: 'K1', seats: 1},
          {name: 'K2', seats: 2},
          {name: 'K4', seats: 4}
        ];

        ctrl.participations = [];

        ctrl.createParticipation = function () {
          ctrl.participations.push({
            boatType: ctrl.boatTypes[0],
            participants: [ctrl.members[0]]
          })
        };

        ctrl.getSeats = function(boatType) {
          return new Array(boatType.seats);
        };

        ctrl.createParticipation();
      }
    }
  });