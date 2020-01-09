import { CURR_YEAR } from '../../constants/common';

export const ACCREDITATION_FILE_UPLOAD_ENUMS = {
  individual: 'PROFILE_ACCREDITATION_INDIVIDUAL_IRA_PROCESSING',
  ira: 'PROFILE_ACCREDITATION_INDIVIDUAL_IRA_PROCESSING',
  entity: 'PROFILE_ACCREDITATION_ENTITY_PROCESSING',
};

export const UPLOAD_ASSET_ENUMS = {
  statementDoc: 'ASSETS',
  incomeDocLastYear: `INCOME_${CURR_YEAR - 1}`,
  incomeDocSecondLastYear: `INCOME_${CURR_YEAR - 2}`,
  incomeDocThirdLastYear: `INCOME_${CURR_YEAR - 3}`,
};

export const ACCREDITATION_METHOD_ENUMS = {
  INCOME: 'Income',
  ASSETS: 'Assets',
  REVOCABLE_TRUST_ASSETS: 'Trust Assets',
  REVOCABLE_TRUST_INCOME: 'Trust Income',
  OWNERS_ACCREDITATED: 'Entity Owners Accredited',
  OWNERS_QUALIFIED: 'Entity Owners Qualified',
};

export const ACCREDITATION_NETWORTH_LABEL = {
  FIVE_MILLION: '$5,000,000',
  TWENTY_FIVE_MILLION: '$25,000,000',
  TWO_MILLION: '$2,000,000',
  ONE_MILLION: '$1,000,000',
};

export const ACCREDITATION_SORT_ENUMS = {
  firstName: 'INVESTOR_NAME',
  requestDate: 'REQUESTED_DATE',
  accountType: 'ACCOUNT_TYPE',
  type: 'TYPE',
  status: 'STATUS',
  expiration: 'EXPIRATION_DATE',
  promotionCredits: 'PROMOTION_CREDITS',
};
