'use strict';

var upload = require('appsngen-widget-upload');
var npmOpen = require('open');
var Promise = require('bluebird').Promise;
var post = Promise.promisify(require('request').post);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports = function (grunt) {
    grunt.registerTask('appsngen_widget_upload', 'AppsNgen task for uploading widgets', function () {
        var done = this.async();
        var gruntOptions = this.options();
        var credentials = gruntOptions.username + ':' + gruntOptions.password;
        var uploadOptions = {
            replaceIfExists: gruntOptions.replaceIfExists,
            serviceAddress: gruntOptions.serviceAddress,
            zipFilePath: gruntOptions.zipFilePath
        };

        // Processing block
        post(gruntOptions.serviceAddress + '/rest-services/tokens/identity', {
                body: {
                    scope: {}
                },
                json: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic: ' + new Buffer(credentials).toString('base64')
                }
            })
            .then(function getIdentityToken(response) {
                if (response.statusCode === 201) {
                    grunt.log.writeln('Get token success!');
                    return Promise.resolve(response.body.identityToken);
                } else {
                    grunt.log.error(response.body.message);
                    throw ('Unexpected response: ' + response.statusCode);
                }
            })
            .then(function uploadWidget(token) {
                uploadOptions.token = token;
                return upload(uploadOptions);
            })
            .then(function openWidgetInBrowser(urn) { // open in browser
                grunt.log.writeln('Upload complete.');
                done();
                if (gruntOptions.openInBrowserAfterUpload) {
                    npmOpen(gruntOptions.serviceAddress + '/product/widgets/' + urn + '/config');
                }
            })
            .catch(function (error) {
                grunt.log.error(error.toString());
                done(false);
            });
    });
};
