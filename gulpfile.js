const { src, dest, watch, series, parallel} = require('gulp');   //extrayendo dependencias

// Css and Sass
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');


function css( done ){
    // pasos sass
    // paso 1: - Identificar el archivo, 2 - Compilar, 3 -  Guardar el .css
    src('src/scss/app.scss')
        .pipe( sourcemaps.init())
        .pipe(  sass()) // outputStyle, es un objeto
        .pipe(  postcss(    [autoprefixer(), cssnano() ]   ))
        .pipe( sourcemaps.write('.'))
        .pipe(  dest('build/css'))

    done();
}

function imagenes( done){     // enviando img a build
    src('src/img/**/*')
        .pipe(imagemin({optimizationLevel:3})) // redujendo peso de img
        .pipe(  dest('build/img'))

    done();
}

function versionWebp(done) {
    const opciones = {      // para que sirve?
        quality: 50
    }
    src('src/img/**/*.{png, jpg}')
        .pipe(webp(50))
        .pipe(dest('build/img'))
    done();
}

function versionAvif(done){
    const opciones = {          // para que sirve?
        quality: 50
    }
    src('src/img/**/*.{png, jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
    done();
}

function dev() {
    watch('src/scss/**/*.scss', css); // Comodin
    watch('src/img/**/*', imagenes);    /*cuando se agregue o elimine una img
                                            esta manda a llamar a la function                                            img */
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);