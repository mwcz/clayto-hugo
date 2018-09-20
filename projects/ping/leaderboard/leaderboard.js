(function () {
    'use strict';

    /*global angular, _*/
    angular.module('leaderboard', ['ordinal'])
        .directive('plLeaderboard', leaderboard)
        .factory('leaderboardservice', leaderboardservice);

    leaderboardservice.$inject = ['$http'];
    LeaderboardController.$inject = ['$scope', '$interval', 'leaderboardservice'];

    var serviceUrl = 'http://summit-games.usersys.redhat.com/users',
        maxLeaders = 10,
        updateInterval = 5000;

    function leaderboard() {
        var directive = {
            restrict: 'AE',
            templateUrl: 'leaderboard.html',
            controller: LeaderboardController,
            controllerAs: 'vm'
        };

        return directive;
    }

    function leaderboardservice($http) {
        return {
            getLeaders: getLeaders
        };

        function getLeaders() {
            return $http.get(serviceUrl)
                .then(getLeadersComplete)
                .catch(getLeadersFailed);

            function getLeadersComplete(response) {
                /*
                 * crazy one liner
                 */
                return _.take(_.filter(_.sortByOrder(_.toArray(response.data), 'ping.hiscore', false), 'ping.hiscore'), maxLeaders);
            }

            function getLeadersFailed(error) {
                /*
                 * there was an error
                 */
            }
        }
    }

    function LeaderboardController($scope, $interval, leaderboardservice) {
        var vm = this;
        vm.leaders = [];

        $interval(getLeaders, updateInterval);
        getLeaders();

        function getLeaders() {
            return leaderboardservice.getLeaders()
                .then(function (data) {
                    vm.leaders = data;
                    return vm.leaders;
                });
        }
    }
}());
