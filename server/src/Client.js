'use strict';

var fs = require('fs-extra');
var request = require('request');

var defaultConfiguration = {
    serviceURL: 'http://umyproto.com/react-builder-service'
    //serviceURL: 'http://localhost:8888/react-builder-service'
};

var Client = {

    configModel: defaultConfiguration,

    post: function(methodName, body, callback, isAuth){
        var self = this;
        var url = self.configModel.serviceURL + '/' + methodName;
        var requestOptions = {
            uri: url,
            method: 'POST',
            json: true,
            body: body
        };
        if(isAuth){
            if(self.configModel.user && self.configModel.pass){
                requestOptions.auth = {
                    'user': self.configModel.user,
                    'pass': self.configModel.pass,
                    'sendImmediately': true
                }
            } else {
                if(callback){
                    callback({error: true, errors:['Specify user name and password or create new account.']});
                }
                return;
            }
        }
        setTimeout(function(){
            try{
                request(
                    requestOptions,
                    function (error, response, body) {
                        if(response.statusCode !== 200){
                            if(response.statusCode === 401){
                                if(callback){
                                    callback({error: true, errors:['User is not authenticated']})
                                }
                            } else {
                                if(callback){
                                    callback(
                                        {
                                            error: true,
                                            errors:
                                                ['Got error code ' + response.statusCode + ' processing request to ' + url]
                                        }
                                    )
                                }
                            }
                        } else if(error){
                            console.error('Error connection to ' + self.configModel.serviceURL);
                            if(callback){
                                callback({error: true, errors:['Error connection to ' + self.configModel.serviceURL]});
                            }
                        } else {
                            if(callback){
                                callback(body);
                            }
                        }
                    }
                )
            } catch(e){
                if(callback){
                    callback({error: true, errors:['Error: ' + e.message]});
                }
            }
        }, 0);
    },

    /**
     *
     * @param {array} optionArray
     * {string} url
     * {string} destPath
     * {object} requestBody
     * @param {function} callback
     * @param {boolean} isAuth
     * @param {int} index
     */
    download: function(optionArray, callback, isAuth, index){
        if(index >= 0 && index < optionArray.length){
            var path = optionArray[index].destPath;
            var requestBody = optionArray[index].requestBody;
            var self = this;
            var url = self.configModel.serviceURL + optionArray[index].url;
            var requestOptions = {
                uri: url,
                headers: {'Content-type': 'application/json'},
                method: 'POST',
                body: JSON.stringify(requestBody),
                encoding: null
            };
            if(isAuth){
                if(self.configModel.user && self.configModel.pass){
                    requestOptions.auth = {
                        'user': self.configModel.user,
                        'pass': self.configModel.pass,
                        'sendImmediately': true
                    }
                } else {
                    if(callback){
                        callback('Specify user name and password or create new account.');
                    }
                    return;
                }
            }
            setTimeout(function(){
                try{
                    request(
                        requestOptions,
                        function (error, response, body) {
                            if(response.statusCode !== 200){
                                if(response.statusCode === 401){
                                    if(callback){
                                        callback('User is not authenticated');
                                    }
                                } else {
                                    if(callback){
                                        callback('Got error code ' + response.statusCode + ' processing request to ' + url);
                                    }
                                }
                            } else if(error){
                                if(callback){
                                    callback('Error connection to ' + self.configModel.serviceURL);
                                }
                            } else {
                                //console.log(body);
                                fs.writeFile(path, body, {encoding: null}, function(err){
                                    if(err){
                                        if(callback){
                                            callback(err);
                                        }
                                    } else {
                                        self.download(optionArray, callback, isAuth, ++index);
                                    }
                                });
                            }
                        }
                    )
                } catch(e){
                    if(callback){
                        callback('Error: ' + e.message);
                    }
                }
            }, 0);
        } else {
            if(callback){
                callback();
            }
        }
    }

};

module.exports = Client;
