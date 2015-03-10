module.exports = function(grunt) {

    // Load all grunt modules
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Tell our Express server that Grunt launched it
    process.env.GRUNTED = true;

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            all: [
                '*.js'
            ]
        },

        express: {
            parent: {
                options: {
                    port: 7001,
                    bases: '.'
                }
            },
            iframe: {
                options: {
                    port: 7002,
                    bases: '.'
                }
            }
        },

        uglify: {
            build: {
                files: {
                    'build/ftv-iframecom-iframe.<%= pkg.version %>.min.js': ['ftv-iframecom-iframe.js'],
                    'build/ftv-iframecom-parent.<%= pkg.version %>.min.js': ['ftv-iframecom-parent.js']
                }
            }
        },

        clean: {
            build: {
                src: ['build']
            }
        }
    });

    grunt.registerTask('default', [
        'jshint',
        'express',
        'express-keepalive'
    ]);

    grunt.registerTask('build', [
        'jshint',
        'clean',
        'uglify'
    ]);

};