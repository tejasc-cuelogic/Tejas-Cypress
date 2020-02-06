import { matchPath } from 'react-router-dom';

const LIST = [
  '/offerings/:slug/invest-now',
  '/register-investor',
  '/login',
];

const UpdateHelper = {
  showUpdateModal: path => LIST.find(i => matchPath(path, { path: i })),
};

export default UpdateHelper;
