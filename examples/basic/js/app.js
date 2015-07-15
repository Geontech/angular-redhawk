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


  /* 
   * The purpose of this example is to showcase pushed event channel data from
   * a given REDHAWK domain.  
   */
  .controller('ExampleController', ['$scope', 'REDHAWK', 
    function($scope, REDHAWK) {

      // Here, we enable the REDHAWK service to get pushed updates
      // and forward them to the callback.
      REDHAWK.addListener( 
        function(msg) {
          if (msg && msg.domains && msg.domains.length && !$scope.domain) {
            // Purpose: 
            // If the message is valid and no $scope.domain exists, ttach to to the first 
            // REDHAWK Domain ID found by using the REDHAK service to create/fetch it, by ID,
            // using the default Domain factory.  Then assign it to $scope to make it accessible 
            // from the views/example.html as 'domain'.
            //
            // The resulting Domain instance automatically opens a socket and connects to the 
            // channels: IDM_Channel and ODM_Channel.  It then saves the most recent 500 messages
            // to its `events` property, which we'll be able to automatically watch since it's
            // mentioned in example.html.
            $scope.domain = REDHAWK.getDomain(msg.domains[0]);            
          }
        });
      }
    ])
;