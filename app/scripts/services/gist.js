'use strict';

angular.module('wearscriptPlaygroundApp')
  .factory('Gist', function($log,Storage,Socket) {

    var service = {
      gists: Storage.get('gists') || [],
    }

    service.list = function(callback){
      var ws = Socket.ws;
      var channel = ws.channel(ws.groupDevice, 'gistList');
      ws.publish_retry(function(channel, gists){
        if(typeof gists == 'object'){
          if (typeof gists == 'object') {
            for (var i = 0; i < gists.length; i++)
              gists[i].url_playground = '#/gist/' + gists[i].id
            Storage.set('gists', gists)
            service.gists = gists;
            if(typeof callback == 'function'){
              callback.call(this)
            }
          }
        }
      }.bind(this), 1000, channel, 'gist', 'list', channel);
    }

    service.get = function(id, callback) {
      var channel = Socket.ws.channel(Socket.ws.groupDevice, 'gistGet')
      $log.info('<< Gist','get',id)
      Socket.ws.publish_retry(
        callback,
        1000,
        channel,
        'gist',
        'get',
        channel,
        id
      );
    }

    service.modify = function(id, fileName, content, callback) {
        $log.info('<< Gist','modify',id,fileName,content)
        var channel = Socket.ws.channel(Socket.ws.groupDevice, 'gistModify')
        var files = {}
        files[fileName] = {content: content}
        Socket.ws.subscribe(channel, callback)
        Socket.ws.publish('gist', 'modify', channel, id, undefined, files)
    }

    service.create = function(secret, description, fileName, content, callback) {
        $log.info('<< Gist','create',description,fileName,content)
        var channel = Socket.ws.channel(Socket.ws.groupDevice, 'gistCreate')
        var files = {}
        files['manifest.json'] = { content: '{"name":""}' }
        files[fileName] = { content: content }
        Socket.ws.subscribe(channel, callback)
        Socket.ws.publish('gist', 'create', channel, secret, description, files)
    }

    service.fork = function(id, callback) {
        $log.info('<< Gist','fork',id)
        var channel = Socket.ws.channel(Socket.ws.groupDevice, 'gistFork')
        Socket.ws.subscribe(channel, callback)
        Socket.ws.publish('gist','fork', channel, id )
    }

    service.refresh = function(gist){
      $log.info('** Gist','refresh',gist)
      var exists = false;
      for( var idx in service.gists ){
        if( service.gists[idx].id == gist.id){
          service.gists[idx] = gist
          exists = true
        }
      }
      if(!exists){
        service.gists.push(gist)
      }
      Storage.set('gists',service.gists)
    }

    return service

  });
