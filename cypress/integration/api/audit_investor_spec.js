import { get } from 'lodash';
import { seedTestUsers, getMigratedUserAuditInfo, cleanUpTestUsers } from '../../fixtures/userQueries';
import { prepRequest } from '../common.utility';


let auditInfo = {};
let migratedUserAuditInfo = {};
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


describe.skip('Audit Investor', () => {
  describe('Data compare', () => {
    before(() => {
      cy.fixture('admin/user').then((data) => {
        const adminCredentials = data.adminCredentials;
        cy.login(adminCredentials.email, adminCredentials.password).then((user) => {
          if (user.signInUserSession) {
            if (user.signInUserSession.idToken && user.signInUserSession.idToken.jwtToken) {
              const authToken = user.signInUserSession.idToken.jwtToken;
              requestHeaders.authorization = `Bearer ${authToken}`;
              requestBody.query = seedTestUsers;
              cy.request(
                prepRequest(cleanUpTestUsers(null), authToken)
                ).then(res => {
                cy.request(
                  prepRequest(seedTestUsers, authToken)
                  ).then(resSeedTestUsers => {
                  const seededUser = get(resSeedTestUsers.body.data.seedTestUsers.created[0], 'id');
                  auditInfo = get(resSeedTestUsers.body.data.seedTestUsers.created[0], 'auditInfo');
                  cy.request(
                    prepRequest(getMigratedUserAuditInfo(seededUser, 'INDIVIDUAL'), authToken)
                    ).then(resGetMigratedUserAuditInfo => {
                    migratedUserAuditInfo = resGetMigratedUserAuditInfo.body.data.getMigratedUserAuditInfo;
                  })
                });
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