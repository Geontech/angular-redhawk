import { paramCase, pascalCase } from 'change-case';
import { readFileSync, appendFileSync } from 'fs';
import sourcemaps from 'rollup-plugin-sourcemaps';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const moduleId = paramCase(pkg.name);
const moduleName = pascalCase(pkg.name);

// appendFileSync(`./typings/index.d.ts`, `export as namespace ${moduleName};\n`);

export default {
  entry: `dist/index.js`,
  context: 'this',
  sourceMap: (process.env.NODE_ENV === 'test') ? 'inline' : true,
  moduleId,
  moduleName,
  plugins: [
    sourcemaps({
      exclude: 'src/**'
    })
  ],
  targets: [
    { dest: `dist/bundles/${moduleId}.umd.js`, format: 'umd' },
    { dest: `dist/bundles/${moduleId}.mjs`, format: 'es' },
  ],
  globals: {
    '@angular/core': '_angular_core',
    '@angular/common': '_angular_common',
    '@angular/http': '_angular_http',
    'rxjs/Observable': '_rxjs_Observable',
    'rxjs/Subject': '_rxjs_Subject',
    'rxjs/add/operator/map': '_rxjs_add_operator_map',
    'rxjs/add/operator/catch': '_rxjs_add_operator_catch'
  },
  external: [
    '@angular/core',
    '@angular/common',
    '@angular/http',
    'rxjs/add/operator/map',
    'rxjs/add/operator/catch',
    'rxjs/Observable',
    'rxjs/Subject'
  ]
};
