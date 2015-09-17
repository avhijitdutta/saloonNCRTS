angular.module('ngCordova', [
  'ngCordova.plugins'
]);


angular.module('ngCordova.plugins', [
    'ngCordova.plugins.facebook',
    'ngCordova.plugins.appRate',
    'ngCordova.plugins.camera',
    'ngCordova.plugins.file',
    'ngCordova.plugins.fileTransfer',
    'ngCordova.plugins.splashscreen',
    'ngCordova.plugins.geolocation',
    'ngCordova.plugins.socialSharing',
    'ngCordova.plugins.statusbar'
]);
//#### Begin Individual Plugin Code ####

// install   :   cordova -d plugin add /Users/your/path/here/phonegap-facebook-plugin --variable APP_ID="123456789" --variable APP_NAME="myApplication"
// link      :   https://github.com/Wizcorp/phonegap-facebook-plugin

angular.module('ngCordova.plugins.facebook', [])

  .provider('$cordovaFacebook', [function () {

    this.browserInit = function (id, version) {
      this.appID = id;
      this.appVersion = version || "v2.0";
      facebookConnectPlugin.browserInit(this.appID, this.appVersion);
    };

    this.$get = ['$q', function ($q) {
      return {
        login: function (permissions) {
          var q = $q.defer();
          facebookConnectPlugin.login(permissions, function (res) {
            q.resolve(res);
          }, function (res) {
            q.reject(res);
          });

          return q.promise;
        },

        showDialog: function (options) {
          var q = $q.defer();
          facebookConnectPlugin.showDialog(options, function (res) {
            q.resolve(res);
          }, function (err) {
            q.reject(err);
          });
          return q.promise;
        },

        api: function (path, permissions) {
          var q = $q.defer();
          facebookConnectPlugin.api(path, permissions, function (res) {
            q.resolve(res);
          }, function (err) {
            q.reject(err);
          });
          return q.promise;
        },

        getAccessToken: function () {
          var q = $q.defer();
          facebookConnectPlugin.getAccessToken(function (res) {
            q.resolve(res);
          }, function (err) {
            q.reject(err);
          });
          return q.promise;
        },

        getLoginStatus: function () {
          var q = $q.defer();
          facebookConnectPlugin.getLoginStatus(function (res) {
            q.resolve(res);
          }, function (err) {
            q.reject(err);
          });
          return q.promise;
        },

        logout: function () {
          var q = $q.defer();
          facebookConnectPlugin.logout(function (res) {
            q.resolve(res);
          }, function (err) {
            q.reject(err);
          });
          return q.promise;
        }
      };
    }];
  }]);

//#### Begin Individual Plugin Code ####

// install  :     cordova plugin add https://github.com/pushandplay/cordova-plugin-apprate.git
// link     :     https://github.com/pushandplay/cordova-plugin-apprate

angular.module('ngCordova.plugins.appRate', [])

    .provider("$cordovaAppRate", [function () {


        this.setPreferences = function (defaults) {
            if (!defaults || !angular.isObject(defaults)) {
                return;
            }

            AppRate.preferences.useLanguage = defaults.language || null;
            AppRate.preferences.displayAppName = defaults.appName || "";
            AppRate.preferences.promptAgainForEachNewVersion = defaults.promptForNewVersion || true;
            AppRate.preferences.openStoreInApp = defaults.openStoreInApp || false;
            AppRate.preferences.usesUntilPrompt = defaults.usesUntilPrompt || 3;
            AppRate.preferences.useCustomRateDialog = defaults.useCustomRateDialog || false;
            AppRate.preferences.storeAppURL.ios = defaults.iosURL || null;
            AppRate.preferences.storeAppURL.android = defaults.androidURL || null;
            AppRate.preferences.storeAppURL.blackberry = defaults.blackberryURL || null;
            AppRate.preferences.storeAppURL.windows8 = defaults.windowsURL || null;
        };


        this.setCustomLocale = function (customObj) {
            var strings = {
                title: 'Rate %@',
                message: 'If you enjoy using %@, would you mind taking a moment to rate it? It won’t take more than a minute. Thanks for your support!',
                cancelButtonLabel: 'No, Thanks',
                laterButtonLabel: 'Remind Me Later',
                rateButtonLabel: 'Rate It Now'
            };

            strings = angular.extend(strings, customObj);

            AppRate.preferences.customLocale = strings;
        };

        this.$get = ['$q', function ($q) {
            return {
                promptForRating: function (immediate) {
                    var q = $q.defer();
                    var prompt = AppRate.promptForRating(immediate);
                    q.resolve(prompt);

                    return q.promise;
                },

                navigateToAppStore: function () {
                    var q = $q.defer();
                    var navigate = AppRate.navigateToAppStore();
                    q.resolve(navigate);

                    return q.promise;
                },

                onButtonClicked: function (cb) {
                    AppRate.onButtonClicked = function (buttonIndex) {
                        cb.call(this, buttonIndex);
                    };
                },

                onRateDialogShow: function (cb) {
                    AppRate.onRateDialogShow = cb();
                }
            };
        }];
    }]);
// install   :   cordova plugin add org.apache.cordova.camera
// link      :   https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md#orgapachecordovacamera

angular.module('ngCordova.plugins.camera', [])

    .factory('$cordovaCamera', ['$q', function ($q) {

        return {
            getPicture: function (options) {
                var q = $q.defer();

                if (!navigator.camera) {
                    q.resolve(null);
                    return q.promise;
                }

                navigator.camera.getPicture(function (imageData) {
                    q.resolve(imageData);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            },

            cleanup: function () {
                var q = $q.defer();

                navigator.camera.cleanup(function () {
                    q.resolve();
                }, function (err) {
                    q.reject(err);
                });

                return q.promise;
            }
        };
    }]);
// install   :     cordova plugin add org.apache.cordova.file
// link      :     https://github.com/apache/cordova-plugin-file/blob/master/doc/index.md

angular.module('ngCordova.plugins.file', [])

    .constant("$cordovaFileError", {
        1: 'NOT_FOUND_ERR',
        2: 'SECURITY_ERR',
        3: 'ABORT_ERR',
        4: 'NOT_READABLE_ERR',
        5: 'ENCODING_ERR',
        6: 'NO_MODIFICATION_ALLOWED_ERR',
        7: 'INVALID_STATE_ERR',
        8: 'SYNTAX_ERR',
        9: 'INVALID_MODIFICATION_ERR',
        10: 'QUOTA_EXCEEDED_ERR',
        11: 'TYPE_MISMATCH_ERR',
        12: 'PATH_EXISTS_ERR'
    })

    .provider('$cordovaFile', [function () {

        this.$get = ['$q', '$window', '$cordovaFileError', function ($q, $window, $cordovaFileError) {

            return {

                getFreeDiskSpace: function() {
                    var q = $q.defer();
                    cordova.exec(function(result) {
                        q.resolve(result);
                    }, function(error) {
                        q.reject(error);
                    }, "File", "getFreeDiskSpace", []);
                    return q.promise;
                },

                checkDir: function (path, dir) {
                    var q = $q.defer();

                    if ((/^\//.test(dir))) {
                        q.reject("directory cannot start with \/")
                    }

                    try {
                        var directory = path + dir;
                        $window.resolveLocalFileSystemURL(directory, function (fileSystem) {
                            if (fileSystem.isDirectory === true) {
                                q.resolve(fileSystem);
                            } else {
                                q.reject({code: 13, message: "input is not a directory"});
                            }
                        }, function (error) {
                            error.message = $cordovaFileError[error.code];
                            q.reject(error);
                        });
                    } catch (err) {
                        err.message = $cordovaFileError[err.code];
                        q.reject(err);
                    }

                    return q.promise;
                },


                checkFile: function (path, file) {
                    var q = $q.defer();

                    if ((/^\//.test(file))) {
                        q.reject("directory cannot start with \/")
                    }

                    try {
                        var directory = path + file;
                        $window.resolveLocalFileSystemURL(directory, function (fileSystem) {
                            if (fileSystem.isFile === true) {
                                q.resolve(fileSystem);
                            } else {
                                q.reject({code: 13, message: "input is not a file"});
                            }
                        }, function (error) {
                            error.message = $cordovaFileError[error.code];
                            q.reject(error);
                        });
                    } catch (err) {
                        err.message = $cordovaFileError[err.code];
                        q.reject(err);
                    }

                    return q.promise;
                },

                createDir: function (path, dirName, replaceBool) {
                    var q = $q.defer();

                    if ((/^\//.test(dirName))) {
                        q.reject("directory cannot start with \/")
                    }

                    replaceBool = replaceBool ? false : true;

                    var options = {
                        create: true,
                        exclusive: replaceBool
                    };

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getDirectory(dirName, options, function (result) {
                                q.resolve(result);
                            }, function (error) {
                                error.message = $cordovaFileError[error.code];
                                q.reject(error);
                            });
                        }, function (err) {
                            err.message = $cordovaFileError[err.code];
                            q.reject(err);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }

                    return q.promise;
                },

                createFile: function (path, fileName, replaceBool) {
                    var q = $q.defer();

                    if ((/^\//.test(fileName))) {
                        q.reject("file-name cannot start with \/")
                    }

                    replaceBool = replaceBool ? false : true;

                    var options = {
                        create: true,
                        exclusive: replaceBool
                    };

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getFile(fileName, options, function (result) {
                                q.resolve(result);
                            }, function (error) {
                                error.message = $cordovaFileError[error.code];
                                q.reject(error);
                            });
                        }, function (err) {
                            err.message = $cordovaFileError[err.code];
                            q.reject(err);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }
                    return q.promise;
                },


                removeDir: function (path, dirName) {
                    var q = $q.defer();

                    if ((/^\//.test(dirName))) {
                        q.reject("file-name cannot start with \/")
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getDirectory(dirName, {create: false}, function (dirEntry) {
                                dirEntry.remove(function () {
                                    q.resolve({success: true, fileRemoved: dirEntry});
                                }, function (error) {
                                    error.message = $cordovaFileError[error.code];
                                    q.reject(error);
                                });
                            }, function (err) {
                                err.message = $cordovaFileError[err.code];
                                q.reject(err);
                            });
                        }, function (er) {
                            er.message = $cordovaFileError[er.code];
                            q.reject(er);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }
                    return q.promise;
                },

                removeFile: function (path, fileName) {
                    var q = $q.defer();

                    if ((/^\//.test(fileName))) {
                        q.reject("file-name cannot start with \/");
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getFile(fileName, {create: false}, function (fileEntry) {
                                fileEntry.remove(function () {
                                    q.resolve({success: true, fileRemoved: fileEntry});
                                }, function (error) {
                                    error.message = $cordovaFileError[error.code];
                                    q.reject(error);
                                });
                            }, function (err) {
                                err.message = $cordovaFileError[err.code];
                                q.reject(err);
                            });
                        }, function (er) {
                            er.message = $cordovaFileError[er.code];
                            q.reject(er);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }
                    return q.promise;
                },

                removeRecursively: function (path, dirName) {
                    var q = $q.defer();

                    if ((/^\//.test(dirName))) {
                        q.reject("file-name cannot start with \/")
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getDirectory(dirName, {create: false}, function (dirEntry) {
                                dirEntry.removeRecursively(function () {
                                    q.resolve({success: true, fileRemoved: dirEntry});
                                }, function (error) {
                                    error.message = $cordovaFileError[error.code];
                                    q.reject(error);
                                });
                            }, function (err) {
                                err.message = $cordovaFileError[err.code];
                                q.reject(err);
                            });
                        }, function (er) {
                            er.message = $cordovaFileError[er.code];
                            q.reject(er);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }
                    return q.promise;
                },

                writeFile: function (path, fileName, text, replaceBool) {
                    var q = $q.defer();

                    if ((/^\//.test(fileName))) {
                        q.reject("file-name cannot start with \/");
                    }

                    replaceBool = replaceBool ? false : true;

                    var options = {
                        create: true,
                        exclusive: replaceBool
                    };

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getFile(fileName, options, function (fileEntry) {
                                fileEntry.createWriter(function (writer) {
                                    if (options.append === true) {
                                        writer.seek(writer.length);
                                    }

                                    if (options.truncate) {
                                        writer.truncate(options.truncate);
                                    }

                                    writer.onwriteend = function (evt) {
                                        if (this.error) {
                                            q.reject(this.error);
                                        }
                                        else {
                                            q.resolve(evt);
                                        }
                                    };

                                    writer.write(text);

                                    q.promise.abort = function () {
                                        writer.abort();
                                    };
                                });
                            }, function (error) {
                                error.message = $cordovaFileError[error.code];
                                q.reject(error);
                            });
                        }, function (err) {
                            err.message = $cordovaFileError[err.code];
                            q.reject(err);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }

                    return q.promise;
                },


                writeExistingFile: function (path, fileName, text) {
                    var q = $q.defer();

                    if ((/^\//.test(fileName))) {
                        q.reject("file-name cannot start with \/");
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getFile(fileName, {create: false}, function (fileEntry) {
                                fileEntry.createWriter(function (writer) {
                                    writer.seek(writer.length);

                                    writer.onwriteend = function (evt) {
                                        if (this.error) {
                                            q.reject(this.error);
                                        }
                                        else {
                                            q.resolve(evt);
                                        }
                                    };

                                    writer.write(text);

                                    q.promise.abort = function () {
                                        writer.abort();
                                    };
                                });
                            }, function (error) {
                                error.message = $cordovaFileError[error.code];
                                q.reject(error);
                            });
                        }, function (err) {
                            err.message = $cordovaFileError[err.code];
                            q.reject(err);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }

                    return q.promise;
                },


                readAsText: function (path, file) {
                    var q = $q.defer();

                    if ((/^\//.test(file))) {
                        q.reject("file-name cannot start with \/");
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getFile(file, {create: false}, function (fileEntry) {
                                fileEntry.file(function (fileData) {
                                    var reader = new FileReader();

                                    reader.onloadend = function (evt) {
                                        if (evt.target._result !== undefined || evt.target._result !== null) {
                                            q.resolve(evt.target._result);
                                        }
                                        else if (evt.target._error !== undefined || evt.target._error !== null) {
                                            q.reject(evt.target._error);
                                        }
                                        else {
                                            q.reject({code: null, message: 'READER_ONLOADEND_ERR'});
                                        }
                                    };

                                    reader.readAsText(fileData);
                                });
                            }, function (error) {
                                error.message = $cordovaFileError[error.code];
                                q.reject(error);
                            });
                        }, function (err) {
                            err.message = $cordovaFileError[err.code];
                            q.reject(err);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }

                    return q.promise;
                },


                readAsDataURL: function (path, file) {
                    var q = $q.defer();

                    if ((/^\//.test(file))) {
                        q.reject("file-name cannot start with \/");
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getFile(file, {create: false}, function (fileEntry) {
                                fileEntry.file(function (fileData) {
                                    var reader = new FileReader();
                                    reader.onloadend = function (evt) {
                                        if (evt.target._result !== undefined || evt.target._result !== null) {
                                            q.resolve(evt.target._result);
                                        }
                                        else if (evt.target._error !== undefined || evt.target._error !== null) {
                                            q.reject(evt.target._error);
                                        }
                                        else {
                                            q.reject({code: null, message: 'READER_ONLOADEND_ERR'});
                                        }
                                    };
                                    reader.readAsDataURL(fileData);
                                });
                            }, function (error) {
                                error.message = $cordovaFileError[error.code];
                                q.reject(error);
                            });
                        }, function (err) {
                            err.message = $cordovaFileError[err.code];
                            q.reject(err);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }

                    return q.promise;
                },

                readAsBinaryString: function (path, file) {
                    var q = $q.defer();

                    if ((/^\//.test(file))) {
                        q.reject("file-name cannot start with \/");
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getFile(file, {create: false}, function (fileEntry) {
                                fileEntry.file(function (fileData) {
                                    var reader = new FileReader();
                                    reader.onloadend = function (evt) {
                                        if (evt.target._result !== undefined || evt.target._result !== null) {
                                            q.resolve(evt.target._result);
                                        }
                                        else if (evt.target._error !== undefined || evt.target._error !== null) {
                                            q.reject(evt.target._error);
                                        }
                                        else {
                                            q.reject({code: null, message: 'READER_ONLOADEND_ERR'});
                                        }
                                    };
                                    reader.readAsBinaryString(fileData);
                                });
                            }, function (error) {
                                error.message = $cordovaFileError[error.code];
                                q.reject(error);
                            });
                        }, function (err) {
                            err.message = $cordovaFileError[err.code];
                            q.reject(err);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }

                    return q.promise;
                },

                readAsArrayBuffer: function (path, file) {
                    var q = $q.defer();

                    if ((/^\//.test(file))) {
                        q.reject("file-name cannot start with \/");
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getFile(file, {create: false}, function (fileEntry) {
                                fileEntry.file(function (fileData) {
                                    var reader = new FileReader();
                                    reader.onloadend = function (evt) {
                                        if (evt.target._result !== undefined || evt.target._result !== null) {
                                            q.resolve(evt.target._result);
                                        }
                                        else if (evt.target._error !== undefined || evt.target._error !== null) {
                                            q.reject(evt.target._error);
                                        }
                                        else {
                                            q.reject({code: null, message: 'READER_ONLOADEND_ERR'});
                                        }
                                    };
                                    reader.readAsArrayBuffer(fileData);
                                });
                            }, function (error) {
                                error.message = $cordovaFileError[error.code];
                                q.reject(error);
                            });
                        }, function (err) {
                            err.message = $cordovaFileError[err.code];
                            q.reject(err);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }

                    return q.promise;
                },


                moveFile: function (path, fileName, newPath, newFileName) {
                    var q = $q.defer();

                    newFileName = newFileName || fileName;

                    if ((/^\//.test(fileName)) || (/^\//.test(newFileName))) {
                        q.reject("file-name cannot start with \/");
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getFile(fileName, {create: false}, function (fileEntry) {
                                $window.resolveLocalFileSystemURL(newPath, function (newFileEntry) {
                                    fileEntry.moveTo(newFileEntry, newFileName, function (result) {
                                        q.resolve(result);
                                    }, function (error) {
                                        q.reject(error);
                                    });
                                }, function (err) {
                                    q.reject(err);
                                });
                            }, function (err) {
                                q.reject(err);
                            });
                        }, function (er) {
                            q.reject(er);
                        });
                    } catch (e) {
                        q.reject(e);
                    }
                    return q.promise;
                },

                moveDir: function (path, dirName, newPath, newDirName) {
                    var q = $q.defer();

                    newDirName = newDirName || dirName;

                    if (/^\//.test(dirName) || (/^\//.test(newDirName))) {
                        q.reject("file-name cannot start with \/");
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getDirectory(dirName, {create: false}, function (dirEntry) {
                                $window.resolveLocalFileSystemURL(newPath, function (newDirEntry) {
                                    dirEntry.moveTo(newDirEntry, newDirName, function (result) {
                                        q.resolve(result);
                                    }, function (error) {
                                        q.reject(error);
                                    });
                                }, function (erro) {
                                    q.reject(erro);
                                });
                            }, function (err) {
                                q.reject(err);
                            });
                        }, function (er) {
                            q.reject(er);
                        });
                    } catch (e) {
                        q.reject(e);
                    }
                    return q.promise;
                },


                copyDir: function (path, dirName, newPath, newDirName) {
                    var q = $q.defer();

                    newDirName = newDirName || dirName;

                    if (/^\//.test(dirName) || (/^\//.test(newDirName))) {
                        q.reject("file-name cannot start with \/");
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getDirectory(dirName, {create: false, exclusive: false}, function (dirEntry) {

                                $window.resolveLocalFileSystemURL(newPath, function (newDirEntry) {
                                    dirEntry.copyTo(newDirEntry, newDirName, function (result) {
                                        q.resolve(result);
                                    }, function (error) {
                                        error.message = $cordovaFileError[error.code];
                                        q.reject(error);
                                    });
                                }, function (erro) {
                                    erro.message = $cordovaFileError[erro.code];
                                    q.reject(erro);
                                });
                            }, function (err) {
                                err.message = $cordovaFileError[err.code];
                                q.reject(err);
                            });
                        }, function (er) {
                            er.message = $cordovaFileError[er.code];
                            q.reject(er);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }
                    return q.promise;
                },

                copyFile: function (path, fileName, newPath, newFileName) {
                    var q = $q.defer();

                    newFileName = newFileName || fileName;

                    if ((/^\//.test(fileName))) {
                        q.reject("file-name cannot start with \/");
                    }

                    try {
                        $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                            fileSystem.getFile(fileName, {create: false, exclusive: false}, function (fileEntry) {

                                $window.resolveLocalFileSystemURL(newPath, function (newFileEntry) {
                                    fileEntry.copyTo(newFileEntry, newFileName, function (result) {
                                        q.resolve(result);
                                    }, function (error) {
                                        error.message = $cordovaFileError[error.code];
                                        q.reject(error);
                                    });
                                }, function (erro) {
                                    erro.message = $cordovaFileError[erro.code];
                                    q.reject(erro);
                                });
                            }, function (err) {
                                err.message = $cordovaFileError[err.code];
                                q.reject(err);
                            });
                        }, function (er) {
                            er.message = $cordovaFileError[er.code];
                            q.reject(er);
                        });
                    } catch (e) {
                        e.message = $cordovaFileError[e.code];
                        q.reject(e);
                    }
                    return q.promise;
                }

                /*
                 listFiles: function (path, dir) {

                 },

                 listDir: function (path, dirName) {
                 var q = $q.defer();

                 try {
                 $window.resolveLocalFileSystemURL(path, function (fileSystem) {
                 fileSystem.getDirectory(dirName, options, function (parent) {
                 var reader = parent.createReader();
                 reader.readEntries(function (entries) {
                 q.resolve(entries);
                 }, function () {
                 q.reject('DIR_READ_ERROR : ' + path + dirName);
                 });
                 }, function (error) {
                 error.message = $cordovaFileError[error.code];
                 q.reject(error);
                 });
                 }, function (err) {
                 err.message = $cordovaFileError[err.code];
                 q.reject(err);
                 });
                 } catch (e) {
                 e.message = $cordovaFileError[e.code];
                 q.reject(e);
                 }

                 return q.promise;
                 },

                 readFileMetadata: function (filePath) {
                 //return getFile(filePath, {create: false});
                 }
                 */
            };

        }];
    }]);
// install   :     cordova plugin add org.apache.cordova.file-transfer
// link      :     https://github.com/apache/cordova-plugin-file-transfer/blob/master/doc/index.md

angular.module('ngCordova.plugins.fileTransfer', [])

    .factory('$cordovaFileTransfer', ['$q', '$timeout', function ($q, $timeout) {
        return {
            download: function (source, filePath, options, trustAllHosts) {
                var q = $q.defer();
                var ft = new FileTransfer();
                var uri = (options && options.encodeURI === false) ? source : encodeURI(source);

                if (options && options.timeout !== undefined && options.timeout !== null) {
                    $timeout(function () {
                        ft.abort();
                    }, options.timeout);
                    options.timeout = null;
                }

                ft.onprogress = function (progress) {
                    q.notify(progress);
                };

                q.promise.abort = function () {
                    ft.abort();
                };

                ft.download(uri, filePath, q.resolve, q.reject, trustAllHosts, options);
                return q.promise;
            },

            upload: function (server, filePath, options, trustAllHosts) {
                var q = $q.defer();
                var ft = new FileTransfer();
                var uri = (options && options.encodeURI === false) ? server : encodeURI(server);

                if (options && options.timeout !== undefined && options.timeout !== null) {
                    $timeout(function () {
                        ft.abort();
                    }, options.timeout);
                    options.timeout = null;
                }

                ft.onprogress = function (progress) {
                    q.notify(progress);
                };

                q.promise.abort = function () {
                    ft.abort();
                };

                ft.upload(filePath, uri, q.resolve, q.reject, options, trustAllHosts);
                return q.promise;
            }
        };
    }]);
// install   :      cordova plugin add org.apache.cordova.splashscreen
// link      :      https://github.com/apache/cordova-plugin-splashscreen/blob/master/doc/index.md

angular.module('ngCordova.plugins.splashscreen', [])

    .factory('$cordovaSplashscreen', [function () {

        return {
            hide: function () {
                return navigator.splashscreen.hide();
            },

            show: function () {
                return navigator.splashscreen.show();
            }
        };

    }]);

//#### Begin Individual Plugin Code ####

// install   :     cordova plugin add org.apache.cordova.geolocation
// link      :     https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md

angular.module('ngCordova.plugins.geolocation', [])

    .factory('$cordovaGeolocation', ['$q', function ($q) {

        return {
            getCurrentPosition: function (options) {
                var q = $q.defer();

                navigator.geolocation.getCurrentPosition(function (result) {
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            },

            watchPosition: function (options) {
                var q = $q.defer();

                var watchID = navigator.geolocation.watchPosition(function (result) {
                    q.notify(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                q.promise.cancel = function () {
                    navigator.geolocation.clearWatch(watchID);
                };

                q.promise.clearWatch = function (id) {
                    navigator.geolocation.clearWatch(id || watchID);
                };

                q.promise.watchID = watchID;

                return q.promise;
            },

            clearWatch: function (watchID) {
                return navigator.geolocation.clearWatch(watchID);
            }
        };
    }]);
//#### Begin Individual Plugin Code ####

// install   :     cordova plugin add org.apache.cordova.geolocation
// link      :     https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md

angular.module('ngCordova.plugins.geolocation', [])

    .factory('$cordovaGeolocation', ['$q', function ($q) {

        return {
            getCurrentPosition: function (options) {
                var q = $q.defer();

                navigator.geolocation.getCurrentPosition(function (result) {
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            },

            watchPosition: function (options) {
                var q = $q.defer();

                var watchID = navigator.geolocation.watchPosition(function (result) {
                    q.notify(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                q.promise.cancel = function () {
                    navigator.geolocation.clearWatch(watchID);
                };

                q.promise.clearWatch = function (id) {
                    navigator.geolocation.clearWatch(id || watchID);
                };

                q.promise.watchID = watchID;

                return q.promise;
            },

            clearWatch: function (watchID) {
                return navigator.geolocation.clearWatch(watchID);
            }
        };
    }]);


//#### Begin Individual Plugin Code ####

// install   :      cordova plugin add https://github.com/phonegap-build/PushPlugin.git
// link      :      https://github.com/phonegap-build/PushPlugin

angular.module('ngCordova.plugins.push', [])

    .factory('$cordovaPush', ['$q', '$window', '$rootScope', '$timeout', function ($q, $window, $rootScope, $timeout) {

        return {
            onNotification: function (notification) {
                $timeout(function () {
                    $rootScope.$broadcast('$cordovaPush:notificationReceived', notification);
                });
            },

            register: function (config) {
                var q = $q.defer();
                var injector;
                if (config !== undefined && config.ecb === undefined) {
                    if (document.querySelector('[ng-app]') === null) {
                        injector = 'document.body';
                    }
                    else {
                        injector = 'document.querySelector(\'[ng-app]\')';
                    }
                    config.ecb = 'angular.element(' + injector + ').injector().get(\'$cordovaPush\').onNotification';
                }

                $window.plugins.pushNotification.register(function (token) {
                    q.resolve(token);
                }, function (error) {
                    q.reject(error);
                }, config);

                return q.promise;
            },

            unregister: function (options) {
                var q = $q.defer();
                $window.plugins.pushNotification.unregister(function (result) {
                    q.resolve(result);
                }, function (error) {
                    q.reject(error);
                }, options);

                return q.promise;
            },

            // iOS only
            setBadgeNumber: function (number) {
                var q = $q.defer();
                $window.plugins.pushNotification.setApplicationIconBadgeNumber(function (result) {
                    q.resolve(result);
                }, function (error) {
                    q.reject(error);
                }, number);
                return q.promise;
            }
        };
    }]);

// install   :      cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
// link      :      https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin

// NOTE: shareViaEmail -> if user cancels sharing email, success is still called
// TODO: add support for iPad

angular.module('ngCordova.plugins.socialSharing', [])

    .factory('$cordovaSocialSharing', ['$q', '$window', function ($q, $window) {

        return {
            share: function (message, subject, file, link) {
                var q = $q.defer();
                subject = subject || null;
                file = file || null;
                link = link || null;
                $window.plugins.socialsharing.share(message, subject, file, link, function () {
                    q.resolve(true);
                }, function () {
                    q.reject(false);
                });
                return q.promise;
            },

            shareViaTwitter: function (message, file, link) {
                var q = $q.defer();
                file = file || null;
                link = link || null;
                $window.plugins.socialsharing.shareViaTwitter(message, file, link, function () {
                    q.resolve(true);
                }, function () {
                    q.reject(false);
                });
                return q.promise;
            },

            shareViaWhatsApp: function (message, file, link) {
                var q = $q.defer();
                file = file || null;
                link = link || null;
                $window.plugins.socialsharing.shareViaWhatsApp(message, file, link, function () {
                    q.resolve(true);
                }, function () {
                    q.reject(false);
                });
                return q.promise;
            },

            shareViaFacebook: function (message, file, link) {
                var q = $q.defer();
                message = message || null;
                file = file || null;
                link = link || null;
                $window.plugins.socialsharing.shareViaFacebook(message, file, link, function () {
                    q.resolve(true);
                }, function () {
                    q.reject(false);
                });
                return q.promise;
            },

            shareViaFacebookWithPasteMessageHint: function (message, file, link, pasteMessageHint) {
                var q = $q.defer();
                file = file || null;
                link = link || null;
                $window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(message, file, link, pasteMessageHint, function () {
                    q.resolve(true);
                }, function () {
                    q.reject(false);
                });
                return q.promise;
            },

            shareViaSMS: function (message, commaSeparatedPhoneNumbers) {
                var q = $q.defer();
                $window.plugins.socialsharing.shareViaSMS(message, commaSeparatedPhoneNumbers, function () {
                    q.resolve(true);
                }, function () {
                    q.reject(false);
                });
                return q.promise;
            },

            shareViaEmail: function (message, subject, toArr, ccArr, bccArr, fileArr) {
                var q = $q.defer();
                toArr = toArr || null;
                ccArr = ccArr || null;
                bccArr = bccArr || null;
                fileArr = fileArr || null;
                $window.plugins.socialsharing.shareViaEmail(message, subject, toArr, ccArr, bccArr, fileArr, function () {
                    q.resolve(true);
                }, function () {
                    q.reject(false);
                });
                return q.promise;
            },

            shareVia: function (via, message, subject, file, link) {
                var q = $q.defer();
                message = message || null;
                subject = subject || null;
                file = file || null;
                link = link || null;
                $window.plugins.socialsharing.shareVia(via, message, subject, file, link, function () {
                    q.resolve(true);
                }, function () {
                    q.reject(false);
                });
                return q.promise;
            },

            canShareViaEmail: function () {
                var q = $q.defer();
                $window.plugins.socialsharing.canShareViaEmail(function () {
                    q.resolve(true);
                }, function () {
                    q.reject(false);
                });
                return q.promise;
            },

            canShareVia: function (via, message, subject, file, link) {
                var q = $q.defer();
                $window.plugins.socialsharing.canShareVia(via, message, subject, file, link, function (success) {
                    q.resolve(success);
                }, function (error) {
                    q.reject(error);
                });
                return q.promise;
            },

            available: function () {
                var q = $q.defer();
                window.plugins.socialsharing.available(function (isAvailable) {
                    if (isAvailable) {
                        q.resolve();
                    }
                    else {
                        q.reject();
                    }
                });
            }
        };
    }]);

    // install   :      cordova plugin add cordova-plugin-statusbar
    // link      :      https://github.com/apache/cordova-plugin-statusbar

    /* globals StatusBar: true */
    angular.module('ngCordova.plugins.statusbar', [])

        .factory('$cordovaStatusbar', [function () {

            return {

                /**
                 * @param {boolean} bool
                 */
                overlaysWebView: function (bool) {
                    return StatusBar.overlaysWebView(!!bool);
                },

                STYLES: {
                    DEFAULT: 0,
                    LIGHT_CONTENT: 1,
                    BLACK_TRANSLUCENT: 2,
                    BLACK_OPAQUE: 3
                },

                /**
                 * @param {number} style
                 */
                style: function (style) {
                    switch (style) {
                        // Default
                        case 0:
                            return StatusBar.styleDefault();

                        // LightContent
                        case 1:
                            return StatusBar.styleLightContent();

                        // BlackTranslucent
                        case 2:
                            return StatusBar.styleBlackTranslucent();

                        // BlackOpaque
                        case 3:
                            return StatusBar.styleBlackOpaque();

                        default:
                            return StatusBar.styleDefault();
                    }
                },

                // supported names:
                // black, darkGray, lightGray, white, gray, red, green,
                // blue, cyan, yellow, magenta, orange, purple, brown
                styleColor: function (color) {
                    return StatusBar.backgroundColorByName(color);
                },

                styleHex: function (colorHex) {
                    return StatusBar.backgroundColorByHexString(colorHex);
                },

                hide: function () {
                    return StatusBar.hide();
                },

                show: function () {
                    return StatusBar.show();
                },

                isVisible: function () {
                    return StatusBar.isVisible;
                }
            };
        }]);
