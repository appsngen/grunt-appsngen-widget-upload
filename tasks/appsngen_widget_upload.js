'use strict';

/////////////////////////////////
// Required
////////////////////////////////
var upload = require('appsngen-widget-upload');
var npmOpen = require('open');
var Promise = require('bluebird').Promise;
var post = Promise.promisify(require('request').post);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/////////////////////////////////
// Task register
////////////////////////////////
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
            .then(function (response) {
                if (response.statusCode === 201) {
                    grunt.log.writeln('Get token success!');
                    return Promise.resolve(response.body.identityToken);
                }else{
                    grunt.log.error(response.body.message);
                    throw ('Unexpected response: ' + response.statusCode);
                }
            })
            .then(function (token) {
                uploadOptions.token = token;
                return upload(uploadOptions);
            })
            .then(function (urn) { // open in browser
                if (gruntOptions.openInBrowserAfterUpload) {
                    npmOpen(gruntOptions.serviceAddress + '/product/marketplace/widgets/config/' + urn);
                }
            })
            .catch(function (error) {
                grunt.log.error(error.toString());
                done(false);
            });
    });
};
