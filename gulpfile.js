'use strict';

// Nastavení
// ---------

var settings = {
  css: {
    source: 'src/less/index.less',
    target: 'dist/css/',
    filename: 'index.css',
    watch: ['src/less/**/*.less'],
  },
  svg: {
    source: 'src/svg/*.svg',
    target: 'dist/svg/'
  }
};

// Uložení pluginů do proměnných
// -----------------------------

// gulp
var gulp = require('gulp');
// plumber - odchycení chybových hlášek
var plumber = require('gulp-plumber');
// sourcemaps - generování map zdrojů
var sourcemaps = require('gulp-sourcemaps');
// BrowserSync - live realod, server, ovládání prohlížeče
var browsersync = require('browser-sync');
// LESS - generování CSS z preprocesoru
var less = require('gulp-less');
// postCSS - postprocessing CSS (minifikace, autoprefixer...)
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var flexbugs = require('postcss-flexbugs-fixes');
var pixrem = require('pixrem');
// zmenseni SVG
var svgmin = require('gulp-svgmin');
// prejmenovani souboru
var rename = require('gulp-rename');

// postCSS pluginy a nastavení
var postcssPlugins = [
    flexbugs(),
    pixrem(),
    autoprefixer( { browsers: [ 'last 5 versions', 'ie >= 9', 'ios >= 7', 'android >= 4.4' ] }),
    // cssnano()
];

// výpis chybových hlášek
var onError = function (err) {
  console.log(err);
  this.emit('end');
};


// Jednotlivé tasky
// ----------------

// BrowserSync
gulp.task('browser-sync', function() {
  browsersync({
    server: './'
  });
});

// BrowserSync live-reload
gulp.task('browsersync-reload', function () {
    browsersync.reload();
});

// SASS kompilace
gulp.task('less', function() {
  return gulp.src(settings.css.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(settings.css.target))
    .pipe(browsersync.reload({ stream: true }));
});

// SVG optimalizace
gulp.task('svg', function () {
  return gulp.src(settings.svg.source)
    .pipe(svgmin({
        // zachovej odsazeni
        js2svg: {
          pretty: true
        },
        plugins: [
          // nespojuj <path> dohromady
          {
            mergePaths: false
          }
        ]
      }))
    .pipe(gulp.dest(settings.svg.target));
});

// Watch - sledování změn souborů
gulp.task('watch', ['browser-sync'], function () {
  gulp.watch(settings.css.watch, ['less']);
});


// Aliasy tasků
// ------------

gulp.task('default', ['watch']);
