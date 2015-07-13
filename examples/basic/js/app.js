angular.module('ExampleApp', [
      'ui.bootstrap',
      'ngRoute',
      'redhawk'
  ])
  .config(['$routeProvider', 
    function ($routeProvider) {
      $routeProvider
        .when('/example', {
          templateUrl: 'views/example.html',
          controller: 'ExampleController'
        })
        .otherwise({ redirectTo: '/example' });
    }
  ])
  .controller('ExampleController', ['$scope', 'REDHAWK', 
    function($scope, REDHAWK) {
      // The purpose of this example is to showcase pushed event channel data from
      // a given REDHAWK domain.  These messages will be stored here:
      $scope.messages = [];

      // Here, we enable the REDHAWK service to get pushed updates
      // and forward them to the callback.
      REDHAWK.addListener( 
        function(msg) {
          if (msg && msg.domainIds && msg.domainIds.length && !$scope.domain) {
            // Purpose: Attach to to the first REDHAWK domain ID found, create and assign it to
            // a property on $scope to make it accessible from the views/example.html
            $scope.domain = REDHAWK.getDomain(msg.domainIds[0]);

            // Similarly, the resulting factory has its own socket for receiving messages on its
            // named event channels.  By default, these are the ODM_Channel and IDM_Channel.  
            // Others can be This callback receives raw message structures as received on the domain's event
            // channels (by default, ODM and IDM).
            $scope.domain.on_msg = function(msg) {
              $scope.messages.unshift(msg);
              while (10 <= $scope.messages.length) {
                $scope.messages.pop(); // remove oldest
              }
            }
          }
        });
      }
    ])
;