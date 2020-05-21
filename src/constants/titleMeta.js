import { startCase } from 'lodash';
import { PRIVATE_NAV } from './NavigationMeta';

const ADMIN_MODULES = PRIVATE_NAV.filter(n => n.accessibleTo && n.accessibleTo.includes('admin'));
const ADMIN_TITLE_META = {};
ADMIN_MODULES.forEach((n) => {
  ADMIN_TITLE_META[`/dashboard/${n.to}`] = `${n.title} - NextSeed`;
});

const INVESTOR_ACC_META = {};
const INVESTOR_INVESTMENT_ACC_META = {};

['individual', 'ira', 'entity'].forEach((acc) => {
  ['portfolio', 'transfer-funds', 'bank-accounts', 'transactions', 'statements'].forEach((subtab) => {
    INVESTOR_ACC_META[`/dashboard/account-details/${acc}/${subtab}`] = `${acc === 'ira' ? 'IRA' : startCase(acc)} Account | ${startCase(subtab)} - NextSeed`;
  });
  INVESTOR_INVESTMENT_ACC_META[`/dashboard/setup/account-creation/${acc}`] = `Create ${acc === 'ira' ? 'IRA' : startCase(acc)} Investment Account - NextSeed`;
});

export const TITLES = {
  '/offerings/': 'Investment Opportunities - NextSeed',
  '/communities/': 'Communities & Partners - NextSeed',
  '/business': 'How It Works | Businesses - NextSeed',
  '/investors': 'How It Works | Investors - NextSeed',
  '/mission': 'Our Mission - NextSeed',
  '/team': 'Our Team - NextSeed',
  '/group': 'The Group - NextSeed',
  '/insights': 'Insights and Articles - NextSeed',
  '/education-center': 'Education Center - NextSeed',
  '/education-center/investor': 'Investor Education Center - NextSeed',
  '/education-center/business': 'Business Education Center - NextSeed',
  '/legal/terms-of-use': 'Terms of Use - NextSeed',
  '/legal/privacy-policy': 'Privacy Policy - NextSeed',
  '/legal/general-disclosures': 'General Disclosures - NextSeed',
  '/legal/general-risk-factors': 'General Risk Factors - NextSeed',
  '/legal/legal-documents': 'Legal Documents - NextSeed',
  '/login': 'Log in to NextSeed',
  '/register': 'Sign Up For Free - NextSeed',
  '/forgot-password': 'Reset Your Password - NextSeed',
  '/register-investor': 'Sign Up For Free - NextSeed',
  '/business-application/business': 'Apply - NextSeed',
  '/dashboard/dashboardlication/select-application-type': 'Apply - NextSeed',
  '/dashboard/business-application/commercial-real-estate': 'Apply - NextSeed',
  '/dashboard/business-application/business': 'Apply - NextSeed',
  '/business-application/commercial-real-estate': 'Apply | CRE - NextSeed',
  '/business-application/questions/need-help': 'Apply | Need Help - NextSeed',
  '/dashboard/account-settings/profile-data': 'Settings | Investor Profile - NextSeed',
  '/dashboard/account-settings/investment-limits': 'Settings | Investment Limits - NextSeed',
  '/dashboard/account-settings/security': 'Settings | Security - NextSeed',
  '/dashboard/account-settings/agreements': 'Settings | Agreements - NextSeed',
  '/dashboard/resources/welcome-packet': 'Education Center | Welcome Packet - NextSeed',
  '/dashboard/resources/knowledge-base': 'Education Center | Knowledge Base - NextSeed',
  '/dashboard/resources/faq': 'Education Center | FAQ - NextSeed',
  ...INVESTOR_ACC_META,
  ...ADMIN_TITLE_META,
  ...INVESTOR_INVESTMENT_ACC_META,
  '/dashboard/setup/account-creation': 'Create Investment Account - NextSeed',
  '/dashboard/setup': 'Investor Dashboard - NextSeed',
  '/dashboard/referrals': 'Referrals - NextSeed',
  '/': 'Alternative Investments Made Simple - NextSeed',
};
