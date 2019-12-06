import { startCase } from 'lodash';
import { PRIVATE_NAV } from './NavigationMeta';

const ADMIN_MODULES = PRIVATE_NAV.filter(n => n.accessibleTo && n.accessibleTo.includes('admin'));
const ADMIN_TITLE_META = {};
ADMIN_MODULES.forEach((n) => {
  ADMIN_TITLE_META[`/app/${n.to}`] = `${n.title} - NextSeed`;
});

const INVESTOR_ACC_META = {};
const INVESTOR_INVESTMENT_ACC_META = {};

['individual', 'ira', 'entity'].forEach((acc) => {
  ['portfolio', 'transfer-funds', 'bank-accounts', 'transactions', 'statements'].forEach((subtab) => {
    INVESTOR_ACC_META[`/app/account-details/${acc}/${subtab}`] = `${acc === 'ira' ? 'IRA' : startCase(acc)} Account | ${startCase(subtab)} - NextSeed`;
  });
  INVESTOR_INVESTMENT_ACC_META[`/app/setup/account-creation/${acc}`] = `Create ${acc === 'ira' ? 'IRA' : startCase(acc)} Investment Account - NextSeed`;
});

export const TITLES = {
  '/offerings/': 'Investment Opportunities - NextSeed',
  '/business/how-it-works': 'How It Works | Businesses - NextSeed',
  '/business/funding-options/term-notes': 'How It Works | Businesses - NextSeed',
  '/business/funding-options/revenue-sharing-notes': 'How It Works | Businesses - NextSeed',
  '/business/funding-options/preferred-equity': 'How It Works | Businesses - NextSeed',
  '/business/process': 'How It Works | Businesses - NextSeed',
  '/business/all-inclusive': 'How It Works | Businesses - NextSeed',
  '/invest/why-nextseed': 'How It Works | Investors - NextSeed',
  '/invest/how-it-works': 'How It Works | Investors - NextSeed',
  '/invest/account-types': 'How It Works | Investors - NextSeed',
  '/invest/security': 'How It Works | Investors - NextSeed',
  '/invest/track': 'How It Works | Investors - NextSeed',
  '/about/mission': 'About Us - NextSeed',
  '/about/team': 'About Us | Team - NextSeed',
  '/about/careers': 'About Us | Careers - NextSeed',
  '/resources/insights': 'Insights and Articles - NextSeed',
  '/resources/education-center': 'Education Center - NextSeed',
  '/resources/education-center/investor': 'Investor Education Center - NextSeed',
  '/resources/education-center/business': 'Business Education Center - NextSeed',
  '/agreements/legal/terms-of-use': 'Terms of Use - NextSeed',
  '/agreements/legal/privacy-policy': 'Privacy Policy - NextSeed',
  '/agreements/legal/general-disclosures': 'General Disclosures - NextSeed',
  '/agreements/legal/general-risk-factors': 'General Risk Factors - NextSeed',
  '/agreements/legal/legal-documents': 'Legal Documents - NextSeed',
  '/login': 'Log in to NextSeed',
  '/register': 'Sign Up For Free - NextSeed',
  '/forgot-password': 'Reset Your Password - NextSeed',
  '/register-investor': 'Sign Up For Free - NextSeed',
  '/business-application/business': 'Apply - NextSeed',
  '/app/dashboard/select-application-type': 'Apply - NextSeed',
  '/app/business-application/commercial-real-estate': 'Apply - NextSeed',
  '/app/business-application/business': 'Apply - NextSeed',
  '/business-application/commercial-real-estate': 'Apply | CRE - NextSeed',
  '/business-application/questions/need-help': 'Apply | Need Help - NextSeed',
  '/app/account-settings/profile-data': 'Settings | Investor Profile - NextSeed',
  '/app/account-settings/investment-limits': 'Settings | Investment Limits - NextSeed',
  '/app/account-settings/security': 'Settings | Security - NextSeed',
  '/app/account-settings/agreements': 'Settings | Agreements - NextSeed',
  '/app/resources/welcome-packet': 'Education Center | Welcome Packet - NextSeed',
  '/app/resources/knowledge-base': 'Education Center | Knowledge Base - NextSeed',
  '/app/resources/faq': 'Education Center | FAQ - NextSeed',
  ...INVESTOR_ACC_META,
  ...ADMIN_TITLE_META,
  ...INVESTOR_INVESTMENT_ACC_META,
  '/app/setup/account-creation': 'Create Investment Account - NextSeed',
  '/app/setup': 'Investor Dashboard - NextSeed',
  '/app/referrals': 'Referrals - NextSeed',
  '/': 'Alternative Investments Made Simple - NextSeed',
};
