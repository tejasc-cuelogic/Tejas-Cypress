export const userInfo = `
  dateAccountWasOpened,
  numberOf1099FormsToExpect,
  currentBalanceWithoutAnyInflightMoney,
  currentBalanceWithInflightMoney,
  numberOfValidAgreements,
  totalInvestedFromAgreement,
  totalInvestedFromInvestment,
  countOfPaymentsReceived,
  totalPaidBackNet,
  totalPaidBackGross,
  totalCreditEarned,
  totalCreditSpent,
  totalPaidBackInterestGross,
  totalPaidBackInterestNet,
  totalPaidBackPrincipalGross,
  totalPaidBackPrincipalNet,
  totalDeposited,
  totalWithdrawn,
  currentRegCfLimit,
  dateOfFirstInvestment,
  totalPaidInFeesToNextSeed,
  countOfWithdrawals,
  countOfDeposits,
  currentInflightLimit,
  totalAmtCashInterestTXAndUS {
    cashInterestTX,
    cashInterestUS,
  }`;

export const seedTestUsers = `mutation _seedTestUsers {
    seedTestUsers {
        created {
          id
          email
          auditInfo 
            {
              ${userInfo}
            }
        }
      }
    }`;

export const getMigratedUserAuditInfo = (userId, accountType) => {
  return `query _getMigratedUserAuditInfo {
        getMigratedUserAuditInfo (
        userId: "${userId}"
        accountType: ${accountType}
        )
        {
          ${userInfo}
        }       
    }`
};

export const cleanUpTestUsers = (userId) => {
  return `mutation _cleanUpTestUsers {
        cleanUpTestUsers(userId:"${userId}")
    }`;
};