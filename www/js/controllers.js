angular.module('registry.controllers', [])

.controller('SessionController', function($scope, $rootScope, API){
    $scope.signin = function(page){
        if($rootScope.getUser() === "undefined"){
            API.signin(page);
        } else {
            window.location.href = page;
        }

    };

    $scope.logout = function(){
        $rootScope.deleteUser();
        API.logout().success(function(data, status, headers, config){
            window.location.href = ('/registry');
        }).error(function(data, status, headers, config){
            console.log(data);
        });
    };
})

.controller('FavController', function($scope, $rootScope, API){
    $scope.favoriteList = [];

    API.getUser().success(function(data, status, headers, config){
         $rootScope.setUser(data.username);
         $scope.user = $rootScope.getUser();

         API.checkFav().success(function(data, status, header, config){
            $scope.favoriteList = data;
        }).error(function(data, status, headers, config){
            console.log(data);
        });
    }).error(function(data, status, headers, config){
        $scope.err = true;
    });

    $scope.toggleStatus = function(file) {
        API.favFile(file._id).success(function(data, status, headers, config){
            if($rootScope.getUser() != "undefined"){
                $scope.favoriteList.push(file._id);
            }
        }).error(function(data, status, headers, config){
            $scope.err = true;
        });
    };

    $scope.isSelected = function(file) {
        return $scope.favoriteList.indexOf(file._id) > -1;
    };
})

.controller('MainController', function($scope, $location, Search, API){

    $scope.search = function(){
        if(this.data.search !== ""){
            Search.setValue(this.data.search);
            $location.path("/registry");
        }
    };

    $scope.signin = function(page){
        API.signin(page);
    };
})

.controller('MyStackController', function($scope, $rootScope, API, Search){

    API.getUser().success(function(data, status, headers, config){
         $rootScope.setUser(data.username);
         $scope.user = $rootScope.getUser();
    }).error(function(data, status, headers, config){
        $scope.err = true;
    });

     API.getUserFiles().success(function(data, status, headers, config){
         $scope.files = data;
         $scope.loaded = true;
     }).error(function(data, status, headers, config){
         $scope.err = true;
         $scope.loaded = true;
     });

     $scope.showModal = false;
     $scope.toggleModal = function(){
         $scope.showModal = !$scope.showModal;
     };

     $scope.generateEmbed = function(id){
         API.getFileWithId(id).success(function(data, status, headers, config){
             $scope.embedScript = '<script type="text/javascript" src="http://code.jquery.com/jquery-2.0.3.min.js"></script>' +
                                 '<script>var file=document.createElement("pre");$.get("http://staging.stackfiles.io/api/v1/user/repos/embed?user='+data.user+'&repository='+data.projectName+'&branch='+data.branch+'&path='+data.path+'").done(function(e){file.setAttribute("id","stack"),'+
                                 'file.setAttribute("style","border: 1px solid #cccccc; overflow: auto; display:inline-block; padding: 6px 6px 6px 6px;"),$("#stack").append(e)}),$(file).appendTo($("#stackfile"));</script>';
         }).error(function(data, status, headers, config){
             $scope.embedScript = 'Unable to generate the embed script. Please try again.';
         });
     };

    $scope.searchFile = function(){
        var term = this.data.search;
        API.searchFile(term).success(function(data, status, headers, config){
            $scope.results = data;
        }).error(function(data, status, headers, config){
            $scope.err = true;
        });
    };
})


.controller('FavoriteController', function($scope, $rootScope, API, Search){
    API.getUser().success(function(data, status, headers, config){
         $rootScope.setUser(data.username);
         $scope.user = $rootScope.getUser();
    }).error(function(data, status, headers, config){
        $scope.err = true;
    });

    API.getUserFavorites().success(function(data, status, headers, config){
        $scope.files = data;
        $scope.loaded = true;
    }).error(function(data, status, headers, config){
        $scope.err = true;
        $scope.loaded = true;
    });

    $scope.showModal = false;
    $scope.toggleModal = function(){
        $scope.showModal = !$scope.showModal;
    };

    $scope.generateEmbed = function(id){
        API.getFileWithId(id).success(function(data, status, headers, config){
            $scope.embedScript = '<script type="text/javascript" src="http://code.jquery.com/jquery-2.0.3.min.js"></script>' +
                                '<script>var file=document.createElement("pre");$.get("http://staging.stackfiles.io/api/v1/user/repos/embed?user='+data.user+'&repository='+data.projectName+'&branch='+data.branch+'&path='+data.path+'").done(function(e){file.setAttribute("id","stack"),'+
                                'file.setAttribute("style","border: 1px solid #cccccc; overflow: auto; display:inline-block; padding: 6px 6px 6px 6px;"),$("#stack").append(e)}),$(file).appendTo($("#stackfile"));</script>';
        }).error(function(data, status, headers, config){
            $scope.embedScript = 'Unable to generate the embed script. Please try again.';
        });
    };

   $scope.searchFile = function(){
       var term = this.data.search;
       API.searchFile(term).success(function(data, status, headers, config){
           $scope.results = data;
       }).error(function(data, status, headers, config){
           $scope.err = true;
       });
   };
})

.controller('RegistryController', function($scope, $rootScope, $window, API, Search, Loader){

    $scope.files = new Loader();
    $scope.loaded = true;

    /*API.getFiles($scope.currentPage).success(function(data, status, headers, config){
        $scope.files = data;
        $scope.loaded = true;
    }).error(function(data, status, headers, config){
        $scope.err = true;
    });*/

    API.getUser().success(function(data, status, headers, config){
         $rootScope.setUser(data.username);
         $scope.user = $rootScope.getUser();

         API.checkFav().success(function(data, status, header, config){
            $scope.favoriteList = data;
        }).error(function(data, status, headers, config){
            console.log(data);
        });

    }).error(function(data, status, headers, config){
        $scope.err = true;
    });

    $scope.showModal = false;
    $scope.toggleModal = function(){
        $scope.copyText= {status: 'notClicked'};
        $scope.showModal = !$scope.showModal;
    };

    $scope.generateEmbed = function(id){
        API.getFileWithId(id).success(function(data, status, headers, config){
            $scope.embedScript = '<script type="text/javascript" src="http://code.jquery.com/jquery-2.0.3.min.js"></script>' +
                                '<script>var file=document.createElement("pre");$.get("http://staging.stackfiles.io/api/v1/user/repos/embed?user='+data.user+'&repository='+data.projectName+'&branch='+data.branch+'&path='+data.path+'").done(function(e){file.setAttribute("id","stack"),'+
                                'file.setAttribute("style","border: 1px solid #cccccc; overflow: auto; display:inline-block; padding: 6px 6px 6px 6px;"),$("#stack").append(e)}),$(file).appendTo($("#stackfile"));</script>';
        }).error(function(data, status, headers, config){
            $scope.embedScript = 'Unable to generate the embed script. Please try again.';
        });
    };

    $scope.deploy = function(id){
        window.location.href = ('/api/v1/deploy/'+id);
    };

    $scope.searchFile = function(){
        var term = this.data.search;
        API.searchFile(term).success(function(data, status, headers, config){
            $scope.results = data;
        }).error(function(data, status, headers, config){
            $scope.err = true;
        });
    };

    $scope.checkSearch = function(){
        if(Search.getValue().search !== null){
            $scope.data = Search.getValue();
            $scope.searchFile(Search.getValue());
        }
    };

})

.controller('RegistryDetailsController', function($scope, $rootScope, $window, $routeParams, API){

    $scope.user = $rootScope.getUser();

    API.getFileWithId($routeParams.registryId).success(function(data, status, headers, config){
        $scope.data = data;
        API.getYAMLFile(data._id, data.projectName, data.path).success(function(yamlData, status, headers, config){
            $scope.composeFile = yamlData;
            $scope.loaded = true;
        }).error(function(data, status, headers, config){
            $scope.composeFile = "Unable to fetch tutum.yml from Github repository. Please select a repository that contains a tutum.yml or a docker-compose.yml file";
            $scope.loaded = true;
        });
        API.checkFav().success(function(data, status, header, config){
           $scope.favoriteList = data;
        }).error(function(data, status, headers, config){

        });
    }).error(function(data, status, headers, config){
        window.location.href = ("/404");
    });

    $scope.showModal = false;
    $scope.toggleModal = function(){
        $scope.showModal = !$scope.showModal;
    };

    $scope.generateEmbed = function(id){
        API.getFileWithId(id).success(function(data, status, headers, config){
            $scope.embedScript = '<div id="stackfile"></div><script type="text/javascript" src="http://code.jquery.com/jquery-2.0.3.min.js"></script>' +
                                '<script>var file=document.createElement("pre");$.get("http://staging.stackfiles.io/api/v1/user/repos/embed?user='+data.user+'&repository='+data.projectName+'&branch='+data.branch+'&path='+data.path+'").done(function(e){file.setAttribute("id","stack"),'+
                                'file.setAttribute("style","border: 1px solid #cccccc; overflow: auto; display:inline-block; padding: 6px 6px 6px 6px;"),$("#stack").append(e)}),$(file).appendTo($("#stackfile"));</script>';
        }).error(function(data, status, headers, config){
            $scope.embedScript = 'Unable to generate the embed script. Please try again.';
        });
    };

    $scope.deploy = function(id){
        window.location.href = ('/api/v1/deploy/'+id);
    };

    $scope.toggleStatus = function(file) {
        $scope.favoriteList.push(file._id);
        API.favFile(file._id).success(function(data, status, headers, config){

        }).error(function(data, status, headers, config){
            $scope.err = true;
        });
    };
    $scope.isSelected = function(file) {
        return $scope.favoriteList.indexOf(file._id) > -1;
    };

    $scope.deleteStackfile = function(id){
        API.deleteStackfile(id).success(function(data, status, headers, config){
            $window.location.href = ("/registry");
        }).error(function(data, status, headers, config){
            $scope.err = true;
        });
    };

})

.controller('CreateController', function($scope, $rootScope, $window, API){

    var orgs = [];

    API.getUser().success(function(data, status, headers, config){
         $rootScope.setUser(data.username);
         $scope.user = $rootScope.getUser();
    }).error(function(data, status, headers, config){
        $scope.err = true;
    });

    $scope.signin = function(page){
        API.signin(page);
    };

    $scope.logout = function(){
        $rootScope.deleteUser();
        API.logout().success(function(data, status, headers, config){
            window.location.href = ('/registry');
        }).error(function(data, status, headers, config){
            console.log(data);
        });
    };

    $scope.lock = function(){
        $scope.lock =true;
    }

    $scope.getOrgs = function(){

        if($scope.data.title.length > 0){
            $scope.lock = false;
        } else {
            $scope.lock = true;
        }

        var orgs = [];
        var repos = [];
        $scope.repos = [];
        var branches = [];
        $scope.branches = [];
        $scope.data.path = "/";
        $scope.stackfile = "This window will refresh automatically after you filled the form.";

        API.getUserOrgs().success(function(data, status, headers, config){
            angular.forEach(data, function(value, key){
                orgs.push(value.login);
            });
            orgs.push($rootScope.getUser());
            $scope.orgs=orgs;
        }).error(function(data, status, headers, config){
            $scope.err = true;
        });
    };

    $scope.getRepos = function(){
        var repos = [];
        $scope.repos = [];
        var branches = [];
        $scope.branches = [];
        $scope.data.path = "/";
        $scope.stackfile = "This window will refresh automatically after you filled the form.";

        API.getUserRepos($scope.data.orgname).success(function(data, status, headers, config){
            angular.forEach(data, function(value, key){
                repos.push(value.name);
            });
            $scope.repos=repos;
        }).error(function(data, status, headers, config){
            $scope.err = true;
        });
    };

    $scope.getBranches = function(){
        var branches = [];
        $scope.branches = [];
        $scope.data.path = "/";
        $scope.stackfile = "This window will refresh automatically after you filled the form.";
        API.getRepoBranches($scope.data.orgname, $scope.data.reponame).success(function(data, status, headers, config){
            angular.forEach(data, function(value, key){
                branches.push(value);
            });
            $scope.branches=branches;
        }).error(function(data, status, headers, config){
            $scope.err = true;
        });
    };

    $scope.getComposeFile = function(orgname, name, branch, path){
        $scope.stackfile = "";
        API.getUserReposInfo(orgname, name, branch, path).success(function(data, status, headers, config){
            if(data === "File not found"){
                $scope.stackfile = "Unable to fetch tutum.yml from Github repository. Please select a repository that contains a tutum.yml or a docker-compose.yml file";
            } else {
                $scope.stackfile = data;
            }
        }).error(function(data, status, headers, config){
            console.log(data);
            $scope.err = true;
        });
    };

    $scope.createNew = function(){
        var title = this.data.title;
        var stackfile = jsyaml.load($scope.stackfile);
        var branch = this.data.branch;
        var path = this.data.path;
        var projectName = this.data.reponame;
        var organizationName = this.data.orgname;

        var form = {
            title: title.replace(/\(\(/g,'{{').replace(/\)\)/, '}}').replace(/'/g,'\''),
            stackfile: stackfile,
            branch: branch,
            path: path,
            name: projectName,
            orgname: organizationName
        };

        API.saveFile(form).success(function(data, status, headers, config){
            $window.location.href = ('/registry');
        }).error(function(data, status, header, config){
            window.location.href = ("/404");
        });
    };
});
