module.exports = function(grunt){
    
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json')
        });
    
        // This is default taks
        grunt.registerTask('default', []);

        grunt.registerTask('speak', () => {
            console.log("Speaking..")
        });

        grunt.registerTask('walk', function() {
            console.log("Walking..")
        });

        grunt.registerTask('both', [ 'speak', 'walk' ]);
    


        grunt.initConfig({
            concat: {
                js: {
                    src: ['client/js/1.js',
                    'client/js/2.js', 
                    'client/bower_components/jquery/dist/jquery.min.js',
                    'client/bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'client/bower_components/angular/angular.min.js',
                    'client/app/app.module.js',
                    'client/app/app.controller.js'
                ],
                    dest: 'client/build/built.js',
                },
                css: {
                    src: [
                        'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        '/bower_components/bootstrap/dist/css/bootstrap-theme.css',
                        'client/css/main.css','client/css/index1.css','client/css/index2.css'],
                    dest: 'client/build/styles.css',
                }
            },
            watch: {
                js: {
                  files: ['client/js/*.js','client/app/*.js'],
                  tasks: ['concat','uglify'],
                },
                css: {
                    files: ['client/css/*.css'],
                    tasks: ['concat','cssmin'],
                  },
            },
            uglify: {
                build: {
                  src: 'client/build/built.js',
                  dest: 'client/build/built.min.js'
                }
            },
            cssmin: {
                options: {
                  mergeIntoShorthands: false,
                  roundingPrecision: -1
                },
                target: {
                  files: {
                    'client/build/styles.min.css': ['client/build/styles.css']
                  },
                }
            },
            obfuscator: {
                options: {
                    banner: '// obfuscated with grunt-contrib-obfuscator.\n',
                },
                js: {
                    files: {
                        'client/build/built.obf.js': [
                            'client/build/built.js',
                        ]
                    }
                }
            }
        });

        // This is to concat multiple files into one file
        grunt.loadNpmTasks('grunt-contrib-concat');

        // This to watch
        grunt.loadNpmTasks('grunt-contrib-watch');        

        // This is to ugligy - minify
        grunt.loadNpmTasks('grunt-contrib-uglify');

        // This is to minfiy CSS
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        

        // This is to obfuscate js
        grunt.loadNpmTasks('grunt-contrib-obfuscator');
        

        // This is default taks
        grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'obfuscator' , 'watch']);
        
    };