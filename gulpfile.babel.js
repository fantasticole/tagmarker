import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import rimraf from 'rimraf';

const plugins = loadPlugins();

import backgroundWebpackConfig from './background/webpack.config';
import injectedWebpackConfig from './injected/webpack.config';

gulp.task('background-js', ['clean'], (cb) => {
  webpack(backgroundWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('injected-js', ['clean'], (cb) => {
  webpack(injectedWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('copy-manifest', ['clean'], () => {
  return gulp.src('manifest.json')
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-content', ['clean'], () => {
  return gulp.src('content/**/*')
    .pipe(gulp.dest('./build/content'));
});

gulp.task('copy-assets', ['clean'], () => {
  return gulp.src('assets/**/*')
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('clean', (cb) => {
  rimraf('./build', cb);
});

gulp.task('build', ['copy-assets', 'copy-content', 'copy-manifest', 'background-js', 'injected-js']);

gulp.task('watch', ['default'], () => {
  gulp.watch('injected/**/*', ['build']);
  gulp.watch('background/**/*', ['build']);
});

gulp.task('default', ['build']);
