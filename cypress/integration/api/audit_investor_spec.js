import { get, forEach } from 'lodash';
import { seedTestUsers, getMigratedUserAuditInfo, cleanUpTestUsers } from '../../fixtures/userQueries';
import { apiRequest } from '../common.utility';

let auditInfo = {};
let migratedUserAuditInfo = {};
let userId = null;
let requestBody = {};
let requestHeaders = {};
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

  const cleanUpUser = (userId) => {
    requestBody.query = cleanUpTestUsers(userId);
    apiRequest('cleanUpTestUsers', requestBody, requestHeaders)
      .then((resCleanUpTestUsers) => {
        console.log('Successfully cleanUp Test Users', resCleanUpTestUsers);
      });
  }
  context('User Login', () => {
    before(() => {
      // const adminCredentials = await getJSONDataFromFixtures('admin/user', 'adminCredentials');
      cy.fixture('admin/user').then((data) => {
        const adminCredentials = data.adminCredentials;
        cy.login(adminCredentials.email, adminCredentials.password).then((user) => {
          console.log('user', user);
          if (user.signInUserSession) {
            if (user.signInUserSession.idToken && user.signInUserSession.idToken.jwtToken) {
              const authToken = user.signInUserSession.idToken.jwtToken;
              requestHeaders.authorization = `Bearer ${authToken}`;
              requestBody.query = seedTestUsers;
              cleanUpUser(userId);
              apiRequest('seedTestUsers', requestBody, requestHeaders)
                .then((resSeedTestUsers) => {
                  if(resSeedTestUsers && resSeedTestUsers.body && resSeedTestUsers.body.data && resSeedTestUsers.body.data.seedTestUsers){
                  userId = resSeedTestUsers.body.data.seedTestUsers.created[0].id;
                  auditInfo = resSeedTestUsers.body.data.seedTestUsers.created[0].auditInfo;
                  console.log('userId', userId);
                  requestBody.query = getMigratedUserAuditInfo(userId, 'INDIVIDUAL');
                  apiRequest('getMigratedUserAuditInfo', requestBody, requestHeaders)
                    .then((resGetMigratedUserAuditInfo) => {
                      migratedUserAuditInfo = resGetMigratedUserAuditInfo.body.data.getMigratedUserAuditInfo;
                      cy.log(migratedUserAuditInfo);
                      console.log('auditInfo', auditInfo);
                      console.log('migratedUserAuditInfo', migratedUserAuditInfo);
                      cleanUpUser(userId);
                    })
                    .catch((err) => {
                      console.log('getMigratedUserAuditInfo error : ', err);
                      cleanUpUser(userId);
                    });
                  }else{
                    cleanUpUser(userId);
                  }
                })
                .catch((err) => {
                  console.log('seedTestUsers error : ', err)
                  cleanUpUser(userId);
                });
            }
          }
        });
      });
    });

    describe('Data compare', () => {
      userInfo.forEach(auditKey => {
        if (auditInfo && migratedUserAuditInfo) {
          it(`should assert presence of ${auditKey}`, () => {
            assert.equal(get(auditInfo, auditKey), get(migratedUserAuditInfo, auditKey), `Successfully matched field: ${auditKey}`);
          });
        } else {
          it('Should auditInfo has value', assert.equal(auditInfo, null));
          it('Should migratedUserAuditInfo has value', assert.equal(migratedUserAuditInfo, null));
        }
      });
    })
  })
})