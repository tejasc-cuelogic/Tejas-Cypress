import React from 'react';

export const CAMPAIGN_KEYTERMS_SECURITIES = {
  TERM_NOTE: 'Term Note',
  REVENUE_SHARING_NOTE: 'Revenue Sharing Note',
  PREFERRED_EQUITY_506C: 'Preferred Equity',
};
export const CAMPAIGN_KEYTERMS_SECURITIES_ENUM = {
  TERM_NOTE: 'TERM_NOTE',
  REVENUE_SHARING_NOTE: 'REVENUE_SHARING_NOTE',
  PREFERRED_EQUITY_506C: 'PREFERRED_EQUITY_506C',
};
export const ROUND_TYPES_ENUM = {
  SEED: 'Seed',
  SERIES_A: 'Series A',
  SERIES_B: 'Series B',
};
export const BUSINESS_TYPE_ENUM = {
  SOLE_PROPRIETOR: 'Sole Proprietor',
  CORPORATION: 'Corporation',
  LLC: 'Limited Liability Company',
  LIMITED_PARTNERSHIP: 'Limited Partnership',
  OTHER: 'Other',
};
export const INDUSTRY_TYPES = {
  FASHION_AND_MERCHANDISING: 'Fashion and Merchandising',
  BEAUTY_AND_SPA: 'Beauty and Spa',
  FOOD_AND_BEVERAGE: 'Food and Beverage',
  REAL_ESTATE: 'Real Estate',
  FITNESS_AND_WELLNESS: 'Fitness and Wellness',
  HOSPITALITY: 'Hospitality',
  TECHNOLOGY: 'Technology',
  RESTAURANT_AND_BAR: 'Restaurant and Bar',
  BREWERY_AND_BREWPUB: 'Brewery and Brewpub',
  HEALTH_AND_WELLNESS: 'Health and Wellness',
  FITNESS: 'Fitness',
  FASHION_AND_APPAREL: 'Fashion and Apparel',
  COMMERCIAL_REAL_ESTATE: 'Commercial Real Estate',
  OTHER: 'Other',
};
export const INDUSTRY_TYPES_ICONS = {
  FASHION_AND_MERCHANDISING: 'ns-store',
  BEAUTY_AND_SPA: 'ns-beauty-spa',
  FOOD_AND_BEVERAGE: 'ns-food-light',
  REAL_ESTATE: 'ns-real-estate',
  FITNESS_AND_WELLNESS: 'ns-dumbbells',
  HOSPITALITY: 'ns-hospitality-2',
  TECHNOLOGY: 'ns-technology',
  RESTAURANT_AND_BAR: 'ns-food-light',
  BREWERY_AND_BREWPUB: 'ns-bar',
  HEALTH_AND_WELLNESS: 'ns-beauty-spa',
  FITNESS: 'ns-dumbbells',
  FASHION_AND_APPAREL: 'ns-store',
  OFFICE: 'ns-bag',
  COMMERCIAL_REAL_ESTATE: 'ns-real-estate',
  OTHER: 'ns-other',
};
export const CAMPAIGN_OFFERING_STATUS = {
  FUNDED: 'Funded',
  START_UP_PERIOD: 'Start up period',
  PRE_OPENING: 'Pre opening',
  IN_REPAYMENT: 'In repayment',
  IN_DEFAULT: 'In default',
};
export const CAMPAIGN_KEYTERMS_REGULATION = {
  FP_TX: 'Rule 147, TX',
  FP_CF: 'Reg CF - US',
  BD_CF: 'Reg CF Offering',
  BD_506C: 'Reg D Offering',
  BD_506B: 'Reg B Offering',
  BD_CF_506C: 'Parallel Offering (Reg CF & Reg D)',
};
export const CAMPAIGN_REGULATION_DETAILED = {
  REGULATION: {
    FP_TX: 'Texas Intrastate Crowdfunding',
    FP_CF: 'Regulation Crowdfunding',
    BD_CF: 'Regulation Crowdfunding',
    BD_506C: 'Regulation D 506(c)',
    BD_506B: 'Regulation D 506(b)',
    BD_CF_506C: 'Parallel Offering (Reg CF & Reg D)',
  },
  TOOLTIP: {
    FP_TX: <span>
Regulation Crowdfunding offerings allow everyone to invest.
      <a target="_blank" href="/resources/education-center">Learn more</a>
    </span>,
    FP_CF: <span>
Regulation Crowdfunding offerings allow everyone to invest.
      <a target="_blank" href="/resources/education-center">Learn more</a>
    </span>,
    BD_CF: <span>
Regulation Crowdfunding offerings allow everyone to invest.
      <a target="_blank" href="/resources/education-center">Learn more</a>
    </span>,
    BD_506C: <span>
Regulation D 506(C) offerings allow Accredited Investors to invest.
      <a target="_blank" href="/resources/education-center">Learn more</a>
    </span>,
    BD_506B: <span>
Regulation B 506(B) offerings allow Accredited Investors to invest.
      <a target="_blank" href="/resources/education-center">Learn more</a>
    </span>,
    BD_CF_506C: <span>
Parallel offerings are raising money under two different regulations. A portion of this raise is being conducted under
      <a target="_blank" href="/resources/education-center/investor/making-a-reg-d-investment">Reg D 506(C)</a>
      {' '}
and a portion is being raised under
      <a target="_blank" href="/resources/education-center/investor/making-a-reg-cf-investment">Regulation Crowdfunding</a>
    </span>,
  },
};
export const CAMPAIGN_REGULATION_ABREVIATION = {
  FP_TX: 'TX INTRASTATE',
  FP_CF: 'REG CF',
  BD_CF: 'REG CF',
  BD_506C: 'REG D 506(C)',
  BD_506B: 'REG D 506(B)',
  BD_CF_506C: 'REG CF & REG D 506(C)',
};
export const CAMPAIGN_OFFERED_BY = {
  FP_TX: 'NextSeed TX LLC',
  FP_CF: 'NextSeed US LLC',
  BD_CF: 'NextSeed Securities, LLC',
  BD_506C: 'NextSeed Securities, LLC',
  BD_506B: 'NextSeed Securities, LLC',
  BD_CF_506C: 'NextSeed Securities, LLC',
};
export const OFFERING_COMMENTS_SCOPE = {
  NEXTSEED: { title: 'Private Note', color: 'orange' },
  PUBLIC: { title: 'Public', color: 'green' },
  ISSUER: {
    titleITo: 'Note to NS', titleIFrom: 'Note from NS', titleTo: 'Note to Issuer', titleFrom: 'Note from Issuer', color: 'blue',
  },
};
export const OFFERING_ACCRDITATION_STATUS_MESSAGE = {
  PENDING: { header: 'Accreditation Verification In Review', subHeader: 'We are processing your accreditation request.  Please check back to make an investment after your accreditation has been approved.' },
  NOT_ELGIBLE: { header: 'Accreditation Verification Required', subHeader: 'You must be an accredited investor to make an investment in this offering.' },
  INACTIVE: { header: 'Accreditation Verification Required', subHeader: 'You must be an accredited investor to make an investment in this offering.' },
  EXPIRED: { header: 'Accreditation Expired - Renewal Required', subHeader: 'Your accreditation status has expired.  Please confirm the following to renew.' },
  ELGIBLE: { header: 'ELGIBLE', subHeader: '' },
};
export const CAMPAIGN_OFFERING_STAGE = {
  CREATION: 'Creation',
  LIVE: 'Live',
  LOCK: 'Lock',
  PROCESSING: 'Processing',
  FAILED: 'Failed',
  TERMINATED: 'Terminated',
  STARTUP_PERIOD: 'Startup Period',
  IN_REPAYMENT: 'Re Payment',
  COMPLETE: 'Completed',
  DEFAULT: 'Default',
};

export const OFFERING_REGULATIONS = {
  FP_TX: 'FP - TX',
  TX_CF: 'TX - CF',
  FP_CF: 'FP - CF',
  BD_CF: 'BD - CF',
  BD_506C: 'BD - 506C',
  BD_506B: 'BD - 506B',
  BD_CF_506C: 'BD - Parallel',
};
