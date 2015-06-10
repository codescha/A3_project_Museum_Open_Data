var app = angular.module('MODapp', ['ngRoute', 'ui.bootstrap']);
	app.config(function($routeProvider) {
		$routeProvider
				.when('/', {templateUrl: 'views/home.html',
					controller: 'CollectionsCtrl',
					access: {requiredLogin: true}})
				.when('/objects/:id', {templateUrl: 'views/objects.html',
					controller: 'ObjectsCtrl',
					access: {requiredLogin: true}})
				.when('/login', {templateUrl: './views/login.html',
					controller: 'LoginCtrl',
					access: {requiredLogin: false}})
				.otherwise({redirectTo : '/'});
	});

	app.controller('IndexCtrl', ['$scope', 'UserService', 'AuthenticationService', function($scope, UserService, AuthenticationService) {
		$scope.isLoggedUser = AuthenticationService.isLogged;

		$scope.logout = function logout() {
			UserService.logOut();
			$scope.isLoggedUser = AuthenticationService.isLogged;
		};
	}]);

	app.factory('CollectionFactory', function($http, $q){
		var factory = {
			collections : false,
			getCollections : function(){
				var deferred = $q.defer();
				if(factory.collections != false){
					deferred.resolve(factory.collections);
				} else {
					$http.get('data.json')
							.success(function(data, status){
								factory.collections = data;
								deferred.resolve(factory.collections);
							}).error(function(data, status){
								deferred.reject('Erreur de chargement du fichier');
							});
				}
				return deferred.promise;
			},
			getCollection : function(id){
				var deferred = $q.defer();
				var collection = {};
				var collections = factory.getCollections().then(function(collections){
					angular.forEach(factory.collections, function(value, key){
						if(value.id == id){
							collection = value
						}
					});
					deferred.resolve(collection);
				}, function(msg){
					deferred.reject(msg);
				});
				return deferred.promise;
			}
		};
		return factory;
	})

	app.controller('CollectionsCtrl', ['$scope', 'CollectionFactory',
		function($scope, CollectionFactory) {
			$scope.loading = true;
			$scope.collections = CollectionFactory.getCollections().then(function(collections){
				$scope.loading = false;
				$scope.collections = collections;
			}, function(msg){
				console.log(msg);
			});
	}]);

	app.controller('ObjectsCtrl', function($scope, CollectionFactory, $routeParams) {
		$scope.loading = true;
		var collection =  CollectionFactory.getCollection($routeParams.id).then(function(collection){
			$scope.loading = false;
			$scope.title = collection.name;
			$scope.objects = collection.objects;
		}, function(msg){
			alert(msg);
		});

	})

	app.controller('LoginCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', '$http',
		function LoginCtrl($scope, $location, $window, UserService, AuthenticationService, $http) {
			//Login, Logout
			$scope.login = {
				email: '',
				password: ''
			}
			$scope.wrongCredentials = false;
			$scope.loginFailed = false;

			var username = $scope.login.email;
			var password = $scope.login.password;

			$scope.logIn=function logIn(username, password){
				if (username !== undefined && password !== undefined) {

					UserService.logIn(username, password).success(function(data) {
						if(data.code == "ko"){
							$scope.wrongCredentials = true;
							$scope.loginFailed = true;
						} else {
							AuthenticationService.isLogged = true;
							$window.sessionStorage.token = data.token;
							$scope.$parent.isLoggedUser = true;
							$location.path("/");
						}
					}).error(function(status, data) {
						console.log(status);
						console.log(data);
						$scope.loginFailed = true;
					});
				}
			}

			$http.get('api/data.json')
					.success(function(data, status){
						console.log(data);
					}).error(function(data, status){
					});
		}
	]);

	app.factory('AuthenticationService', function() {
		var auth = {
			isLogged: false
		}

		return auth;
	});
	app.factory('UserService', function($http, $window, $location, AuthenticationService) {
		return {
			logIn: function(username, password) {
				return $http.post('/login', {username: username, password: password});
			},

			logOut: function() {
				if (AuthenticationService.isLogged) {
					AuthenticationService.isLogged = false;
					delete $window.sessionStorage.token;
					$location.path("/login");
				}
			}
		}
	});

	app.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
		return {
			request: function (config) {
				config.headers = config.headers || {};
				if ($window.sessionStorage.token) {
					config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
				}
				return config;
			},

			requestError: function(rejection) {
				return $q.reject(rejection);
			},

			response: function (response) {
				if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
					AuthenticationService.isAuthenticated = true;
				}
				return response || $q.when(response);
			},

			responseError: function(rejection) {
				if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
					delete $window.sessionStorage.token;
					AuthenticationService.isAuthenticated = false;
					$location.path("/login");
				}

				return $q.reject(rejection);
			}
		};
	});

	app.config(function ($httpProvider) {
		$httpProvider.interceptors.push('TokenInterceptor');
	});

	app.run(function($rootScope, $window, $location, AuthenticationService) {
		function init() {
			if ($window.sessionStorage.token) {
				AuthenticationService.isLogged = true;
			}
		}

		init();

		$rootScope.$on("$routeChangeStart", function(event, next, current) {
			console.log(next.$$route);
			console.log(AuthenticationService.isLogged);
			if (next.$$route.access.requiredLogin && !AuthenticationService.isLogged) {
			}
		});
	});