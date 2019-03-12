const { src, dest, series, parallel } = require('gulp');
const del = require('del');
const minifyCSS = require('gulp-csso');
const minifyJS = require('gulp-minify');

const DEST = '../yurivoronin.github.io/my-radio';

const clean = () => del(`${DEST}/**/*.*`);

const html = () => src(['src/index.html'])
  .pipe(dest(`${DEST}`));

const icons = () => src(['src/icons/*.png'])
  .pipe(dest(`${DEST}/icons`));

const json = () => src(['src/*.json',])
  .pipe(dest(`${DEST}`));

const css = () => src('src/styles.css')
  .pipe(minifyCSS())
  .pipe(dest(`${DEST}`));

const js = () => src('src/script.js')
  .pipe(minifyJS({ noSource: true, ext: { min: '.js' } }))
  .pipe(dest(`${DEST}`));

exports.default = series(clean, parallel(html, icons, json, css, js));
