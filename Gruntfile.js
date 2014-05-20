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
		concat: {
			default: {
				src: ['src/media/js/*.js', 'src/media/js/vendor/*.js'],
				dest: 'dist/media/js/' + package + '.js',
			},
			tools: {
				src: ['src/media/js/tools/*.js'],
				dest: 'dist/media/js/tools.js',	
			}
		},
		clean: ['dist/media/js/' + package + '.js', 'dist/media/js/tools.js'],
		copy: {
			default: {
				src: 'src/index.html',
				dest: 'dist/index.html'
			}
		},
		watch: {
			files: ['src/index.html', 'src/media/js/*.js', 'src/media/js/tools/*.js'],
			tasks: ['default'],
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['concat', 'copy']);
	//grunt.registerTask('default', ['concat', 'uglify', 'copy', 'clean']);
};