const { src, dest, series, parallel, watch } = require('gulp');
const del = require('del');
const minifyCSS = require('gulp-csso');
const minifyJS = require('gulp-minify');
const rollup = require('gulp-rollup');
const typescript = require('gulp-typescript');

const TS_DEST = './out-tsc';
const DEST = '../yurivoronin.github.io/my-radio';

const clean = () => del([`${DEST}/**/*.*`, `${TS_DEST}/**/*.*`], { force: true });

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

const bundleTo = (folder) =>
  bundle = () => src(`${TS_DEST}/**/*.js`)
    .pipe(rollup({
      input: `${TS_DEST}/main.js`,
      output: {
        format: 'iife'
      }
    }))
    .pipe(minifyJS({ noSource: true, ext: { min: '.js' } }))
    .pipe(dest(folder));

const cleanTs = () => del(TS_DEST);

exports.default = series(ts, bundleTo('./src/my-radio'), cleanTs);

watch('src/my-radio/**/*.ts', exports.default);

exports.build = series(clean, parallel(html, icons, json, css, sw, series(ts, bundleTo(DEST), cleanTs)));
