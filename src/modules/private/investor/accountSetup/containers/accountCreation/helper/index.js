class Helper {
  getFundingTypeIndex = (value) => {
    let index = '';
    if (value === 'check') {
      index = 0;
    } else if (value === 'iraTransfer') {
      index = 1;
    } else if (value === 'directRollOver') {
      index = 2;
    }
    return index;
  }

  getAccountTypeIndex = (value) => {
    let index = '';
    if (value === 'traditional') {
      index = 0;
    } else if (value === 'roth') {
      index = 1;
    }
    return index;
  }

  entitySteps = () => ({
    FIN_INFO_FRM: 0,
    GEN_INFO_FRM: 1,
    TRUST_INFO_FRM: 2,
    PERSONAL_INFO_FRM: 3,
    FORM_DOCS_FRM: 4,
    formLinkBankManually: 5,
    addFunds: 6,
    summary: 7,
    THANK_YOU: 8,
  });

  iraSteps = fundingType => (fundingType !== 0 ? {
    FIN_INFO_FRM: 1,
    ACC_TYPES_FRM: 2,
    FUNDING_FRM: 3,
    IDENTITY_FRM: 4,
    summary: 5,
    THANK_YOU: 6,
  } : {
    FIN_INFO_FRM: 1,
    ACC_TYPES_FRM: 2,
    FUNDING_FRM: 3,
    LINK_BANK: 4,
    ADD_FUNDS: 5,
    IDENTITY_FRM: 6,
    summary: 7,
    THANK_YOU: 8,
  });

  individualSteps = () => ({
    formLinkBankManually: 1,
    summary: 2,
    THANK_YOU: 3,
  });

  establishProfileSteps = () => ({
    EMPLOYMENT_FORM: 1,
    BROKERAGE_EMPLOYMENT_FORM: 2,
    PUBLIC_COMPANY_REL_FORM: 3,
    INVESTOR_PROFILE_FORM: 4,
    FINANCES_FORM: 4,
    INVESTMENT_EXP_FORM: 5,
  });
}

export default new Helper();
