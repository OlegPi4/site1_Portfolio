const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
const sass = require('gulp-sass')(require('sass'));
const cleaneCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
const newer = require('gulp-newer')
//const browsersync = require('browser-sync').create()
const del = require('del')
const sourcemap = require('gulp-sourcemaps')
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')

const paths = {
    styles: {
        src: ['src/css/**/*.less', 'src/css/**/*.sass', 'src/css/**/*.scss'],
        dest: 'dist/css'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'dist/js'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img'
    },
    htmls: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    fonts:{
        src: 'src/fonts/**',
        dest: 'dist/fonts'
    }
}

/*Обработка шрифтов*/
function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(ttf2woff())
        .pipe(ttf2woff2())
        .pipe(gulp.dest(paths.fonts.dest))
}
/*Очистка  dist*/
function clean() {
    return del(['dist/*', '!dist/img'])
}
/*компиляция стилей из less/sass-scss в css с переименованием*/
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemap.init())
        //.pipe(less()) // при использовании less
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
			cascade: false
		}))
        .pipe(cleaneCSS({
            level:2
        }))
        /*
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))*/
        .pipe(concat('style.min.css'))
        .pipe(sourcemap.write('.'))
        .pipe(size({
            showFiles: true,
        }))
        .pipe(gulp.dest(paths.styles.dest))
        //.pipe(browsersync.stream())
} 
/*Обработка скриптов*/
function scripts() {
    return gulp.src(paths.scripts.src)
    .pipe(sourcemap.init())
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))   
    .pipe(uglify())
    .pipe(concat('main.min.js')) 
    .pipe(sourcemap.write('.'))
    .pipe(size({
        showFiles: true,
    }))
    .pipe(gulp.dest(paths.scripts.dest))
    //.pipe(browsersync.stream())
}
/*сжатие изображений*/
function img() {
    return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({
        progressive: true,
        optimizationLevel: 5,
    }))
    .pipe(size({
        showFiles: true,
    }))
    .pipe(gulp.dest(paths.images.dest))
}  
/*Минимизация Html*/
function html() {
    return gulp.src(paths.htmls.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    //.pipe(concat('index.min.html'))
    .pipe(size({
        showFiles: true,
    }))
    .pipe(gulp.dest(paths.htmls.dest))
    //.pipe(browsersync.stream())
}
/*Отслеживание изменений */
function watch() {
    //browsersync.init({
    //    server: {
    //        baseDir: "./dist"
    //    }
    //});
    //gulp.watch(paths.htmls.dest).on('change', browsersync.reload)
    gulp.watch(paths.htmls.src, html)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.images.src, img)
    gulp.watch(paths.images.src, fonts)
}

/*запуск сценария действий*/
const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img, fonts), watch)


exports.fonts = fonts
exports.clean = clean
exports.img = img
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build
