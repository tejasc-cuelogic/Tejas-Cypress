import { get, forEach } from 'lodash';
import { seedTestUsers, getMigratedUserAuditInfo, cleanUpTestUsers } from '../../fixtures/userQueries';
import { apiRequest } from '../../support/common';
import { requestBody, requestHeaders } from '../../fixtures/common';
import { adminCredentials } from './../../fixtures/user';

let auditInfo = {};
let migratedUserAuditInfo = {};
const userInfo = ['dateAccountWasOpened',
  'numberOf1099FormsToExpect',
  'currentBalanceWithoutAnyInflightMoney',
  'currentBalanceWithInflightMoney',
  'numberOfValidAgreements',
  'totalInvestedFromAgreement',
  'totalInvestedFromInvestment',
  'countOfPaymentsReceived',
  'totalPaidBackNet',
  'totalPaidBackGross',
  'totalCreditEarned',
  'totalCreditSpent',
  'totalPaidBackInterestGross',
  'totalPaidBackInterestNet',
  'totalPaidBackPrincipalGross',
  'totalPaidBackPrincipalNet',
  'totalDeposited',
  'totalWithdrawn',
  'currentRegCfLimit',
  'dateOfFirstInvestment',
  'totalPaidInFeesToNextSeed',
  'countOfWithdrawals',
  'countOfDeposits',
  'currentInflightLimit',
  'totalAmtCashInterestTXAndUS.cashInterestTX',
  'totalAmtCashInterestTXAndUS.cashInterestUS'
];


describe('Audit Investor', () => {

  context('User Login', () => {
    before(() => {
      cy.login(adminCredentials.email, adminCredentials.password).then((user) => {
        console.log('user', user);
        if (user.signInUserSession) {
          if (user.signInUserSession.idToken && user.signInUserSession.idToken.jwtToken) {
            const authToken = user.signInUserSession.idToken.jwtToken;
            requestHeaders.authorization = `Bearer ${authToken}`;
            requestBody.query = seedTestUsers;
            apiRequest('seedTestUsers', requestBody, requestHeaders)
              .then((resSeedTestUsers) => {
                const userId = resSeedTestUsers.body.data.seedTestUsers.created[0].id;
                auditInfo = resSeedTestUsers.body.data.seedTestUsers.created[0].auditInfo;
                console.log('userId', userId);
                requestBody.query = getMigratedUserAuditInfo(userId, 'INDIVIDUAL');
                apiRequest('getMigratedUserAuditInfo', requestBody, requestHeaders)
                  .then((resGetMigratedUserAuditInfo) => {
                    migratedUserAuditInfo = resGetMigratedUserAuditInfo.body.data.getMigratedUserAuditInfo;
                    console.log('auditInfo', auditInfo);
                    console.log('migratedUserAuditInfo', migratedUserAuditInfo);
                    requestBody.query = cleanUpTestUsers(userId);
                    apiRequest('cleanUpTestUsers', requestBody, requestHeaders)
                      .then((resCleanUpTestUsers) => {
                        console.log('Successfully cleanUp Test Users', resCleanUpTestUsers);

                      });
                  });
              });
          }
        }
      })
    });

    describe('Data compare', () => {
      userInfo.forEach(auditKey => {
        it(`should assert presence of ${auditKey}`, () => {
          assert.equal(get(auditInfo, auditKey), get(migratedUserAuditInfo, auditKey), `Successfully matched field: ${auditKey}`);
        });
      });
    })
  })
})