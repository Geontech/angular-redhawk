# angular-redhawk
AngularJS-based client framework for developing rest-python -backed UIs for REDHAWK SDR

The original inspiration and some of the code-base came from the REDHAWK SDR [admin-console](http://github.com/redhawksdr/admin-console).  It was scaled back to a generic framework, included into Geon's fork of [rest-python](http://github.com/geontech/rest-python/) as `client`, and then heavily modified to match the ongoing development of new interfaces and features.

## Installation

For CentOS 6 installations with the EPEL repository, as would be required to install REDHAWK SDR, you can install `npm` and `bower` as follows (as root):

    yum install -y nodejs npm --enablerepo=epel

Include angular-redhawk in your web app's bower.json as a dependency as shown in the various provided examples:

    "dependencies": {
        "angular-redhawk" : "https://github.com/geontech/angular-redhawk.git"
    }

Then from your web app's directory, use `bower install` to download the module to your `bower_components` directory.  If prompted to resolve a dependency issue, err on the side of angular-redhawk (even though we actually package all of its dependencies into a minified JS for you).

Next, in your top-level HTML file, include the following, as appropriate:

    bower_components/angular-redhawk/dist/angular-redhawk.min.js
    bower_components/angular-redhawk/dist/vendor.js
    bower_components/angular-redhawk/dist/vendor.css

See the `angular-redhawk/examples` for some ideas on how to interact with the client services.

## Updating the Distribution

Should you need to update dependencies for Angular-REDHAWK, clone or copy the repository locally.  Modify the dependencies as appropriate in `bower.json` and `Gruntfile.js`.  Then use `npm`, `bower`, and `grunt` to rebuild the `dist/` files.

    npm install
    bower install
    grunt

This should rebuild the `angular-redhawk(.min).js`, `vendor.js`, and `vendor.css` packages.

> NOTE: This process is only required if your `angular-redhawk` has been modified to have newer/different dependencies or if you have modified `angular-redhawk` itself (added directives, etc.). If your web app has dependencies, modify its own `bower.json` instead and include the necessary files in your HTML.

## Adding Functionality

Modifying any of the `js` or `html` files under `src/` requires that you run `grunt` to repackage the distribution files.  

Should you need to define a new AngularJS module and then extend it in additional files, define the module in a `def.js` file.  The `Gruntfile.js` is written to concatenate `def.js` first, and then the remaining scripts to resolve dependency issues while still allowing for a clean directory structure.
