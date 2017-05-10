var crypto = require('crypto');
var User = require('../model/User');
var logger = require('../model/Logger');

function Corner() {}

/**
 * Check whether the request is valid or not.
 * @param method: GET or POST
 * @param url: the requested url, e.g. /api/info
 * @param name: user name
 * @param stamp: user's time stamp
 * @param sign: HMAC-SHA1 signature
 * @param callback(state): state = invalid (wrong format) | reject | success
 */
Corner.signature = function(method, url, name, stamp, sign, callback) {
  if( url.length == 0 || name.length == 0 || stamp.length == 0 || sign.length == 0 ) {
    callback('invalid');
    return;
  }

  User.getKeys(name, function (err, result) {
    if( err || result.length == 0) {
      logger.log('error', 'illegal authentication attempt by ' + name + '@' + url );
      callback('reject');
    }
    else {
      // check time stamp
      var key = result[0].appKey;
      var secret = result[0].secretKey;

      // HMAC-SHA1
      // Key = secretKey, BaseString = 'method.url.appKey.stamp'
      var text = method + '.' + url + '.' + key + '.' + stamp ;
      var hash = crypto.createHmac('sha1', secret).update(text).digest('hex');

      if ( hash == sign )
        callback('success');
      else {
        logger.log('error', 'illegal authentication attempt by ' + name + '@' + url );
        callback('reject');
      }
    }
  });
};

module.exports = Corner;
