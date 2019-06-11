/** *****************************
          Register PM
****************************** */

/*
  Task to register component repos with Package Managers
  * Registers component with bower
  * Registers component with NPM
*/

const
  // node dependencies
  process = require('child_process');

// config
const release = require('../config/admin/release');

// register components and distributions
const repos = release.distributions.concat(release.components);
const total = repos.length;
let index = -1;

let stream;
let stepRepo;
module.exports = function (callback) {
  console.log('Registering repos with package managers');

  // Do Git commands synchronously per component, to avoid issues
  stepRepo = function () {
    index += 1;
    if (index >= total) {
      callback();
      return;
    }
    const
      repo = repos[index].toLowerCase();
    const outputDirectory = `${release.outputRoot + repo}/`;
    const { exec } = process;
    const execSettings = { cwd: outputDirectory };
    const updateNPM = 'npm publish;meteor publish;'
    ;

    /* Register with NPM */
    exec(updateNPM, execSettings, (err, stdout, stderr) => {
      console.log(err, stdout, stderr);
      stepRepo();
    });
  };
  stepRepo();
};
