"use strict";
var LIVERELOAD_PORT, lrSnippet, mountFolder;
LIVERELOAD_PORT = 35728;
lrSnippet = require("connect-livereload")({
  port: LIVERELOAD_PORT
});
mountFolder = function(connect, dir) {
  return connect.static(require("path").resolve(dir));
};
module.exports = function (grunt) {
  var yeomanConfig;
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  // Project settings
  yeomanConfig = {
    app: "src",
    dist: "dist"
  };
  try {
    yeomanConfig.app = require("./bower.json").appPath || yeomanConfig.app;
  } catch (_e) {}

  grunt.loadNpmTasks('grunt-json');
  grunt.loadNpmTasks('grunt-fixmyjs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
    // Define the configuration for all the tasks
  grunt.initConfig({

    yeoman: yeomanConfig,
    // Watches files for changes and runs tasks based on the changed files
    less: {
       development: {
       	  options: {
            paths: ['assets/css']
	  },
          files: {
           '<%= yeoman.app %>/styles/main.css': '<%= yeoman.app %>/{,*/}*.less'
          }
       }
    },

    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
//      compass: {
//        files: ['<%= yeoman.app %>/styles/{,*/}*.{css,scss,sass}'],
//        tasks: ['compass:server', 'autoprefixer']
//      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
            "<%= yeoman.app %>/index.html", 
            "<%= yeoman.app %>/views/**/*.html", 
            "<%= yeoman.app %>/styles/**/*.scss", 
            "<%= yeoman.app %>/styles-less/**/*.less", 
            ".tmp/styles/**/*.css", "{.tmp,<%= yeoman.app %>}/scripts/**/*.js", 
            "<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}"
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
      },
      livereload: {
        options: {
 		  open: true,
          middleware: function(connect) {
            return [
                lrSnippet, mountFolder(connect, ".tmp"), 
                mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function(connect) {
            return [
                mountFolder(connect, ".tmp"), 
                mountFolder(connect, "test")
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
                mountFolder(connect, yeomanConfig.app),
            ];
          }
        }
      }
    },

    open: {
        server: {
            url: "http://localhost:<%= connect.options.port %>"
        }
    },
    
    // Empties folders to start fresh
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
                ".tmp", "<%= yeoman.dist %>/*", 
                "!<%= yeoman.dist %>/.git*"
            ]
          }
        ]
      },
      server: '.tmp'
    },
    
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    'bower-install': {
      app: {
        html: '<%= yeoman.app %>/index.html',
        ignorePath: '<%= yeoman.app %>/'
      }
    },




    // Compiles Sass to CSS and generates necessary files if requested
//    compass: {
//      options: {
//        sassDir: '<%= yeoman.app %>/styles',
//        cssDir: '.tmp/styles',
//        generatedImagesDir: '.tmp/images/generated',
//        imagesDir: '<%= yeoman.app %>/images',
//        javascriptsDir: '<%= yeoman.app %>/scripts',
//        fontsDir: '<%= yeoman.app %>/styles/fonts',
//        importPath: '<%= yeoman.app %>/bower_components',
//        httpImagesPath: '/images',
//        httpGeneratedImagesPath: '/images/generated',
//        httpFontsPath: '/styles/fonts',
//        relativeAssets: false,
//        assetCacheBuster: false,
//        raw: 'Sass::Script::Number.precision = 10\n'
//      },
//      dist: {
//        options: {
//          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
//        }
//      },
//      server: {
//        options: {
//          debugInfo: true
//        }
//      }
//    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
        html: '<%= yeoman.app %>/index.html',
        options: {
          dest: '<%= yeoman.dist %>'
        }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ["<%= yeoman.dist %>/**/*.html", "!<%= yeoman.dist %>/bower_components/**"],
      css: ["<%= yeoman.dist %>/styles/**/*.css"],
      options: {
        dirs: ["<%= yeoman.dist %>"]
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'bower_components/font-awesome/**/*',
            'bower_components/inep-*/**/*.html',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'views/**/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
//        'compass:server'
      ],
      test: [
//          'compass'
      ],
      dist: [
//      'compass:dist',
        "copy:styles", 
        "htmlmin",
        'imagemin',
        'svgmin'
      ]
    },
    json: {
        main: {
            expand: true,
            options: {
                namespace: 'getJson',
                includePath: false,
                processName: function(filename) {
                    return filename.toLowerCase();
                }
            },
            src: ['<%= yeoman.app %>/json/{,*/}*.json'],
            dest: '<%= yeoman.app %>/json.out'
        }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
     cssmin: {
       dist: {
         files: {
           '<%= yeoman.dist %>/styles/main.css': [    
             '.tmp/styles/{,*/}*.css',
             '<%= yeoman.app %>/styles/{,*/}*.css'
           ]
         }
       }
     },
     uglify: {
       dist: {
         files: {
           '<%= yeoman.dist %>/scripts/scripts.js': [
             '<%= yeoman.dist %>/scripts/scripts.js'
           ]
         }
       }
     },
     concat: {
      options: {
        separator: grunt.util.linefeed + ';' + grunt.util.linefeed
      },
      dist: {
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
    'clean:server',
    'bower-install',
    'concurrent:server',
    'connect:livereload',
    'open',
    'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bower-install',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'json',
    'concat',
    'ngmin',
    'copy:dist', 
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
   ]);
  grunt.registerTask('default', [
    //instalar plugin netbeans 'newer:jshint',
    'newer:jshint',
    //configurar teste'test',
//    'build'
  ]);
};
