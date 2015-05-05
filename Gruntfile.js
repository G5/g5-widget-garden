module.exports = function(grunt) {

  var componentSubdirs = grunt.file.expand('public/static/components/*/javascripts/*/')
  var concatFiles = {}

  componentSubdirs.forEach(function(subdir) {
    var filesToConcat = subdir + "*.js"
    var concattedFilename = subdir.substr(0, subdir.length - 1) + ".js"
    concatFiles[concattedFilename] = filesToConcat
  })

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    widgetPath: 'public/static/components',
    relativeCoffeePath: '*/javascripts/*',

    coffee: {
      compile: {
        files: [
          {
            expand: true,
            cwd: '<%= widgetPath %>',
            src: '<%= relativeCoffeePath %>/*.js.coffee',
            dest: '<%= widgetPath %>',
            ext: '.compiled.js'
          }
        ]
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        files: concatFiles
      }
    },

    clean: ['<%= widgetPath %>/<%= relativeCoffeePath %>/*.compiled.js'],

    watch: {
      files: ['<%= widgetPath %>/<%= relativeCoffeePath %>/*'],
      tasks: ['coffee', 'concat', 'clean']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['coffee', 'concat', 'clean']);
};