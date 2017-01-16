angular.module('MyApp.Directives2', []).directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue;
            }
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
});

angular.module('MyApp.Directives', []).filter('searchfilter', function() {
        return function (input, query) {
            if(query == ""){
            return input;
          }else{
            return input.replace(RegExp('('+ query + ')', 'g'), '<font color="green" >$1</font>');
          }

        }
  })

angular.module('MyApp.noSpecialChar', []).directive('noSpecialChar', function() {
     return {
       require: 'ngModel',
       restrict: 'A',
       link: function(scope, element, attrs, modelCtrl) {
         modelCtrl.$parsers.push(function(inputValue) {
           if (inputValue == null)
             return ''
           cleanInputValue = inputValue.replace(/[^a-zA-Z_0-9ก-๙]|^[0-9]/, '');
           if (cleanInputValue != inputValue) {
             modelCtrl.$setViewValue(cleanInputValue);
             modelCtrl.$render();
           }
           return cleanInputValue;
         });
       }
     }
   });

   angular.module('MyApp.number', []).directive('number', function() {
        return {
          require: 'ngModel',
          restrict: 'A',
          link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
              if (inputValue == null)
                return ''
              cleanInputValue = inputValue.replace(/[^0-9]/gim, '');
              if (cleanInputValue != inputValue) {
                modelCtrl.$setViewValue(cleanInputValue);
                modelCtrl.$render();
              }
              return cleanInputValue;
            });
          }
        }
      });
