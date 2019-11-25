import { PRIVATE_NAV } from './NavigationMeta';

const ADMIN_MODULES = PRIVATE_NAV.filter(n => n.accessibleTo && n.accessibleTo.includes('admin'));
const ADMIN_TITLE_META = {};
ADMIN_MODULES.forEach((n) => {
  ADMIN_TITLE_META[`/app/${n.to}`] = `${n.title} - NextSeed`;
});


export const TITLES = {
  '/offerings/': 'Browser - NextSeed Investment Opportunities',
  '/business/how-it-works': 'Business | How it works - NextSeed',
  '/business/funding-options/term-notes': 'Business | Funding Options | Term Notes - NextSeed',
  '/business/funding-options/revenue-sharing-notes': 'Business | Funding Options | Revenue Sharing Notes - NextSeed',
  '/business/funding-options/preferred-equity': 'Business | Funding Options | Preferred Equity - NextSeed',
  '/business/process': 'Business | Process - NextSeed',
  '/business/all-inclusive': 'Business | All Inclusive - NextSeed',
  '/invest/why-nextseed': 'Invest | Why Nextseed - NextSeed',
  '/invest/how-it-works': 'Invest | How It Works - NextSeed',
  '/invest/account-types': 'Invest | Account Types - NextSeed',
  '/invest/security': 'Invest | Security - NextSeed',
  '/invest/track': 'Invest | Track - NextSeed',
  '/about/mission': 'About | Mission - NextSeed',
  '/about/team': 'About | Team - NextSeed',
  '/about/careers': 'About | Careers - NextSeed',
  '/resources/insights': 'Resources | Insights - NextSeed',
  '/resources/education-center': 'Resources | Education Center - NextSeed',
  '/resources/education-center/investor': 'Resources | Education Center | Investors - NextSeed',
  '/resources/education-center/business': 'Resources | Education Center | Business - NextSeed',
  '/agreements/legal/terms-of-use': 'Agreements | Terms of use - NextSeed',
  '/agreements/legal/privacy-policy': 'Agreements | Privacy policy - NextSeed',
  '/agreements/legal/general-disclosures': 'Agreements | General disclosures - NextSeed',
  '/agreements/legal/general-risk-factors': 'Agreements | General risk factors - NextSeed',
  '/agreements/legal/legal-documents': 'Agreements | Legal documents - NextSeed',
  '/login': 'Log in to NextSeed',
  '/register': 'Join the NextSeed community',
  '/forgot-password': 'Reset your password - NextSeed',
  '/register-investor': 'Join the NextSeed community | Sign up as an Investor',
  '/business-application/business': 'Join the NextSeed community | Pre-Qualification Application Process',
  '/business-application/commercial-real-estate': 'Join the NextSeed community | Pre-Qualification Application Process',
  '/business-application/questions/need-help': 'Join the NextSeed community | Pre-Qualification Application Process | Need Help',
  '/app/account-settings/profile-data': 'Account Settings | Profile - NextSeed',
  '/app/account-settings/investment-limits': 'Account Settings | Investment limits - NextSeed',
  '/app/account-settings/security': 'Account Settings | Security - NextSeed',
  '/app/account-settings/agreements': 'Account Settings | Agreements - NextSeed',
  '/app/resources/welcome-packet': 'Education Center | Welcome Packet - NextSeed',
  '/app/resources/knowledge-base': 'Education Center | Knowledge Base - NextSeed',
  '/app/resources/faq': 'Education Center | FAQ - NextSeed',
  '/app/summary': 'Portfolio Summary - NextSeed',
  '/app/account-details/individual/portfolio': 'Individual Account Details | Portfolio - NextSeed',
  '/app/account-details/individual/transfer-funds': 'Individual Account Details | Transfer Funds - NextSeed',
  '/app/account-details/individual/bank-accounts': 'Individual Account Details | Bank Accounts - NextSeed',
  '/app/account-details/individual/transactions': 'Individual Account Details | Transactions - NextSeed',
  '/app/account-details/individual/statements': 'Individual Account Details | Statements - NextSeed',
  '/app/account-details/ira/portfolio': 'IRA Account Details | Portfolio - NextSeed',
  '/app/account-details/ira/transfer-funds': 'IRA Account Details | Transfer Funds - NextSeed',
  '/app/account-details/ira/bank-accounts': 'IRA Account Details | Bank Accounts - NextSeed',
  '/app/account-details/ira/transactions': 'IRA Account Details | Transactions - NextSeed',
  '/app/account-details/ira/statements': 'IRA Account Details | Statements - NextSeed',
  '/app/account-details/entity/portfolio': 'Entity Account Details | Portfolio - NextSeed',
  '/app/account-details/entity/transfer-funds': 'Entity Account Details | Transfer Funds - NextSeed',
  '/app/account-details/entity/bank-accounts': 'Entity Account Details | Bank Accounts - NextSeed',
  '/app/account-details/entity/transactions': 'Entity Account Details | Transactions - NextSeed',
  '/app/account-details/entity/statements': 'Entity Account Details | Statements - NextSeed',
  ...ADMIN_TITLE_META,
  '/': 'Home - NextSeed',
};

console.log(TITLES);
