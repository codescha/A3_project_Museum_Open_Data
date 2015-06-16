var app = angular.module('MODapp', ['ngRoute', 'ui.bootstrap', 'angularUtils.directives.dirPagination']);
	app.config(function($routeProvider) {
		$routeProvider
				.when('/', {templateUrl: 'views/home.html',
					access: {requiredLogin: false}})
				.when('/museums', {templateUrl: 'views/museums.html',
					controller: 'MuseumsCtrl',
					access: {requiredLogin: false}})
				.when('/museum/:idm', {templateUrl: 'views/museum.html',
					controller: 'MuseumCtrl',
					access: {requiredLogin: false}})
				.when('/collections', {templateUrl: 'views/collections.html',
					controller: 'CollectionsCtrl',
					access: {requiredLogin: false}})
				.when('/objects/:id', {templateUrl: 'views/objects.html',
					controller: 'ObjectsCtrl',
					access: {requiredLogin: false}})
				.when('/object/:idc/:ido', {templateUrl: 'views/object.html',
					controller: 'ObjectCtrl',
					access: {requiredLogin: false}})
				.when('/login', {templateUrl: './views/login.html',
					controller: 'LoginCtrl',
					access: {requiredLogin: false}})
				.when('/subscribe', {templateUrl: './views/subscribe.html',
					controller: 'SubscribeCtrl',
					access: {requiredLogin: false}})
                .when('/user', {templateUrl: './views/user.html',
                    controller: 'UserCtrl',
                    access: {requiredLogin: true}})
                .when('/user_exhibitions', {templateUrl: './views/user_exhibitions.html',
                    controller: '',
                    access: {requiredLogin: true}})
                .when('/favorites', {templateUrl: './views/favorites.html',
                    controller: 'FavoriteCtrl',
                    access: {requiredLogin: true}})
				.otherwise({redirectTo : '/'});
	});

	app.controller('IndexCtrl', ['$scope', 'UserService', 'AuthenticationService', '$window', function($scope, UserService, AuthenticationService, $window) {
		$scope.isLoggedUser = AuthenticationService.isLogged;

		$scope.logout = function logout() {
			UserService.logOut();
			$scope.isLoggedUser = AuthenticationService.isLogged;
		};

        if($window.sessionStorage.userInfos != undefined){
            $scope.userInfos = JSON.parse($window.sessionStorage.userInfos);
        }
	}]);

	app.factory('CollectionFactory', function($http, $q){
		var factory = {
			collections : false,
			objects : false,
			getCollections : function(){
				var deferred = $q.defer();
				if(factory.collections != false){
					deferred.resolve(factory.collections);
				} else {
					$http.get('json/museumhavre.json')
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
					factory.objects = collection.objects;
				}, function(msg){
					deferred.reject(msg);
				});
				return deferred.promise;
			},
			getObject : function(idc, ido){
				var deferred=$q.defer();
				var object = {};
				var objects = factory.getCollection(idc).then(function(objects){
					angular.forEach(factory.objects, function(value, key){
						if(value.id == ido){
							object = value
						}
					});
					deferred.resolve(object);
				}, function(msg){
					deferred.reject(msg);
				});
				return deferred.promise;
			}
		};
		return factory;
	})

	app.factory('MuseumFactory', function($http, $q){
		var factory = {
			museums : false,
			getMuseums : function(){
				var deferred = $q.defer();
				if(factory.museums != false){
					deferred.resolve(factory.museums);
				} else {
					$http.get('json/museums.json')
							.success(function(data, status){
								factory.museums = data;
								deferred.resolve(factory.museums);
							}).error(function(data, status){
								deferred.reject('Erreur de chargement du fichier');
							});
				}
				return deferred.promise;
			},
			getMuseum : function(id){
				var deferred = $q.defer();
				var museum = {};
				var museums = factory.getMuseums().then(function(museums){
					angular.forEach(factory.museums, function(value, key){
						if(value.id == id){
							museum = value
						}
					});
					deferred.resolve(museum);
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

	app.controller('ObjectsCtrl', ['$scope', 'CollectionFactory', '$routeParams', 'UserService',
        function($scope, CollectionFactory, $routeParams, UserService) {
            $scope.currentPage = 1;
            $scope.pageSize = 12;
            $scope.loading = true;
            var collection = CollectionFactory.getCollection($routeParams.id).then(function (collection) {
                $scope.loading = false;
                $scope.idc = collection.id;
                $scope.title = collection.name;
                $scope.objects = collection.objects;
            }, function (msg) {
                alert(msg);
            });

            $scope.favorite = {
                userId: '',
                itemId: ''
            }

            $scope.favoriteExists = false;

            var userId = $scope.favorite.userId;
            var itemId = $scope.favorite.itemId;

            $scope.favorite = function favorite(userId, itemId) {
                if (userId !== undefined && itemId !== undefined) {
                        UserService.favorite(userId, itemId).success(function (data) {
                            if(data.code =="exists"){
                                $scope.favoriteExists = true;
                                $window.alert($scope.favoriteExists);
                            }
                            else if (data.code == "ko") {
                                console.log('erreur ajout aux favoris');
                            } else {
                            }
                        }).error(function (status, data) {
                            console.log(status);
                            console.log(data);
                        });
                }
            }

        }]);

	app.controller('ObjectCtrl', function($scope, CollectionFactory, $routeParams) {
		$scope.loading = true;
		var object =  CollectionFactory.getObject($routeParams.idc, $routeParams.ido).then(function(object){
			$scope.loading = false;
			$scope.idc = $routeParams.idc;
			$scope.ido = object.id;
			$scope.object = object;
		}, function(msg){
			alert(msg);
		});

	});

	app.controller('MuseumsCtrl', ['$scope', 'MuseumFactory',
		function($scope, MuseumFactory) {
			$scope.loading = true;
			$scope.museums = MuseumFactory.getMuseums().then(function(museums){
				$scope.loading = false;
				$scope.museums = museums;
			}, function(msg){
				console.log(msg);
			});
	}]);

	app.controller('MuseumCtrl', function($scope, MuseumFactory, $routeParams) {
	$scope.loading = true;
	var museum =  MuseumFactory.getMuseum($routeParams.idm).then(function(museum){
		$scope.loading = false;
		$scope.museum = museum;
	}, function(msg){
		alert(msg);
	});
		$scope.loading = true;
		var museum =  MuseumFactory.getMuseum($routeParams.idm).then(function(museum){
			$scope.loading = false;
			$scope.museum = museum;
		}, function(msg){
			alert(msg);
		});

	});

	app.controller('SubscribeCtrl', ['$scope', '$location', '$window', 'UserService',
		function($scope, $location, $window, UserService) {
            $scope.subscribe = {
                firstname: '',
                lastname: '',
                email: '',
                password: ''
            }
            $scope.wrongCredentials = false;
            $scope.loginFailed = false;

            var firstname = $scope.subscribe.firstname;
            var lastname = $scope.subscribe.lastname;
            var email = $scope.subscribe.email;
            var password = $scope.subscribe.password;

            $scope.subscribe = function subscribe(firstname, lastname, email, password) {
                if (email !== undefined && password !== undefined && firstname !== undefined && lastname !== undefined) {

                    UserService.subscribe(firstname, lastname, email, password).success(function (data) {
                        if(data.code == "ko"){
                            console.log('erreur inscription');
                        } else {
                            $location.path("/login");
                        }
                    }).error(function (status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            }
        }
	]);

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
                            console.log(data);
                            console.log(data.user.firstname);

                            $window.sessionStorage.setItem('userInfos', JSON.stringify(data.user));
                            $scope.$parent.userInfos = data.user;

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

		/*	$http.get('api/data.json')
					.success(function(data, status){
						console.log(data);
					}).error(function(data, status){
					}); */
		}
	]);

    app.controller('UserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', '$http',
        function UserCtrl($scope, $location, $window, UserService, AuthenticationService, $http) {

        }
    ]);

    app.controller('FavoriteCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', '$http',
        function FavoriteCtrl($scope, $location, $window, UserService, AuthenticationService, $http) {
            $scope.favorite = {
                userId: '',
            }
            var userId = $scope.favorite.userId;

            $scope.getFavorites = function getFavorites(userId) {
                if (userId !== undefined) {

                    UserService.getFavorites(userId).success(function (data) {
                        if(data.code == "ko"){
                            console.log('erreur récupération favoris');
                        } else {
                            $scope.favorites = JSON.stringify(data.favorites.rows);
                            console.log($scope.favorites);
                        }
                    }).error(function (status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            }
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
                    delete $window.sessionStorage.userInfos;
					$location.path("/login");
				}
			},
			subscribe: function(firstname, lastname, email, password){
				return $http.post('/subscribe', {firstname: firstname, lastname: lastname, email: email, password: password});
			},
            favorite: function(userId, itemId){
                return $http.post('/objects', {userId: userId, itemId: itemId});
            },
            getFavorites: function(userId){
                return $http.post('/favorites', {userId: userId});
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
                $location.path("/login");
			}
		});
	});