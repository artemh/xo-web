'use strict'

// ===================================================================

var SRC_DIR = __dirname + '/src' // eslint-disable-line no-path-concat
var DIST_DIR = __dirname + '/dist' // eslint-disable-line no-path-concat

// Port to use for the livereload server.
//
// It must be available and if possible unique to not conflict with other projects.
// http://www.random.org/integers/?num=1&min=1024&max=65535&col=1&base=10&format=plain&rnd=new
var LIVERELOAD_PORT = 26242

// Port to use for the embedded web server.
//
// Set to 0 to choose a random port at each run.
var SERVER_PORT = LIVERELOAD_PORT + 1

// Address the server should bind to.
//
// - `'localhost'` to make it accessible from this host only
// - `null` to make it accessible for the whole network
var SERVER_ADDR = 'localhost'

var PRODUCTION = process.env.NODE_ENV === 'production'
var DEVELOPMENT = !PRODUCTION

// ===================================================================

var gulp = require('gulp')

// ===================================================================

function lazyFn (factory) {
  var fn = function () {
    fn = factory()
    return fn.apply(this, arguments)
  }

  return function () {
    return fn.apply(this, arguments)
  }
}

// -------------------------------------------------------------------

var livereload = lazyFn(function () {
  var livereload = require('gulp-refresh')
  livereload.listen({
    port: LIVERELOAD_PORT
  })

  return livereload
})

var pipe = lazyFn(function () {
  var current
  function pipeCore (streams) {
    var i, n, stream
    for (i = 0, n = streams.length; i < n; ++i) {
      stream = streams[i]
      if (!stream) {
        // Nothing to do
      } else if (stream instanceof Array) {
        pipeCore(stream)
      } else {
        current = current
          ? current.pipe(stream)
          : stream
      }
    }
  }

  var push = Array.prototype.push
  return function (streams) {
    try {
      if (!(streams instanceof Array)) {
        streams = []
        push.apply(streams, arguments)
      }

      pipeCore(streams)

      return current
    } finally {
      current = null
    }
  }
})

var resolvePath = lazyFn(function () {
  return require('path').resolve
})

// -------------------------------------------------------------------

// Similar to `gulp.src()` but the pattern is relative to `SRC_DIR`
// and files are automatically watched when not in production mode.
var src = lazyFn(function () {
  function resolve (path) {
    return path
      ? resolvePath(SRC_DIR, path)
      : SRC_DIR
  }

  return PRODUCTION
    ? function src (pattern, base) {
      base = resolve(base)

      return gulp.src(pattern, {
        base: base,
        cwd: base,
        sourcemaps: true
      })
    }
    : function src (pattern, base) {
      base = resolve(base)

      return pipe(
        gulp.src(pattern, {
          base: base,
          cwd: base,
          sourcemaps: true
        }),
        require('gulp-watch')(pattern, {
          base: base,
          cwd: base
        }),
        require('gulp-plumber')()
      )
    }
})

// Similar to `gulp.dest()` but the output directory is relative to
// `DIST_DIR` and default to `./`, and files are automatically live-
// reloaded when not in production mode.
var dest = lazyFn(function () {
  function resolve (path) {
    return path
      ? resolvePath(DIST_DIR, path)
      : DIST_DIR
  }

  var opts = {
    sourcemaps: {
      path: '.'
    }
  }

  return PRODUCTION
    ? function dest (path) {
      return gulp.dest(resolve(path), opts)
    }
    : function dest (path) {
      var stream = gulp.dest(resolve(path), opts)
      stream.pipe(livereload())
      return stream
    }
})

// ===================================================================

function browserify (path, opts) {
  if (opts == null) {
    opts = {}
  }

  var bundler = require('browserify')(path, {
    basedir: SRC_DIR,
    debug: DEVELOPMENT, // TODO: enable also in production but need to make it work with gulp-uglify.
    extensions: opts.extensions,
    fullPaths: false,
    paths: SRC_DIR + '/common',
    standalone: opts.standalone,

    // Required by Watchify.
    cache: {},
    packageCache: {}
  })

  var plugins = opts.plugins
  for (var i = 0, n = plugins && plugins.length; i < n; ++i) {
    var plugin = plugins[i]
    bundler.plugin(require(plugin[0]), plugin[1])
  }

  if (PRODUCTION) {
    // FIXME: does not work with react-intl (?!)
    // bundler.plugin('bundle-collapser/plugin')
  } else {
    bundler = require('watchify')(bundler)
  }

  // Append the extension if necessary.
  if (!/\.js$/.test(path)) {
    path += '.js'
  }
  path = resolvePath(SRC_DIR, path)

  var stream = new (require('readable-stream'))({
    objectMode: true
  })

  var write
  function bundle () {
    bundler.bundle(function onBundle (error, buffer) {
      if (error) {
        stream.emit('error', error)
        return
      }

      write(new (require('vinyl'))({
        base: SRC_DIR,
        contents: buffer,
        path: path
      }))
    })
  }

  if (PRODUCTION) {
    write = function (data) {
      stream.push(data)
      stream.push(null)
    }
  } else {
    stream = require('gulp-plumber')().pipe(stream)
    write = function (data) {
      stream.push(data)
    }

    bundler.on('update', bundle)
  }

  stream._read = function () {
    this._read = function () {}
    bundle()
  }

  return stream
}

// ===================================================================

gulp.task(function buildPages () {
  return pipe(
    src('index.jade'),
    require('gulp-jade')(),
    DEVELOPMENT && require('gulp-embedlr')({
      port: LIVERELOAD_PORT
    }),
    dest()
  )
})

gulp.task(function buildScripts () {
  return pipe(
    browserify('./index.js', {
      plugins: [
        // ['css-modulesify', {
        ['modular-css/browserify', {
          css: DIST_DIR + '/modules.css'
        }]
      ]
    }),
    PRODUCTION && require('gulp-uglify')(),
    dest()
  )
})

gulp.task(function buildStyles () {
  return pipe(
    src('index.scss'),
    require('gulp-sass')(),
    require('gulp-autoprefixer')([
      'last 1 version',
      '> 1%'
    ]),
    PRODUCTION && require('gulp-csso')(),
    dest()
  )
})

gulp.task(function copyAssets () {
  return pipe(
    src(['assets/**/*', 'favicon.*']),
    src(
      'fontawesome-webfont.*',
      __dirname + '/node_modules/font-awesome/fonts' // eslint-disable-line no-path-concat
    ),
    src(
      ['!*.css', 'font-mfizz.*'],
      __dirname + '/node_modules/font-mfizz/dist' // eslint-disable-line no-path-concat
    ),
    dest()
  )
})

gulp.task('build', gulp.parallel(
  'buildPages',
  'buildScripts',
  'buildStyles',
  'copyAssets'
))

// -------------------------------------------------------------------

gulp.task(function clean (done) {
  require('rimraf')(DIST_DIR, done)
})

// -------------------------------------------------------------------

gulp.task(function server (done) {
  require('connect')()
    .use(require('serve-static')(DIST_DIR))
    .listen(SERVER_PORT, SERVER_ADDR, function onListen () {
      var address = this.address()

      var port = address.port
      address = address.address

      // Correctly handle IPv6 addresses.
      if (address.indexOf(':') !== -1) {
        address = '[' + address + ']'
      }

      /* jshint devel: true*/
      console.log('Listening on http://' + address + ':' + port)
    })
    .on('error', done)
    .on('close', function onClose () {
      done()
    })
})
