const { src, dest, series, parallel } = require('gulp');
const del = require('del');
const minifyCSS = require('gulp-csso');
const minifyJS = require('gulp-minify');

const DEST = '../yurivoronin.github.io/my-radio';

const clean = () => del(`${DEST}/**/*.*`, { force: true });

const html = () => src(['src/my-radio/index.html'])
  .pipe(dest(`${DEST}`));

const icons = () => src(['src/my-radio/icons/*.png'])
  .pipe(dest(`${DEST}/icons`));

const json = () => src(['src/my-radio/*.json',])
  .pipe(dest(`${DEST}`));

const css = () => src('src/my-radio/styles.css')
  .pipe(minifyCSS())
  .pipe(dest(`${DEST}`));

const js = () => src('src/my-radio/*.js')
  .pipe(minifyJS({ noSource: true, ext: { min: '.js' } }))
  .pipe(dest(`${DEST}`));

exports.default = series(clean, parallel(html, icons, json, css, js));
