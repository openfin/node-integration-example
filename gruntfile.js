/* jshint node: true*/
'use strict';
module.exports = function(grunt) {
    var target = grunt.option('target') || 'http://localhost:5000',
        port = process.env.PORT || 5000,
        files = {
            js: [
                'gruntfile.js',
                'public/**/*.js',
                'public/**/*.json',
                '*.json'
            ],
            html: [
                'public/**/*.html'
            ],
            css: [
                'public/**/*.css'
            ]
        };

    grunt.initConfig({
        watch: {
            code: {
                files: [].concat(files.html, files.css, files.js),
                tasks: [],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        'public'
                    ]
                },
                files: [].concat(files.html, files.css, files.js)
            }
        },
        connect: {
            options: {
                port: port,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: false,
                    base: [
                        'public'
                    ]
                }
            }
        },
        openfin: {
            options: {
                configPath: target + '/app.json',
                config: {
                    create: false,
                    filePath: 'public/app.json',
                    options: {
                        startup_app: {
                            url: target + '/index.html',
                            applicationIcon: target + '/favicon.ico'
                        },
                        appAssets: [{
                            src: target + '/service.zip',
                            version: '0.2.0',
                            alias: 'node-service',
                            target: 'node_6.5.0.exe'
                        }],
                        runtime: {
                            version: 'beta'
                        },
                        shortcut: {
                            icon: target + '/favicon.ico'
                        }
                    }
                }
            },
            serve: {
                open: true
            }
        },
        compress: {
            build: {
                options: {
                    archive: 'public/service.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'node-service/',
                        src: ['**'],
                        dest: '/'
                    }
                ]
            }
        },
        clean: {
            all: [
                'public/service.zip'
        ]}
    });

    // Write a batch file that the app config will be pointing to to start the server
    grunt.registerTask('write_batch_file', function() {
        grunt.file.write('node-service/service.bat', 'node_6.5.0.exe index.js');
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-openfin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('serve', ['clean', 'compress', 'connect:livereload', 'openfin:serve', 'watch']);
};
