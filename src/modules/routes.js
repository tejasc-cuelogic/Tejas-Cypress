import Home from './home/containers/Home';
import Offering from './offering/containers/Offering';
import Invest from './invest/containers/Invest';

export default [
  {
    path: '/invest',
    component: Invest,
  },
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
