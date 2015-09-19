angular.module('kayak-handicap')
    .directive('personForm', function () {
        "use strict";

        return {
            templateUrl: 'person-form/person-form.html',
            restrict: 'E',
            scope: {},
            bindToController: true,
            controllerAs: 'form',
            controller: function () {
                this.save = person => {
                    console.log(person);
                };
            }
        };
    });