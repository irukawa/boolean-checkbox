'use strict';
angular.module('booleanCheckbox', ['infraestrutura.validator',
    'infraestrutura.filter'
  ])
  .directive('booleanCheckbox', ['$timeout',
    function($timeout) {
      return {
        restrict: 'AE',
        //templateUrl: 'template/booleanCheckboxTemplate.html',
        templateUrl: 'bower_components/boolean-checkbox/src/template/booleanCheckboxTemplate.html',
        scope: {
          npId: '@',
          npOptional: '=?',
          npLabel: '@',
          npDisabled: '=?',
          npRequiredMessage: '@',
          npSelectedValue: '=',
          npValue: '=',
          npOnChange: '&',
          npOnClick: '&',
          npSize: '@',
          npValidatorMessage: '@',
          npAccessibilityMessage: '@',
          npObjectValue: '='
        },
        replace: true,
        link: function(scope, element, attrs, ctrls) {
          booleanCheckboxApplyDefaultValues(scope, attrs);


          /**
           * O AngularJS chama primeiro a diretiva ng-change para depois
           * atualizar o model. A função do timeout é invocar o $apply e
           * atualizar o model.
           **/
          scope.change = function() {
            $timeout(function() {
              scope.npOnChange();
            });
          };

          /**
           * O AngularJS chama primeiro a diretiva ng-click para depois
           * atualizar o model. A função do timeout é invocar o $apply e
           * atualizar o model.
           **/
          scope.click = function() {
            $timeout(function() {
              scope.npOnClick();
            });
          };

          function booleanCheckboxApplyDefaultValues() {
            scope.npOptional = angular.isDefined(attrs.npOptional) ?
              scope.npOptional :
              Boolean.true;
            attrs.npRequiredMessage = angular.isDefined(attrs.npRequiredMessage) ?
              attrs.npRequiredMessage : 'Campo obrigatório.';
            scope.sizeClass = angular.isDefined(attrs.npSize) ? 'col-md-' +
              scope.npSize :
              'col-md-12';
          }

          scope.isRequired = function() {
            if (scope.npOptional == false || scope.npOptional == 'false') {
              return true;
            } else {
              return false;
            }
          };
        }
      };
    }
  ]);
