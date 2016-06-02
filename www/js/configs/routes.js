(function() {
  'use strict';
  angular
    .module('washery.configs')
    .config(routes);

  /* @ngInject */
  function routes(
    $stateProvider,
    $urlRouterProvider,
    $httpProvider
  ) {
    $httpProvider.defaults.useXDomain = true;
    $urlRouterProvider.otherwise('/access/walkthrough');
    $stateProvider
      .state('access', {
        templateUrl: 'views/access/access.html',
        controller: 'AccessCtrl',
        abstract: true
      })
      .state('access.walkthrough', {
        templateUrl: 'views/access/walkthrough.html',
        url: '/walkthrough'
      })
      .state('access.login', {
        templateUrl: 'views/access/login.html',
        controller: 'LoginCtrl as $ctrl',
        url: '/login'
      })
      .state('access.recover-password', {
        templateUrl: 'views/access/recover-password.html',
        controller: 'PasswordRecoveryCtrl as $ctrl',
        url: '/recover'
      })/*
      .state('access.reset-password', {
        templateUrl: 'views/access/reset-password.html',
        controller: 'PasswordRecoveryCtrl as $ctrl',
        url: '/reset?code='
      })
      .state('access.register', {
        templateUrl: 'views/access/register.html',
        controller: 'RegisterCtrl as $ctrl',
        url: '/register'
      })
      .state('access.registerwasher', {
        templateUrl: 'views/access/register_washer.html',
        controller: 'RegisterCtrl as $ctrl',
        url: '/register/washer'
      })
      .state('access.activate', {
        templateUrl: 'views/access/activate-account.html',
        controller: 'RegisterCtrl as $ctrl',
        url: '/confirm?code&username'
      })
    // ----- USER -----
      .state('user', {
        templateUrl: 'views/user/side-menu.html',
        abstract: true,
        controller: 'BaseCtrl as $baseCtrl',
        url: '/u'
      })
      .state('user.dashboard', {
        templateUrl: 'views/user/dashboard.html',
        controller: 'DashboardCtrl as $ctrl',
        url: '/dashboard',
        data: {auth:['USER']},
      })
      .state('user.profile', {
        templateUrl: 'views/user/profile.html',
        controller: 'ProfileCtrl as $ctrl',
        url: '/profile',
        data: {auth:['USER']}
      })/*
      .state('user.viewprofile', {
        templateUrl: 'views/common/viewprofile.html',
        controller: 'ViewProfileCtrl as $ctrl',
        url: '/viewprofile?uname=',
        data: {auth:['USER']}
      })
      .state('user.bookings', {
        templateUrl: 'views/user/bookings.html',
        controller: 'BookingsCtrl as $ctrl',
        url: '/bookings',
        data: {auth:['USER']}
      })
      .state('user.messages', {
        templateUrl: 'views/common/messages.html',
        controller: 'MessagesCtrl as $ctrl',
        abstract: true,
        url: '/messages',
        data: {auth:['USER']}
      })
      .state('user.messages.new', {
        templateUrl: 'views/common/messages/message_inbox.html',
        url: '/new'
      })
      .state('user.messages.archive', {
        templateUrl: 'views/common/messages/message_archive.html',
        url: '/achive'
      })
      .state('user.messages.send', {
        templateUrl: 'views/common/messages/message_outbox.html',
        url: '/send'
      })
      .state('user.messages.deleted', {
        templateUrl: 'views/common/messages/message_trash.html',
        url: '/deleted'
      })
      .state('user.places', {
        templateUrl: 'views/user/places.html',
        controller: 'PlacesCtrl as $ctrl',
        abstract: true,
        url: '/places',
        data: {auth:['USER']}
      })
      .state('user.places.all', {
        templateUrl: 'views/user/places/all.html',
        url: '/all'
      })
      .state('user.places.new', {
        templateUrl: 'views/user/places/new.html',
        url:'/new'
      })
      .state('user.vehicles', {
        templateUrl: 'views/user/vehicles.html',
        controller: 'VehiclesCtrl as $ctrl',
        url: '/vehicles',
        data: {auth:['USER']}
      })
      .state('user.payments', {
        templateUrl: 'views/common/payments.html',
        controller: 'PaymentsCtrl as $ctrl',
        url: '/payments',
        data: {auth:['USER', 'WASHER']}
      })
      .state('user.settings', {
        templateUrl: 'views/common/settings.html',
        controller: 'SettingsCtrl as $ctrl',
        url: '/settings',
        data: {auth:['USER']}
      })
    // ------- WASHER -------
      .state('washer', {
        templateUrl: 'views/washer/washer.html',
        controller: 'WasherCtrl as $ctrl',
        abstract: true,
        url: '/w',
        data: {auth:['WASHER']}
      })
      .state('washer.dashboard', {
       templateUrl: 'views/washer/dashboard.html',
       url: '/dashboard',
       data: {auth:['WASHER']}
      })*/;
  }
})();