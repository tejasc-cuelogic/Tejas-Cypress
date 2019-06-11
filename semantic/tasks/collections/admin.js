/** *****************************
     Admin Task Collection
****************************** */

/*
  This are tasks to be run by project maintainers
  - Creating Component Repos
  - Syncing with GitHub via APIs
  - Modifying package files
*/

/** *****************************
             Tasks
****************************** */


module.exports = function (gulp) {
  const
    // less/css distributions
    initComponents = require('../admin/components/init');
  const createComponents = require('../admin/components/create');
  const updateComponents = require('../admin/components/update');

  // single component releases
  const initDistributions = require('../admin/distributions/init');
  const createDistributions = require('../admin/distributions/create');
  const updateDistributions = require('../admin/distributions/update');

  const release = require('../admin/release');
  const publish = require('../admin/publish');
  const register = require('../admin/register')
  ;

  /* Release */
  gulp.task('init distributions', 'Grabs each component from GitHub', initDistributions);
  gulp.task('create distributions', 'Updates files in each repo', createDistributions);
  gulp.task('init components', 'Grabs each component from GitHub', initComponents);
  gulp.task('create components', 'Updates files in each repo', createComponents);

  /* Publish */
  gulp.task('update distributions', 'Commits component updates from create to GitHub', updateDistributions);
  gulp.task('update components', 'Commits component updates from create to GitHub', updateComponents);

  /* Tasks */
  gulp.task('release', 'Stages changes in GitHub repos for all distributions', release);
  gulp.task('publish', 'Publishes all releases (components, package)', publish);
  gulp.task('register', 'Registers all packages with NPM', register);
};
