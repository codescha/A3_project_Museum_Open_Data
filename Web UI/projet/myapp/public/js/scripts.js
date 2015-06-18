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
				.when('/collections/:idm', {templateUrl: 'views/collections.html',
					controller: 'CollectionsCtrl',
					access: {requiredLogin: false}})
				.when('/items/:idm/:idc', {templateUrl: 'views/items.html',
					controller: 'ItemsCtrl',
					access: {requiredLogin: false}})
				.when('/item/:idm/:idc/:ido', {templateUrl: 'views/item.html',
					controller: 'ItemCtrl',
					access: {requiredLogin: false}})
				.when('/allItems', {templateUrl: 'views/allItems.html',
					controller: 'AllItemsCtrl',
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
                    controller: 'exhibitionListCtrl',
                    access: {requiredLogin: true}})
                .when('/favorites', {templateUrl: './views/favorites.html',
                    controller: 'FavoriteCtrl',
                    access: {requiredLogin: true}})
                .when('/createExhibition', {templateUrl: './views/create_exhibition.html',
                    controller: 'createExhibitionCtrl',
                    access: {requiredLogin: true}})
                .when('/exhibitionList/:item_id', {templateUrl: './views/exhibitionList.html',
                    controller: 'exhibitionListCtrl',
                    access: {requiredLogin: true}})
				.when('/objectsInExhibition/:usertype/:exhibit_id', {templateUrl: './views/objectsInExhibition.html',
					controller: 'objectsInExhibitionCtrl',
					access: {requiredLogin: true}})
				.when('/allExhibitions', {templateUrl: './views/allExhibitions.html',
					controller: 'allExhibitionsCtrl',
					access: {requiredLogin: true}})
				.when('/modifyExhibition/:exhibitionId', {templateUrl: './views/modifyExhibition.html',
					controller: 'modifyExhibitionCtrl',
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
			getCollections : function(museumId){
				var deferred = $q.defer();
				//if(factory.collections != false){
				//	deferred.resolve(factory.collections);
				//} else {
					//$http.get('json/museumhavre.json')
					console.log("museumId : " + museumId);
					$http.post('getCollectionsByMuseum', {museumId: museumId})
							.success(function(data, status){
								factory.collections = data.collections;
								deferred.resolve(factory.collections);
							}).error(function(data, status){
								deferred.reject('Erreur de chargement du fichier');
							});
				//}
				return deferred.promise;
			},
			getCollection : function(idc){
				var deferred = $q.defer();
				var collection = {};
				var collections = factory.getCollections().then(function(collections){
					angular.forEach(factory.collections, function(value, key){
						if(value.id_collection == idc){
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

	app.factory('ItemFactory', function($http, $q){
		var factory = {
			items : false,
			getAllItems : function(){
				var deferred = $q.defer();
				$http.get('getAllItems')
						.success(function(data, status){
							factory.items = data.items;
							deferred.resolve(factory.items);
						}).error(function(data, status){
							deferred.reject('Erreur de chargement du fichier');
						});
				return deferred.promise;
			},
			getItems : function(collectionId){
				var deferred = $q.defer();
				//if(factory.items != false){
				//	deferred.resolve(factory.items);
				//} else {
					//$http.get('json/museumhavre.json')
					console.log("collectionId : " + collectionId);
					$http.post('getItemsByCollection', {collectionId: collectionId})
							.success(function(data, status){
								factory.items = data.items;
								deferred.resolve(factory.items);
							}).error(function(data, status){
								deferred.reject('Erreur de chargement');
							});
				//}
				return deferred.promise;
			},
			getItem : function(collectionId, itemId){
				var deferred=$q.defer();
				var item = {};
				var items = factory.getItems(collectionId).then(function(items){
					angular.forEach(factory.items, function(value, key){
						if(value.id_item == itemId){
							item = value
						}
					});
					deferred.resolve(item);
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
					//$http.get('json/museums.json')
					$http.get('getAllMuseums')
							.success(function(data, status){
								factory.museums = data.museums;
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
						if(value.id_museum == id){
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

	app.controller('CollectionsCtrl', ['$scope', 'CollectionFactory', '$routeParams',
		function($scope, CollectionFactory, $routeParams) {
			$scope.loading = true;
			$scope.idm = $routeParams.idm;
			$scope.collections = CollectionFactory.getCollections($routeParams.idm).then(function(collections){
				$scope.loading = false;
				$scope.collections = collections;
			}, function(msg){
				console.log(msg);
			});
	}]);

	app.controller('ItemsCtrl', ['$scope', 'ItemFactory', '$routeParams', 'UserService',
        function($scope, ItemFactory, $routeParams, UserService) {
            $scope.currentPage = 1;
            $scope.pageSize = 12;
            $scope.loading = true;
            $scope.idc = $routeParams.idc;
            $scope.idm = $routeParams.idm;
            $scope.items = ItemFactory.getItems($routeParams.idc).then(function (items) {
                $scope.loading = false;
                $scope.items = items;
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
                                alert("Favoris deja enregistré !");
                            }
                            else if (data.code == "ko") {
                                console.log('erreur ajout aux favoris');
                            } else {
								alert("Favoris ajouté");
                            }
                        }).error(function (status, data) {
                            console.log(status);
                            console.log(data);
                        });
                }
            }

        }]);

	app.controller('ItemCtrl', function($scope, ItemFactory, $routeParams) {
		$scope.loading = true;
            $scope.idc = $routeParams.idc;
            $scope.idm = $routeParams.idm;
            $scope.ido = $routeParams.ido;
		var item =  ItemFactory.getItem($routeParams.idc, $routeParams.ido).then(function(item){
			$scope.loading = false;
			$scope.item = item;
		}, function(msg){
			alert(msg);
		});

	});

	app.controller('AllItemsCtrl', ['$scope', 'ItemFactory',
		function($scope, ItemFactory) {
			$scope.loading = true;
			$scope.items = ItemFactory.getAllItems().then(function(items){
				$scope.loading = false;
				$scope.items = items;
			}, function(msg){
				console.log(msg);
			});
	}]);

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

	app.filter('trusted', ['$sce', function ($sce) {
	    return function(url) {
	        return $sce.trustAsResourceUrl(url);
	    };
	}]);

	app.controller('MuseumCtrl', function($scope, MuseumFactory, $routeParams) {
		$scope.loading = true;
        $scope.idm = $routeParams.idm;
		var museum =  MuseumFactory.getMuseum($routeParams.idm).then(function(museum){
			$scope.loading = false;
			$scope.museum = museum;
			$scope.src = "https://maps.google.fr/maps?f=q&amp;source=s_q&amp;hl=fr&amp;geocode=&amp;q="+museum.name+"+"+museum.zipcode+"&amp;aq=0&amp;ie=UTF8&amp;t=m&amp;output=embed"
		}, function(msg){
			alert(msg);
		});
		function initialize() {
			var mapProp = {
				center:new google.maps.LatLng(51.508742,-0.120850), zoom:5, mapTypeId:google.maps.MapTypeId.ROADMAP
			};
			var map=new google.maps.Map(document.getElementById("googleMap"), mapProp);
		}
		google.maps.event.addDomListener(window, 'load', initialize);

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
                        if(data.code =="exists"){
                            alert("Email déjà inscrit !");
                        }
                        else if(data.code == "ko"){
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

app.controller('createExhibitionCtrl', ['$scope', '$location', '$window', 'UserService',
    function($scope, $location, $window, UserService) {

        $scope.createExhibition = function createExhibition(title, description, userId) {
            if (title !== undefined && description !== undefined && userId !== undefined) {

                UserService.createExhibition(title, description, userId).success(function (data) {
                   if(data.code == "ko"){
                        console.log('erreur creation expo');
                    } else {
                        $location.path("/museums");
                    }
                }).error(function (status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }
    }
]);

app.controller('objectsInExhibitionCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', '$routeParams', '$http', '$route',
	function objectsInExhibitionCtrl($scope, $location, $window, UserService, AuthenticationService, $routeParams, $http, $route) {
		$scope.exhibition_id = {
			exhibition_id: ''
		}

		var exhibition_id = $scope.exhibition_id.exhibition_id;

		$scope.exhibitionChosen_id = $routeParams.exhibit_id;
		console.log($scope.exhibitionChosen_id);

		if($routeParams.usertype == 'mine'){
			$scope.showButton = true;
		}else{
			$scope.showButton = false;
		}

		$scope.objectsInExhibition = function (exhibition_id) {
			if (exhibition_id !== undefined) {

				UserService.objectsInExhibition(exhibition_id).success(function (data) {
					if(data.code == "ko"){
						console.log('erreur');
					} else {
						$scope.objects = data.objects;
						console.log($scope.objects);
					}
				}).error(function (status, data) {
					console.log(status);
					console.log(data);
				});
			}
		};

		$scope.objectsInExhibition($scope.exhibitionChosen_id);

		$scope.deleteExhibitionItem = function (exhibitionId, itemId) {
			if (exhibitionId !== undefined && itemId !== undefined) {

				UserService.deleteExhibitionItem(exhibitionId, itemId).success(function (data) {
					if(data.code == "ko"){
						console.log('erreur');
					} else {
						alert("Suppression effectuée");
						$route.reload();
					}
				}).error(function (status, data) {
					console.log(status);
					console.log(data);
				});
			}
		};

		$scope.collectionId = {
			collectionId: ''
		}

		var collectionId = $scope.collectionId.collectionId;
		$scope.getMuseumByCollection = function getMuseumByCollection(itemId, collectionId) {
			console.log(collectionId);
			if (collectionId !== undefined && itemId !== undefined) {
				UserService.getMuseumByCollection(collectionId).success(function (data) {
					if (data.code == "ko") {
						console.log('erreur');
					} else {
						console.log("DATA"+data);
						$scope.museum = data.museum;
						console.log($scope.museum);
						console.log("id musee" +$scope.museum.museum_id_museum);
						$location.path("/item/"+$scope.museum.museum_id_museum+"/"+$scope.museum.id_collection+"/"+itemId);
					}
				}).error(function (status, data) {
					console.log(status);
					console.log(data);
				});
			}
		};
	}
]);

    app.controller('UserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', '$http',
        function UserCtrl($scope, $location, $window, UserService, AuthenticationService, $http) {

        }
    ]);

    app.controller('FavoriteCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', '$http', '$route',
        function FavoriteCtrl($scope, $location, $window, UserService, AuthenticationService, $http,$route) {

            $scope.getFavorites = function (userId) {
                if (userId !== undefined) {

                    UserService.getFavorites(userId).success(function (data) {
                        if(data.code == "ko"){
                            console.log('erreur récupération favoris');
                        } else {
                            $scope.favorites = data.favorites;
                        }
                    }).error(function (status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            };

            $scope.getFavorites($scope.$parent.userInfos.id_user);

			$scope.deleteFavorite = function deleteFavorite(userId, itemId) {
				if (userId !== undefined && itemId !== undefined) {
					UserService.deleteFavorite(userId, itemId).success(function (data) {
						if (data.code == "ko") {
							console.log('erreur suppression favoris');
						} else {
							alert("Supression effectuée");
							$route.reload();
						}
					}).error(function (status, data) {
						console.log(status);
						console.log(data);
					});
				}
			};
			$scope.collectionId = {
				collectionId: ''
			}

			var collectionId = $scope.collectionId.collectionId;
			$scope.getMuseumByCollection = function getMuseumByCollection(itemId, collectionId) {
				console.log(collectionId);
				if (collectionId !== undefined && itemId !== undefined) {
					UserService.getMuseumByCollection(collectionId).success(function (data) {
						if (data.code == "ko") {
							console.log('erreur');
						} else {
							console.log("DATA"+data);
							$scope.museum = data.museum;
							console.log($scope.museum);
							console.log("id musee" +$scope.museum.museum_id_museum);
							console.log("id coll" +$scope.favorites.collection_id_collection);
							console.log("id item" +$scope.favorites.id_item);
							$location.path("/item/"+$scope.museum.museum_id_museum+"/"+$scope.museum.id_collection+"/"+itemId);
						}
					}).error(function (status, data) {
						console.log(status);
						console.log(data);
					});
				}
			};
		}
    ]);

	app.controller('exhibitionListCtrl', ['$scope', '$routeParams', 'UserService', '$http', '$window', '$route',
    function($scope, $routeParams, UserService, $http, $window, $route) {

        $scope.exhibitionList = function exhibitionList(userId) {
            if (userId !== undefined) {
                UserService.exhibitionList(userId).success(function (data) {
                   if (data.code == "ko") {
                        console.log('erreur');
                    } else {
                       console.log(data);
                       $scope.exhibition = data.exhibition;
                    }
                }).error(function (status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }




		$scope.deleteExhibition = function deleteExhibition(userId, exhibitionId) {
			if (userId !== undefined && exhibitionId !== undefined) {
				UserService.deleteExhibition(userId,exhibitionId).success(function (data) {
					if (data.code == "ko") {
						console.log('erreur');
					} else {
						console.log(data);
						console.log(userId);
						console.log(exhibitionId);
						alert("Exposition supprimée");
						$route.reload();
					}
				}).error(function (status, data) {
					console.log(status);
					console.log(data);
				});
			}
		}

        $scope.exhibitionList($scope.$parent.userInfos.id_user);
        $scope.objectToAdd_id = $routeParams.item_id;
        console.log($scope.objectToAdd_id);
		$scope.itemExists = false;

        $scope.fillExhibition = function fillExhibition(exhibitionId, itemId) {
            if (exhibitionId !== undefined && itemId !== undefined) {
                UserService.fillExhibition(exhibitionId, itemId).success(function (data) {
					if(data.code =="exists"){
						$scope.itemExists = true;
						alert("Oeuvre deja ajoutee a l'exposition !");
					}
                    else if (data.code == "ko") {
                        console.log('erreur');
                        alert('Oeuvre déjà ajoutée à l\'exposition');
                    } else {
                        console.log(data);
                        alert('Oeuvre ajoutée à l\'exposition');                    }
                }).error(function (status, data) {
                    console.log(status);
                    console.log(data);
                    alert('Erreur de sauvegarde');
                });
            }
        }

    }]);

		app.controller('modifyExhibitionCtrl', ['$scope', '$routeParams', 'UserService', '$http', '$window', '$route', '$location',
			function($scope, $routeParams, UserService, $http, $window, $route, $location) {

				$scope.exhibitToUpdate = $routeParams.exhibitionId;

				console.log($scope.exhibitToUpdate);
				$scope.getExhibitionInfo = function getExhibitionInfo(exhibitionId) {
					if (exhibitionId !== undefined) {
						UserService.getExhibitionInfo(exhibitionId).success(function (data) {
							if (data.code == "ko") {
								console.log('erreur');
							} else {
								console.log(data);
								$scope.modifyExhibition = data.exhibition;
							}
						}).error(function (status, data) {
							console.log(status);
							console.log(data);
						});
					}
				}

				$scope.getExhibitionInfo($scope.exhibitToUpdate);

				$scope.updateExhibition = function updateExhibition(exhibitionId, exhibitionTitle, exhibitionDescription) {
					if (exhibitionId !== undefined && exhibitionTitle !== undefined && exhibitionDescription !== undefined) {
						UserService.updateExhibition(exhibitionId, exhibitionTitle, exhibitionDescription).success(function (data) {
							if (data.code == "ko") {
								console.log('erreur');
							} else {
								console.log(data);
								$location.path("/user_exhibitions");
							}
						}).error(function (status, data) {
							console.log(status);
							console.log(data);
						});
					}
				}

			}]);

	app.controller('allExhibitionsCtrl', ['$scope', '$routeParams', 'UserService', '$http', '$window',
	function($scope, $routeParams, UserService, $http, $window) {

		$scope.allExhibitions = function allExhibitions() {
			UserService.allExhibitions().success(function (data) {
				if (data.code == "ko") {
					console.log('erreur');
				} else {
					console.log(data);
					$scope.exhibitions = data.exhibitions;
				}
			}).error(function (status, data) {
				console.log(status);
				console.log(data);
			});
		};

		$scope.allExhibitions();

	}]);

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
                return $http.post('/items', {userId: userId, itemId: itemId});
            },
            getFavorites: function(userId){
                return $http.post('/favorites', {userId: userId});
            },
            createExhibition: function(title, description, userId){
                return $http.post('/createExhibition', {title: title, description: description, userId: userId});
            },
            exhibitionList: function(userId){
                return $http.post('/exhibitionList', {userId: userId});
            },
            fillExhibition: function(exhibitionId, itemId){
                return $http.post('/fillExhibition', {exhibitionId: exhibitionId, itemId: itemId});
            },
			objectsInExhibition: function(exhibition_id){
				return $http.post('/objectsInExhibition', {exhibition_id: exhibition_id});
			},
			deleteFavorite: function(userId, itemId){
				return $http.post('/deleteFavorite', {userId: userId, itemId: itemId});
			},
			deleteExhibitionItem: function(exhibitionId, itemId){
				return $http.post('/deleteExhibitionItem', {exhibitionId: exhibitionId, itemId: itemId});
			},
			allExhibitions: function(){
				return $http.get('/allExhibitions');
			},
			deleteExhibition: function(userId, exhibitionId){
				return $http.post('/deleteExhibition', {userId: userId, exhibitionId: exhibitionId});
			},
			getExhibitionInfo: function(exhibitionId){
				return $http.post('/getExhibitionInfo', {exhibitionId: exhibitionId});
			},
			updateExhibition: function (exhibitionId, exhibitionTitle, exhibitionDescription){
				return $http.post('/updateExhibition', {exhibitionId: exhibitionId, exhibitionTitle: exhibitionTitle, exhibitionDescription: exhibitionDescription});
			},
			getMuseumByCollection: function(collectionId){
				return $http.post('/getMuseumByCollection', {collectionId: collectionId});
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