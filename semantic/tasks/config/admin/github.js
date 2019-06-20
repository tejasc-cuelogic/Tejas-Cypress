/** *****************************
          GitHub Login
****************************** */
/*
  Logs into GitHub using OAuth
*/

const
  fs = require('fs');
const path = require('path');
const githubAPI = require('github');

// stores oauth info for GitHub API
const oAuthConfig = path.join(__dirname, 'oauth.js');
const oAuth = fs.existsSync(oAuthConfig)
  ? require(oAuthConfig)
  : false;
let github;
if (!oAuth) {
  console.error('Must add oauth token for GitHub in tasks/config/admin/oauth.js');
}

github = new githubAPI({
  version: '3.0.0',
  debug: true,
  protocol: 'https',
  timeout: 5000,
});

github.authenticate({
  type: 'oauth',
  token: oAuth.token,
});

module.exports = github;
