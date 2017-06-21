/**
 *
 * Diretiva: booleanCheckboxModel
 * Objetivo: Diretiva deve ser aplicada aos input[type="checkbox"]. Com ela
 * o ng-model do componente pode retornar objetos JSON.
 *
 */
'use strict';
angular.module('booleanCheckbox')
	.directive('booleanCheckboxModel', ['$parse', '$compile', function($parse,
		$compile) {
		function isObject(value) {
			return typeof value === 'object';
		}

		function equals(arr, item) {
			if (angular.equals(arr, item)) {
				return true;
			}
			return false;
		}

		function add(arr, item) {
			if (angular.isDefined(arr)) {
				return arr;
			} else {
				arr = item;
			}
			return arr;
		}

		function remove(arr, item) {
			return undefined;
		}

		/**
		 * Após a fase de link a lógica para decidir
		 * o ng-model deve ser populado com um objeto ou apenas um boolean.
		 */
		function postLinkFn(scope, elem, attrs) {
			if (scope.npObjectValue) {
				attrs.booleanCheckboxValue = 'npObjectValue';
			} else {
				attrs.booleanCheckboxValue = 'npSelectedValue';
			}

			$compile(elem)(scope);

			var getter = $parse(attrs.booleanCheckboxModel);
			var setter = getter.assign;

			var value = $parse(attrs.booleanCheckboxValue)(scope.$parent);

			scope.$watch('npSelectedValue', function(newValue, oldValue) {
				if (newValue === oldValue) {
					return;
				}
				var current = getter(scope.$parent);

				if (isObject(value)) {
					if (newValue === true) {
						setter(scope.$parent, add(current, value));
					} else {
						setter(scope.$parent, remove(current, value));
					}
				} else {
					setter(scope.$parent, newValue);
				}
			});

			scope.$parent.$watch(attrs.booleanCheckboxModel, function(newArr) {
				if (isObject(value)) {
					scope.npSelectedValue = equals(newArr, value);
				} else {
					scope.npSelectedValue = newArr;
				}
			}, true);
		}

		return {
			restrict: 'A',
			priority: 1000,
			terminal: true,
			scope: true,
			compile: function(element) {

				element.removeAttr('boolean-checkbox-model');

				element.attr('ng-model', 'npSelectedValue');

				return postLinkFn;
			}
		};
	}]);
