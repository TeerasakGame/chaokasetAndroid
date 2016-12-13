angular.module('MyApp.Directives', []);

    angular.module('MyApp.Directives', [])
    .directive("passwordVerify", function() {
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
