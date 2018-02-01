import Home from './home/containers/Home';
import Offering from './offering/containers/Offering';

export default [
  {
    path: '/offerings',
    component: Offering,
  },
  {
    path: '/',
    component: Home,
    exact: true,
  },
];
