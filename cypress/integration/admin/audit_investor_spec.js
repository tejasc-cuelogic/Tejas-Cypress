import { adminCredentials } from './../../fixtures/user';
import Amplify from '@aws-amplify/core';
import AmplifyAuth from '@aws-amplify/auth';
import { seedTestUsers, getMigratedUserAuditInfo, cleanUpTestUsers } from '../../fixtures/userQueries';
import { apiRequest } from '../../support/common';
import { requestBody, requestHeaders } from '../../fixtures/common';
let auditInfo = {};
let migratedUserAuditInfo = {};

describe('Log In', () => {
  beforeEach(() => {
    amplifyLogin().then((user) => {
      console.log('user', user);
      if (user.signInUserSession) {
        if (user.signInUserSession.idToken && user.signInUserSession.idToken.jwtToken) {
          const authToken = user.signInUserSession.idToken.jwtToken;
          requestHeaders.authorization = `Bearer ${authToken}`;
          requestBody.query = seedTestUsers;
          apiRequest(requestBody, requestHeaders)
            .then((resSeedTestUsers) => {
              console.log('response of seedTestUsers', resSeedTestUsers.body);
              const userId = resSeedTestUsers.body.data.seedTestUsers.created[0].id;
              auditInfo = resSeedTestUsers.body.data.seedTestUsers.created[0].auditInfo;
              console.log('userId', userId);
              requestBody.query = getMigratedUserAuditInfo(userId, 'INDIVIDUAL');
              apiRequest(requestBody, requestHeaders)
                .then((resGetMigratedUserAuditInfo) => {
                  console.log('response of resGetMigratedUserAuditInfo', resGetMigratedUserAuditInfo);
                  migratedUserAuditInfo = resGetMigratedUserAuditInfo.body.data.getMigratedUserAuditInfo;
                  console.log('auditInfo', auditInfo);
                  console.log('migratedUserAuditInfo', migratedUserAuditInfo);
                  requestBody.query = cleanUpTestUsers(userId);
                  apiRequest(requestBody, requestHeaders
                  ).then((resCleanUpTestUsers) => {
                    console.log('Successfully cleanUp Test Users', resCleanUpTestUsers);
                  });
                });
            });
        }
      }
    })
      .catch((err) => {
        console.log('Error', err);
      });
  });

  const amplifyLogin = async () => {
    Amplify.configure({
      Auth: {
        identityPoolId: 'us-east-1:30f8a32a-2a2d-488a-924f-ee30138d68ce',
        region: 'us-east-1',
        userPoolId: 'us-east-1_TarFRqoSR',
        userPoolWebClientId: '3t6lm483nsr6sjme7h6novi2o8',
      },
    });
    return await AmplifyAuth.signIn({ username: adminCredentials.email, password: adminCredentials.password });
  };

  // const compareUserData = (auditInfo, migratedUserAuditInfo) => {
    Object.keys(auditInfo).forEach(auditKey => {
      it(`should assert presence of ${auditKey}`, () => {
        assert.deepEqual(auditInfo[auditKey], migratedUserAuditInfo[auditKey], `Successfully matched field: ${auditKey}`);
      });
    });
  // }

  // context('compare', () => {
  //   compareUserData(auditInfo, migratedUserAuditInfo);
  // });

  // specify('succesfully performs admin login action', () => {
    
  // });


});

