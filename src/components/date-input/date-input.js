angular.module('kayak-handicap')
  .directive('dateInput', function () {
    "use strict";

    return {
      template: '<div></div>',
      restrict: 'E',
      replace: true,
      scope: {
        value: '='
      },
      bindToController: true,
      controllerAs: 'date',
      controller: function ($scope, $element) {
        $element.datepicker({
          format: "yyyy-mm-dd",
          weekStart: 1,
          language: "da",
          calendarWeeks: true,
          todayHighlight: true
        });

        $element.on('changeDate', date => {
          $scope.$apply(() => {
            $scope.date.value = date.format();
          });
        });

        $scope.$watch('date.value', date => {
          if (!date) {return;}

          $element.datepicker('update', date);
        });
      }
    };
  });