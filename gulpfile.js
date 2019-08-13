const { src, dest, series, parallel, watch } = require('gulp');
const connect = require('gulp-connect')
const del = require('del');
const minifyCSS = require('gulp-csso');
const minifyJS = require('gulp-minify');
const rollup = require('gulp-rollup');
const typescript = require('gulp-typescript');

const TS_DEST = './out-tsc';
const DEST = '../yurivoronin.github.io/my-radio';

const runServer = () => connect.server({
  root: 'src',
  livereload: true
});

const html = () => src(['src/my-radio/index.html'])
  .pipe(dest(DEST));

const icons = () => src(['src/my-radio/icons/*.png'])
  .pipe(dest(`${DEST}/icons`));

const json = () => src(['src/my-radio/*.json',])
  .pipe(dest(DEST));

const css = () => src('src/my-radio/styles.css')
  .pipe(minifyCSS())
  .pipe(dest(DEST));

const sw = () => src('src/my-radio/sw.js')
  .pipe(minifyJS({ noSource: true, ext: { min: '.js' } }))
  .pipe(dest(`${DEST}`));

const ts = () => src('src/my-radio/**/*.ts')
  .pipe(typescript({
    target: 'es2018',
    module: 'esnext'
  }))
  .pipe(dest(TS_DEST));

const bundleDev = () => src(`${TS_DEST}/**/*.js`)
    .pipe(rollup({
      input: `${TS_DEST}/main.js`,
      output: {
        format: 'iife'
      }
    }))
    .pipe(dest('./src/my-radio'))
    .pipe(connect.reload());

const cleanTs = () => del(TS_DEST);

const runWatch = () => {
  watch('src/my-radio/**/*.ts', { ignoreInitial: false }, series(ts, bundleDev, cleanTs));
  watch('src/my-radio/**/*.css', connect.reload());
};

const clean = () => del([`${DEST}/**/*.*`, `${TS_DEST}/**/*.*`], { force: true });

const bundleBuild = () => src(`${TS_DEST}/**/*.js`)
    .pipe(rollup({
      input: `${TS_DEST}/main.js`,
      output: {
        format: 'iife'
      }
    }))
    .pipe(minifyJS({ noSource: true, ext: { min: '.js' } }))
    .pipe(dest(DEST));

exports.default = parallel(runServer, runWatch);

exports.build = series(clean, parallel(html, icons, json, css, sw, series(ts, bundleBuild, cleanTs)));
