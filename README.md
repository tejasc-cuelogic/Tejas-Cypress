# NS-Client

## Getting started

To get the frontend running locally:

- Clone this repo
- `npm install` to install all req'd dependencies
- `npm start` to start the local server

**General functionality:**

- Authenticate users via JWT (login/signup pages + logout button on settings page)
- CRU* users (sign up & settings page - no deleting)

## TO-DO
- [ ] Add server (API) URL using webpack environment variables 
- [ ] Add create user page along with roles
- [ ] Implement reset password functionality
- [ ] Improve the Authorization HOC
- [ ] Figure out how to do component level authorization
- [ ] Improve the way errors are shown on the UI

<br />

## Credits
Thanks to the following projects that have helped form the base of NextSeed V2 Client.

- https://github.com/gothinkster/react-mobx-realworld-example-app/
- https://github.com/shoaibbhimani/React-Mobx-RRV4
- https://github.com/nightwolfz/mobx-starter
 
## Windows Notes
- run `npm install --vs2015 -g windows-build-tools`
- use ` npm install --python=python2.7`