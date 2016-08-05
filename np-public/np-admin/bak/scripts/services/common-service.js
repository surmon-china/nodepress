/**
*
* CommonService Module
*
* Description
*
*/
angular.module('CommonService', [])
.service('CommonService', ['$resource', 'AdminConfig',
  function ($resource, AdminConfig) {
    return $resource(AdminConfig.api_path + '/common', {}, {

      // 删除
      del: {
        method: 'DELETE',
        url: appConfig.api_path + '/common/:common_id'
      },

    });
  }
])