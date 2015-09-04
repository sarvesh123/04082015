'use strict';

// Configuring the Insights module
angular.module('insights').run(['Menus',
  function (Menus) {
    // Add the insights dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Insights',
      state: 'insights',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'insights', {
      title: 'List Insights',
      state: 'insights.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'insights', {
      title: 'Create Insights',
      state: 'insights.create',
      roles: ['user']
    });
  }
]);
