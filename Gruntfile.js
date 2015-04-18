/*global module:false*/
module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>' + '\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage : "" %>' + '\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' + '\n' +
        ' * License: <%= _.pluck(pkg.licenses, "type").join(", ") %> ' +
        '(<%= _.pluck(pkg.licenses, "url").join(", ") %>)' + '\n' +
        ' */\n\n'
    },
    jshint: {
        options: {
            reporter: require('jshint-stylish'),
            jshintrc: true
        },
        xinara: {
            src: [
                'Gruntfile.js',
                'lib/*.js',
                'lib/**/*.js'
            ],
            options: {
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Custom tasks
  grunt.registerTask('check', ['jshint']);

  // Default task
  grunt.registerTask('default', ['check']);

};
