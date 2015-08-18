angular.module('kayak-handicap')
  .directive('timeInput', function () {
    "use strict";

    return {
      templateUrl: 'time-input/time-input.html',
      restrict: 'E',
      scope: {
        value: '='
      },
      bindToController: true,
      controllerAs: 'time',
      controller: function ($scope) {
        var ctrl = this;

        $scope.$watch('time.raw', function (newValue) {
          if (!newValue) {
            ctrl.value = undefined;
          } else {
            ctrl.value =
              newValue.substr(0, 2) + ':' +
              newValue.substr(2, 2) + ':' +
              newValue.substr(4, 2);
          }
        });
      }
    };
  });