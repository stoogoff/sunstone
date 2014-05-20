module.exports = function(grunt) {
	var package = 'cartographer';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				preserveComments: false
			},
			default: {
				src: 'dist/media/js/' + package + '.js',
				dest: 'dist/media/js/' + package + '.min.js'
			},
			tools: {
				src: 'dist/media/js/tools.js',
				dest: 'dist/media/js/tools.min.js'	
			}
		},
		sass: {
			default: {
				options: {
					style: 'compressed'
				},
				files: {
					'dist/media/css/cartographer.css': 'dist/media/css/cartographer.sass'
				}
			}
		},
		concat: {
			default: {
				src: ['src/media/js/vendor/*.js', 'src/media/js/utils/*.js'],
				dest: 'dist/media/js/' + package + '.js',
			},
			tools: {
				src: ['src/media/js/tools/*.js'],
				dest: 'dist/media/js/tools.js',	
			}
		},
		clean: {
			release: ['dist/media/js/' + package + '.js', 'dist/media/js/tools.js', 'dist/media/js/vendor', 'dist/media/js/tools', 'dist/media/js/utils'],
			default: ['dist/media/js/vendor', 'dist/media/js/tools', 'dist/media/js/utils', 'dist/media/css/*.sass'],
		},
		copy: {
			default: {
				expand: true,
				cwd: 'src/',
				src: '**',
				dest: 'dist/'
			}
		},
		watch: {
			files: ['src/index.html', 'src/media/js/*.js', 'src/media/js/*/*.js', 'src/media/css/*.sass'],
			tasks: ['default'],
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');

	// Default task(s).
	grunt.registerTask('default', ['copy', 'concat', 'sass', 'clean:default']);
	grunt.registerTask('release', ['copy', 'concat', 'uglify', 'sass', 'clean:release']);
};