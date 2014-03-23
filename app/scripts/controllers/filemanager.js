'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('FileManagerCtrl', function ($scope, Gist, $modalInstance, $routeParams, $location, Playground, Socket, Editor, Storage) {
    var ws = Socket.ws;
    var gists = Gist.gists
    var currentFile = $routeParams.file || '';
    $scope.availableFiles = [];
    $scope.gistName = '';
    $scope.newFileName = '';
    $scope.fileSelected = '';

    var gistid = $routeParams.gistid || 'example'
    $routeParams.gistid = gistid
    var gist = Gist.getLocal(gistid)
    $scope.availableFiles = Object.keys(gist.files)

    $scope.openFile = function($event){
      $scope.fileSelected = openFileForm.fileSelected.value;
      if(typeof $event != "undefined")
        $event.preventDefault()
      if(typeof $scope.fileSelected == "undefined" || $scope.fileSelected == ''){
        openFileForm.fileSelected.$error = true;
      } else {
        $location.path('/gist/' + $routeParams.gistid + '/' + $scope.fileSelected);
        $scope.ok();
      }
    }

    $scope.newFile = function($event){
      var fileName = newFileForm.newFileName.value;
      if(typeof $event != "undefined") $event.preventDefault()
      Gist.setLocal(Editor.gistid,fileName,' ')
      $modalInstance.dismiss('cancel')
      $location.path('/gist/' + Editor.gistid + '/' + fileName)
    }

    $scope.newGist = function(){

    }

    $scope.ok = function(){
      $modalInstance.dismiss('cancel');
    }
  });
