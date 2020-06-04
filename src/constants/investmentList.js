// export const TERM_NOTE_TABLE_META = ['Investment Amount', 'Close Date', 'Annualized Interest Rate', 'Term', 'Net Payments Received', 'Principal Remaining'];

// export const REV_SHARE_TABLE_META = ['Investment Amount', 'Close Date', 'Investment Multiple', 'Term', 'Net Payments Received', 'Payments Remaining'];

// export const EQUITY_CLASS_TABLE_META = ['Investment Amount', 'Close Date', 'Share/ Unit Pice', '# of Shares/Units', 'Net Payments Received', 'Realized Multiple'];

// export const CONVERTIBLE_SECURITIES_TABLE_META = ['Investment Amount', 'Close Date', 'Security Type', 'Market Cap', 'Discount', 'Interest Rate', 'Maturity Date'];

// export const INVESTMENT_CARD_META = [
//   {
//     label: 'Investment Amount',
//     key: 'investedAmount',
//     for: ['active', 'pending', 'completed'],
//     isMobile: true,
//     isDesktop: true,
//     className: 'text-capitalize',
//     securityType: ['ALL'],
//     getRowValue: value => Helper.CurrencyFormat(value),
//     children: data => investedAmount(data),
//   },
//   {
//     label: 'Close Date',
//     key: 'offering.closureSummary.hardCloseDate',
//     for: ['active', 'completed'],
//     isMobile: true,
//     isDesktop: true,
//     securityType: ['ALL'],
//     children: data => closeDate(data),
//   },
//   {
//     label: 'Annualized Interest Rate',
//     key: 'offering.keyTerms.interestRate',
//     for: ['active'],
//     isMobile: true,
//     isDesktop: true,
//     securityType: ['TERM_NOTE'],
//     getRowValue: value => `${value}%`,
//   },
//   {
//     label: 'Investment Multiple',
//     key: 'offering.closureSummary.keyTerms.multiple',
//     for: ['active'],
//     isMobile: true,
//     isDesktop: true,
//     securityType: ['REVENUE_SHARING_NOTE'],
//     getRowValue: value => `${value}x`,
//   },
//   {
//     label: 'Investment Type',
//     key: 'offering.keyTerms.securities',
//     for: data => isMobile ? ['SAFE', 'CONVERTIBLE_NOTES'].includes(get(data, 'offering.keyTerms.securities')) ? ['pending', 'active'] : ['pending'] : ['pending', 'completed'],
//     isMobile: true,
//     isDesktop: true,
//     securityType: ['ALL'],
//     getRowValue: (value, equityClass, investorInvestedAmount, classThreshold) => getSecurityTitle(value, equityClass, investorInvestedAmount, classThreshold),
//   },
//   {
//     label: 'Net Payments Received',
//     key: 'netPaymentsReceived',
//     for: ['completed', 'active'],
//     isMobile: true,
//     isDesktop: true,
//     securityType: ['ALL'],
//     getRowValue: value => `$${value}`,
//   },
//   {
//     label: 'Principal Remaining',
//     key: 'remainingPrincipal',
//     for: ['active'],
//     isMobile: true,
//     isDesktop: true,
//     securityType: ['TERM_NOTE'],
//     getRowValue: value => `$${value}`,
//   },
//   {
//     label: 'Payments Remaining',
//     key: 'remainingPayment',
//     for: ['active'],
//     isMobile: true,
//     isDesktop: true,
//     securityType: ['REVENUE_SHARING_NOTE'],
//     getRowValue: value => `$${value}`,
//   },
//   {
//     label: 'Realized Multiple',
//     key: 'realizedMultiple',
//     for: ['completed', 'active'],
//     isMobile: true,
//     isDesktop: true,
//     securityType: [],
//     equityClass: ['PREFERRED'],
//     getRowValue: value => `${value}x`,
//   },
// ]