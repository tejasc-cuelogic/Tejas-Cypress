/** *****************************
         Check Install
****************************** */

const
  // node dependencies
  gulp = require('gulp');
const fs = require('fs');
const console = require('better-console');
const install = require('./config/project/install')
;

// export task
module.exports = function () {
  setTimeout(() => {
    if (!install.isSetup()) {
      console.log('Starting install...');
      gulp.start('install');
    } else {
      gulp.start('watch');
    }
  }, 50); // Delay to allow console.clear to remove messages from check event
};
