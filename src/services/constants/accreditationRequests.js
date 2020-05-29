import React from 'react';
import { CURR_YEAR } from '../../constants/common';
import { PopUpModal } from '../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

export const FILTER_META = {
  method: {
    value: [],
    values: [
      { text: 'Select Method', key: '', value: '' },
      { text: 'All', value: 'ALL' },
      { text: 'Verifier', value: 'VERIFIER' },
      { text: 'Upload', value: 'UPLOAD' },
    ],
    error: undefined,
    rule: 'empty',
  },
  status: {
    value: [],
    values: [
      { text: 'Select Status', key: '', value: '' },
      { text: 'Requested', value: 'REQUESTED' },
      { text: 'Approved', value: 'CONFIRMED' },
      { text: 'Declined', value: 'INVALID' },
      { text: 'Expired', value: 'EXPIRED' },
    ],
    error: undefined,
    rule: 'empty',
  },
  type: {
    value: [],
    values: [
      { text: 'Select Type', key: '', value: '' },
      { text: 'All', value: 'ALL' },
      { text: 'Asset', value: 'ASSETS' },
      { text: 'Income', value: 'INCOME' },
      { text: 'Trust Assets', value: 'REVOCABLE_TRUST_ASSETS' },
      { text: 'Trust Income', value: 'REVOCABLE_TRUST_INCOME' },
      { text: 'Owners Accredited', value: 'OWNERS_ACCREDITATED' },
      { text: 'Owners Qualified', value: 'OWNERS_QUALIFIED' },
    ],
    error: undefined,
    rule: 'empty',
  },
};

export const SELF_ACCREDITATION = {
  status: {
    value: [],
    values: [
      {
        label: <>I meet the requirements to qualify as an <PopUpModal showOnlyPopup={!isMobile} customTrigger={<span className="popup-label">accredited investor</span>} content={<>You may qualify as an accredited investor if your annual income is $200k+ (or $300k+ together with your spouse) or if your net worth exceeds<br /> $1 million (excluding your primary residence). See our <a target="_blank" href="/education-center/investor/what-is-an-accredited-investor">Education Center</a> for additional details.</>} />.</>, value: '1',
      },
      {
        label: 'I understand that in order to make an investment in this offering, I will be required to provide documentation evidencing my accredited investor status.', value: '2',
      },
    ],
    error: undefined,
    rule: 'required',
  },
};

export const SELF_ACCREDITATION_PRIVATE = {
  status: {
    value: [],
    values: [
      {
        label: <>I meet the requirements to qualify as an <PopUpModal showOnlyPopup={!isMobile} customTrigger={<span className="popup-label">accredited investor</span>} content={<>You may qualify as an accredited investor if your annual income is $200k+ (or $300k+ together with your spouse) or if your net worth exceeds<br /> $1 million (excluding your primary residence). See our <a target="_blank" href="/education-center/investor/what-is-an-accredited-investor">Education Center</a> for additional details.</>} />.</>, value: '1',
      },
    ],
    error: undefined,
    rule: 'required',
  },
};

export const CONFIRM_ACCREDITATION = {
  justifyDescription: {
    value: '',
    label: 'Justify your decision',
    error: undefined,
    rule: 'required',
    placeHolder: 'Type your comment here...',
  },
  declinedMessage: {
    value: '',
    label: 'Message for User on UI',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Type your comment here...',
  },
  expiration: {
    value: `12/31/${CURR_YEAR}`,
    label: 'Expiration Date',
    placeHolder: 'Enter here',
    error: undefined,
    rule: 'futureDate|required|date',
    customErrors: {
      date: 'Date format is invalid.',
      futureDate: 'You\'ve entered a past Expiration Date',
    },
  },
  adminJustificationDocs: {
    value: '',
    label: 'Justification Documents',
    error: undefined,
    rule: 'optional',
    showLoader: false,
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
};
