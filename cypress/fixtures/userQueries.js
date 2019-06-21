export const seedTestUsers = `mutation _seedTestUsers {
    seedTestUsers {
        created {
          id
          email
          auditInfo {
            dateAccountWasOpened
            numberOf1099FormsToExpect
            currentBalanceWithoutAnyInflightMoney
            currentBalanceWithInflightMoney
            numberOfValidAgreements
            totalInvestedFromAgreement
            totalInvestedFromInvestment
            countOfPaymentsReceived
            totalPaidBackNet
            totalPaidBackGross
            totalCreditEarned
            totalCreditSpent
            totalPaidBackInterestGross
            totalPaidBackInterestNet
            totalPaidBackPrincipalGross
            totalPaidBackPrincipalNet
            totalDeposited
            totalWithdrawn
            currentRegCfLimit
            dateOfFirstInvestment
            totalPaidInFeesToNextSeed
            countOfWithdrawals
            countOfDeposits
            currentInflightLimit
            totalAmtCashInterestTXAndUS {
              cashInterestTX
              cashInterestUS
            }
          }
        }
      }
    }`;

export const getMigratedUserAuditInfo = (userId, accountType) => {
    return `query _getMigratedUserAuditInfo {
        getMigratedUserAuditInfo (
        userId: "${userId}"
        accountType: ${accountType}
        ) {
          dateAccountWasOpened
          numberOf1099FormsToExpect
          currentBalanceWithoutAnyInflightMoney
          currentBalanceWithInflightMoney
          numberOfValidAgreements
          totalInvestedFromAgreement
          totalInvestedFromInvestment
          countOfPaymentsReceived
          totalPaidBackNet
          totalPaidBackGross
          totalCreditEarned
          totalCreditSpent
          totalPaidBackInterestGross
          totalPaidBackInterestNet
          totalPaidBackPrincipalGross
          totalPaidBackPrincipalNet
          totalDeposited
          totalWithdrawn
          currentRegCfLimit
          dateOfFirstInvestment
          totalPaidInFeesToNextSeed
          countOfWithdrawals
          countOfDeposits
          currentInflightLimit
          totalAmtCashInterestTXAndUS {
            cashInterestTX
            cashInterestUS
          }
      }
    }`
};

export const cleanUpTestUsers = (userId) => {
  return `mutation _cleanUpTestUsers {
        cleanUpTestUsers(userId:"${userId}")
    }`;
};