# grunt-appsngen-widget-upload

> AppsNgen task for uploading widgets

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-appsngen-widget-upload
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-appsngen-widget-upload');
```

## The "appsngen_widget_upload" task

### Overview
In your project's Gruntfile, add a section named `appsngen_widget_upload` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  appsngen_widget_upload: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
    appsngen_widget_upload: {
            options: {
                username: 'developer@company.com',
                password: 'your_password',
                serviceAddress: 'https://appsngen.com',
                zipFilePath: 'directory/filename.zip',
                replaceIfExists:true,
                openInBrowserAfterUpload: true
            }
        }
    });
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
