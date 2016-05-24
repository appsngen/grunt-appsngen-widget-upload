'use strict';

/////////////////////////////////
// Required
////////////////////////////////
var request = require('request');
var fs = require('fs');
var waterfall = require('async-waterfall');
var npmOpen = require('open');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/////////////////////////////////
// Task register
////////////////////////////////
module.exports = function (grunt) {
    grunt.registerTask('appsngen_widget_upload', 'AppsNgen task for uploading widgets', function () {

        this.async();
        var gruntOptions = this.options();

        // variables block
        var username = gruntOptions.username;
        var password = gruntOptions.password;
        var serviceAddress = gruntOptions.serviceAddress;
        var zipFilePath = gruntOptions.zipFilePath;
        var replaceIfExists = gruntOptions.replaceIfExists;
        var openInBrowserAfterUpload = gruntOptions.openInBrowserAfterUpload;

        var credentials = username + ':' + password;

        // Processing block
        waterfall([
            function (callback) { //token request
                var options = {};

                request.post(
                    serviceAddress + '/rest-services/tokens/identity',
                    {
                        body: {
                            scope: {}
                        },
                        json: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic: ' + new Buffer(credentials).toString('base64')
                        }
                    },
                    function (error, response, body) {
                        if (error) {
                            throw error;
                        }
                        if (!error && response.statusCode === 201) {
                            console.log('Get token success!');
                            options.token = body.identityToken;
                            callback(null, options);
                        }else{
                            console.log(body);
                            throw ('Unexpected response: ' + response.statusCode);
                        }
                    }
                );
            },
            function (options, callback) { // read zip file
                fs.readFile(zipFilePath, 'binary', function (err, data) {
                    if (err) {
                        throw err;
                    }
                    options.zipFile = new Buffer(data, 'binary');
                    console.log('File read success!');
                    callback(null, options);
                });
            },
            function (options, callback) { //upload
                request.post(
                    serviceAddress + '/viewer/widgets',
                    {
                        body: options.zipFile,
                        headers: {
                            'Content-Type': 'application/zip',
                            'Authorization': 'Bearer ' + options.token
                        }
                    },
                    function (error, response, body) {
                        if (error) {
                            throw error;
                        }
                        else {
                            console.log(body);
                            options.statusCode = response.statusCode;
                            options.urn = JSON.parse(response.body).urn;
                            callback(null, options);
                        }
                    }
                );
            },
            function (options, callback) { //update if already exists
                if (options.statusCode === 409) {
                    if (!replaceIfExists) {
                        console.log('To replace existing widget, set replaceIfExists option to \'true\'');
                        return;
                    }
                    console.log('Post upload conflict, trying to update existing widget...');
                    request.put(
                        serviceAddress + '/viewer/widgets',
                        {
                            body: options.zipFile,
                            headers: {
                                'Content-Type': 'application/zip',
                                'Authorization': 'Bearer ' + options.token
                            }
                        },
                        function (error, response) {
                            if (error) {
                                throw error;
                            }
                            else {
                                console.log(response.body);
                                console.log('Upload success!');
                                options.urn = JSON.parse(response.body).urn;
                                callback(null, options);
                            }
                        }
                    );
                } else {
                    console.log('Upload success!');
                    callback(null, options);
                }
            },
            function (options) { // open in browser
                if (openInBrowserAfterUpload) {
                    npmOpen(serviceAddress + '/product/marketplace/widgets/config/' + options.urn);
                }
            }]);
    });
};