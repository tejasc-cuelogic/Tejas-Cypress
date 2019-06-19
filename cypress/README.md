# NS-Client

## Cypress Folder Structure

- cypress
    - fixtures
	    - shared
		    - test.png
	    - investor
			  - user.json
			  - liscense.pdf
	    - issuer
		    - issuerPrequal.json
	    - admin
		    - offering.json
    - integration
	    - common.utility.js
	    - module_name
		    - utility
				  - module.utility.js 
		    - test1_spec.js
		    - sub_module_name
			    - test2_spec.js
	    - invest_now
		    - 01_invest_now_spec.js
		    - 02_invest_now_cf_spec.js
		    - utility
				  - invet_now.utility.js 
    - plugins
    - support
    - reports
	    - screenshots
	    - videos
	- README.md

# `folder details`

`fixtures` : This folder contains below
- All mock data needed for test spec
- All required test file image, doc, pdf etc

`integration`: This folder contains below
- All test specs
- All the test specs contains this folders is retrieve by `cypress` and this all are listed to `cypress ui`
- We can add common utility as per requirements but it needs to ignore that file as spec by adding `"ignoreTestFiles": "*.utility.js", ` in cypress.json
 
`plugins`: This folder contains any third party plugins required
- test spec for multiple `viewport` there is a plugin proved https://github.com/andrewmcoupe/cy-view
- there are more plugin to match custom requirements

`screenshots`:   This folder contains below
- All the test spec wise screenshots taken whenever any tests spec were failed

`videos`:   This folder contains below
- All the test spec wise videos taken whenever any tests spec were failed

## TO-DO
  update cypress.json with below values

  {
  "baseUrl": "https://dev.nextseed.qa/",
  "chromeWebSecurity": false,
  "pageTimeoutLoad": 80000,
  "defaultCommandTimeout": 60000,
  "ignoreTestFiles": "*.utility.js", 
  "fixturesFolder": "cypress/testData",
  "integrationFolder": "cypress/specs",
  "screenshotsFolder": "cypress/testReports/screenshots",
  "videosFolder": "cypress/testReports/videos",
  "supportFile": "cypress/shared/index.js",
  "videoUploadOnPasses": false
}
