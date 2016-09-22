# Angular 2 Test App

This app stands up the AngularRedhawk module and uses the Support components to query the rest server and fetch models.

## Getting Started

Ensure you have the latest `npm` installed along with gulp.

```
sudo npm update -g
sudo npm install -g gulp
```

Next, run `npm install` on this project.  If for some reason there is no `typings` folder, run `npm run typings install`.

Then run `gulp` to compile the TS into JS and MAP files that will appear in the `dist/app` directory (thanks to `tsconfig.json`).  

Finally, load the `index.html` in a browser.   The call to `systemjs` will invoke the configuration provided by `systemjs.config.js` which points the app into the `dist` folder where we built.

## Development

If you are wanting to run against a development version of angular-redhawk, you need clone the repository and link to it using `npm link`.

```
git clone -b angular2 ssh://rackstation:30001/geon/angular-redhawk
cd angular-redhawk
npm link # may need to sudo
cd <Your app's root directory>
npm link angular-redhawk
```


