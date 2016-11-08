const gulp = require('gulp');
const typescript = require('gulp-typescript');
const inlineNg2 = require('gulp-inline-ng2-template');
const sourcemaps = require('gulp-sourcemaps');

// Using the installed verison of typescript (2.x).
var tscConfig = require('./tsconfig.json');
tscConfig.compilerOptions.typescript = require('typescript');

const allSrcTs = 'src/**/*.ts';
const outDir = tscConfig.compilerOptions.outDir;

// Had to split these up since gulp was flattening the output.

// TypeScript compile index
gulp.task('index', function () {
  return gulp.src('index.ts')
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outDir));
});

// Same for the rest of the framework.
gulp.task('compile', function () {
  return gulp.src(allSrcTs)
    .pipe(inlineNg2({useRelativePaths: true, indent: 0, removeLineBreaks: true}))
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outDir+'/src'));
});

gulp.task('default', ['compile', 'index']);