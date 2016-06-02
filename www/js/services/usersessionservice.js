(function() {
    'use strict';
    angular
        .module('washery.services')
        .service('userSessionService', userSessionService);

    /* @ngInject */
    function userSessionService(
      WasheryApi,
      $http,
      $localStorage,
      $sessionStorage,
      $state,
      ErrorService
    ) {
      var session = {};
      if($localStorage.session){
        if(new Date($localStorage.created)<new Date().setTime( new Date().getTime() - 60 * 86400000 )){
          console.log('old login');
        } else {
          session = $localStorage.session;
          WasheryApi.user.setApiKey(session.apikey);
        }
      }
      if($sessionStorage.session){
        session = $sessionStorage.session;
        WasheryApi.user.setApiKey(session.apikey);
      }
      return {
        login:function(user,cb){
          WasheryApi.user.login(user).then(function(response){
            if(response.status === 200 && !response.data.error){
              session = response.data.data;
              WasheryApi.user.setApiKey(session.apikey);
              if(user.rememberme){
                $localStorage.session = session;
                $localStorage.created = new Date();
              } else {
                $sessionStorage.session = session;
              }
              cb(true);
            } else {
              cb(false);
              ErrorService.handle(response);
            }
          },function(err){
            cb(false);
            ErrorService.handle(err);
          });
        },
        logout:function(){
          session={};
          $http.defaults.headers.common.Authorization = '';
          $localStorage.$reset();
          $sessionStorage.$reset();
          $state.go('access.login');
        },
        isLoggedIn:function(){
          if(session.apikey){
            return true;
          }
          return false;
        },
        userHasPermission:function(required){
          if(session.level == required){
            return true;
          }
          return false;
        },
        getApiKey:function(){
          if(!session.apikey){
            return null;
          }
          return session.apikey;
        },
        getName:function(){
          if(session){
            return session.name;
          } else {
            return '';
          }
        },
        getProfileImage:function(){
          if(session){
            return session.img;
          } else {
            return '';
          }
        },
        getSession:function(){
          return session;
        },
        setSession:function(s){
          session = s;
        }
      };
    }
})();