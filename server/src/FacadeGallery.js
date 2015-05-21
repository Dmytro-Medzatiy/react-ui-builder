'use strict';

var path = require('path');

var StorageManager = require('./StorageManager.js');
var Client = require('./Client.js');


var FacadeGallery = {

    preparePreview: function(options, callback){
        StorageManager.cleanDir(
            [
                {dirPath: options.storageDir}
            ],
            function (err) {
                if (err) {
                    callback(err);
                } else {
                    var destFilePath = path.join(options.storageDir, 'builder.tar.gz');
                    Client.download(
                        [
                            {
                                url: '/downloadGalleryFile',
                                destPath: destFilePath,
                                requestBody: {id: options.projectId, packageFileName: 'builder.tar.gz'}
                            }
                        ],
                        function (err) {
                            if (err) {
                                callback(err);
                            } else {
                                var unpackedDirPath = path.join(options.storageDir, '.builder');
                                StorageManager.unpackTarGz(
                                    [
                                        {filePath: destFilePath, destDir: unpackedDirPath}
                                    ],
                                    function (err) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            StorageManager.readObject(
                                                path.join(unpackedDirPath, 'model.json'),
                                                function(err, data){
                                                    if(err){
                                                        callback(err);
                                                    } else {
                                                        callback(null, {
                                                            projectModel: data,
                                                            htmlForDesk: '/.data/.builder/build/PageForDesk.html'
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    },
                                    0
                                );
                            }
                        },
                        false,
                        0
                    );
                }
            },
            0
        );
    },

    downloadProject: function(options, callback){
        StorageManager.checkDirIsEmpty(options.dirPath,
            function(err){
                if(err){
                    callback(err);
                } else {
                    var destFilePath2 = path.join(options.dirPath, 'app.tar.gz');
                    Client.download(
                        [
                            {
                                url: '/downloadGalleryFile',
                                destPath: destFilePath2,
                                requestBody: {id: options.projectId, packageFileName: 'app.tar.gz'}
                            }
                        ],
                        function (err) {
                            if (err) {
                                callback(err);
                            } else {
                                StorageManager.unpackTarGz(
                                    [
                                        {filePath: destFilePath2, destDir: options.dirPath}
                                    ],
                                    function (err) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            StorageManager.removeFiles(
                                                [
                                                    {filePath: destFilePath2}
                                                ],
                                                function (err) {
                                                    if (err) {
                                                        callback(err);
                                                    } else {
                                                        callback();
                                                    }
                                                },
                                                0
                                            );
                                        }
                                    },
                                    0
                                );
                            }
                        },
                        false,
                        0
                    );
                }
            }
        );
    }

};

module.exports = FacadeGallery;


