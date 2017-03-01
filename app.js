'use strict';


var app = angular.module('creditCard', []);

app.controller('MainCtrl', function($scope, $locale) {
    var currentYear = new Date().getFullYear();

    $scope.msg = '';
    $scope.validity = false;
    $scope.currentMonth = new Date().getMonth() + 1;
    $scope.months = $locale.DATETIME_FORMATS.MONTH;
    $scope.years = [];

    for (var i = 0; i < 13; i++) {
        $scope.years.push(currentYear + i)
    }

    $scope.pay = function(details) {

        if (details && details.card && details.cvv && details.month && details.year) {
            alert("Thanks for payment");
        } else {
            alert("Invalid! Payment Cancelled");
        }
        console.log(details)

    }

    $scope.cvvValidation = function(value) {

        var regex = /^[0-9]{1,10}$/;
        if (!regex.test(value.cvv) || value.cvv.length>4) {

        	value.cvv = value.cvv.slice(0, -1);
        	
            
        } 


    }


});


app.directive("validCard", function() {
    return {
        restrict: "EA",
        require: "ngModel",
        templateUrl: "templates/cardTemplate.html",

        link: function(scope, element, attrs, ngModel) {


            var validateCard = function(ccNumber, type) {
                var backwards = 0;
                var stringx2 = "";
                var total = 0;
                for (var i = ccNumber.length - 2; i >= 0; i -= 2) {
                    backwards += ccNumber.charAt(i);

                }

                for (var i = 0; i < backwards.length; i++) {
                    stringx2 += backwards.charAt(i) * 2;
                }

                for (var i = 0; i < stringx2.length; i++) {
                    total += parseInt(stringx2.charAt(i));
                }

                for (var i = ccNumber.length - 3; i >= 0; i -= 2) {
                    total += parseInt(ccNumber.charAt(i));
                }

                total += parseInt(ccNumber.charAt(ccNumber.length - 1))

                if ((total % 10) == 0 && type === cardType(ccNumber)) {
                    scope.validity = true;
                    scope.msg = type + ' Card is valid';
                } else {
                    scope.validity = false;
                    scope.msg = type + ' Card is invalid';
                }

            };

            var cardType = function(ccNumber) {
                var cardType = (/^5[1-5]/.test(ccNumber)) ? "Mastercard" : (/^4/.test(ccNumber)) ? "Visa" : (/^3[47]/.test(ccNumber)) ? 'Amex' : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(ccNumber)) ? 'Discover' : Unknown
                return cardType;
            }

            scope.oncardType = function() {
                ngModel.$setViewValue(scope.value);
                ngModel.$setViewValue(scope.type);

                if (scope.value && scope.type) {
                    validateCard(scope.value, scope.type);
                }
            };

            ngModel.$render = function() {
                scope.type = ngModel.$modelValue;
                scope.value = ngModel.$modelValue;
                scope.type = 'Visa';
            };




        }
    };
});

app.directive('creditCardType', function() {
    var directive = {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(value) {
                scope.ccinfo.type =
                    (/^5[1-5]/.test(value)) ? "mastercard" : (/^4/.test(value)) ? "visa" : (/^3[47]/.test(value)) ? 'amex' : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)) ? 'discover' : undefined
                ctrl.$setValidity('invalid', !!scope.ccinfo.type)
                return value
            })
        }
    }
    return directive
})
