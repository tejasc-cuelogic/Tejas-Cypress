import { matchPath } from 'react-router-dom';

const LIST = [
  '/register',
  '/register-investor',
  '/confirm-email',
  '/dashboard/setup/*',
  '/business-application/*',
  '/offerings/:slug/invest-now',
  '/offerings/:slug/invest-now/*',
  '/dashboard/account-settings/investment-limits/verify-accreditation/*',
];

const UpdateHelper = {
  showUpdateModal: path => LIST.find(i => matchPath(path, { path: i })),
};

export default UpdateHelper;

// pratik.cuelogic+441@nextseed.com qqqqqqqq!
