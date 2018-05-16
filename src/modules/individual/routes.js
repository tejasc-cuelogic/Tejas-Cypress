import Portfolio from './containers/Portfolio';
import TransferFunds from './containers/TransferFunds';
import BankAccount from './containers/BankAccount';
import Transactions from './containers/Transactions';
import Statements from './containers/Statements';

export default [
  {
    path: '/app/individual/portfolio',
    component: Portfolio,
    name: 'Portfolio',
  },
  {
    path: '/app/individual/transferfunds',
    component: TransferFunds,
    name: 'Transfer Funds',
  },
  {
    path: '/app/individual/bankaccount',
    component: BankAccount,
    name: 'Bank Account',
  },
  {
    path: '/app/individual/transactions',
    component: Transactions,
    name: 'Transactions',
  },
  {
    path: '/app/individual/statements',
    component: Statements,
    name: 'Statements',
  },
];
