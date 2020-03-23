import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Accordion, Button, Card, Header } from 'semantic-ui-react';
import { get, includes } from 'lodash';
import money from 'money-math';
import Helper from '../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../helper';
import { STAGES } from '../../../../../../services/constants/admin/offerings';
import { INDUSTRY_TYPES_ICONS, CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM, CAMPAIGN_KEYTERMS_EQUITY_CLASS } from '../../../../../../constants/offering';
import { DateTimeFormat, InlineLoader, PopUpModal } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

let investmentProps = {};

const offeringName = (data) => {
  const { listOf, isAdmin, match } = investmentProps;
  return (
    <div className="offering-title">
      {listOf === 'pending' && !isAdmin ? (<Link to={`/offerings/${get(data, 'offering.offeringSlug')}/overview`} target="_blank">{get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}</Link>) : (
        <Link className={`${isMobile ? 'disable-click' : ''}`} to={`${match.url}/investment-details/${get(data, 'offering.offeringSlug')}`}>{get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}</Link>
      )}
      {(get(data, 'offering.keyTerms.city') || get(data, 'offering.keyTerms.state')) && (
        <p className="date-stamp">
          {get(data, 'offering.keyTerms.city')} {get(data, 'offering.keyTerms.state')}
        </p>
      )}
    </div>
  );
};

const getCOllapseCount = (maxLabel, minLabel, header) => {
  const max = header.findIndex(i => i.label === maxLabel);
  const min = header.findIndex(i => i.label === minLabel);
  return (max - min) - 1;
};

const investedAmount = data => (
  <>
    {Helper.CurrencyFormat(data.investedAmount)}
  </>
);

const stageLabel = data => (data && data.offering && data.offering.stage
  ? investmentProps.listOf === 'active' ? 'Active' : data.offering.stage === 'LIVE'
    ? get(data.offering, 'closureSummary.processingDate') && DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value <= 0 ? STAGES.PROCESSING.label
      : get(data.offering, 'closureSummary.processingDate') && ((includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod)
        ? STAGES.LOCK.label : STAGES[data.offering.stage].label : STAGES[data.offering.stage].label : '-');

const closeDate = data => (get(data, 'offering.closureSummary.hardCloseDate') ? <DateTimeFormat isCSTFormat datetime={get(data, 'offering.closureSummary.hardCloseDate')} /> : 'N/A');

const handleActions = (data) => {
  const {
    match, viewAgreement, handleInvestNowClick, isAdmin, listOf,
  } = investmentProps;
  return (listOf === 'pending' && (
    <Button.Group compact>
      {viewAgreement && data.agreementId} {
        <Button className="link-button mr-10" onClick={() => viewAgreement(data.agreementId)} content="View Agreement" />
      }
      {((!get(data, 'tranche') || get(data, 'tranche') < 1) && !investmentProps.isAccountFrozen && (!((DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value <= 0))))
        && <Button onClick={e => handleInvestNowClick(e, data.offering.offeringSlug, data.offering.id)} primary content="Change" />
      }
      {((!get(data, 'tranche') || get(data, 'tranche') < 1) && (isAdmin || ((!(get(data, 'offering.keyTerms.securities') === 'EQUITY' && get(data, 'offering.keyTerms.equityClass') === 'LLC_MEMBERSHIP_UNITS')) && (!get(data, 'offering.closureSummary.processingDate') || (!(DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod))))))
        && <Button as={Link} to={`${match.url}/cancel-investment/${data.agreementId}`} basic content="Cancel" />
      }
      {(!isAdmin && (get(data.offering, 'closureSummary.processingDate') && (DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value <= 0 || (includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod)))
        && (
          <Button
            disabled
            content={get(data.offering, 'closureSummary.processingDate') && (DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value > 0 && (includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).label) || DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod))
              ? STAGES.LOCK.label : 'Processing'}
            color="red"
          />
        )
      }
    </Button.Group>
  ));
};

const getSecurityTitle = (securities, equityClass, investorInvestedAmount, classThreshold = 0) => {
  let text = CAMPAIGN_KEYTERMS_SECURITIES[securities] || 'N/A';
  if (securities === 'EQUITY' && equityClass === 'PREFERRED') {
    text = CAMPAIGN_KEYTERMS_SECURITIES.PREFERRED_EQUITY_506C;
  } else if (securities === 'EQUITY' && equityClass === 'LLC_MEMBERSHIP_UNITS') {
    text = CAMPAIGN_KEYTERMS_SECURITIES.REAL_ESTATE;
  } else if (securities === 'EQUITY' && equityClass === 'PARALLEL_CLASS_SHARES') {
    // check conditions
    if (money.cmp(investorInvestedAmount, money.floatToAmount(classThreshold)) < 0) {
      text = CAMPAIGN_KEYTERMS_EQUITY_CLASS.CLASS_B_SHARES;
    } else {
      text = CAMPAIGN_KEYTERMS_EQUITY_CLASS.CLASS_A_SHARES;
    }
  } else if (securities === 'EQUITY' && ['CLASS_A_SHARES', 'CLASS_B_SHARES'].includes(equityClass)) {
    text = CAMPAIGN_KEYTERMS_EQUITY_CLASS[equityClass] || 'N/A';
  }
  return text;
};

const INVESTMENT_CARD_META = [
  { label: '', for: ['active', 'pending', 'completed'], children: data => <Icon className={`${INDUSTRY_TYPES_ICONS[get(data, 'offering.keyTerms.industry')]} offering-icon`} />, className: 'collapsing', isMobile: false, isDesktop: true, securityType: ['ALL'] },
  { label: 'Offering', key: 'offering.keyTerms.shorthandBusinessName', for: isMobile ? ['pending'] : ['active', 'pending', 'completed'], children: data => offeringName(data), isMobile: true, isDesktop: true, securityType: ['ALL'] },
  { label: 'Investment Type', key: 'offering.keyTerms.securities', getRowValue: (value, equityClass, investorInvestedAmount, classThreshold) => getSecurityTitle(value, equityClass, investorInvestedAmount, classThreshold), for: isMobile ? ['pending'] : ['pending', 'completed'], isMobile: true, isDesktop: true, securityType: ['ALL'] },
  { label: 'Investment Amount', key: 'investedAmount', for: isMobile ? ['pending'] : ['active', 'pending', 'completed'], getRowValue: value => Helper.CurrencyFormat(value), children: data => investedAmount(data), isMobile: true, isDesktop: true, className: 'text-capitalize', securityType: ['ALL'] },
  { label: 'Close Date', key: 'offering.closureSummary.hardCloseDate', for: ['active', 'completed'], children: data => closeDate(data), isMobile: true, isDesktop: true, securityType: ['ALL'] },
  { label: 'Investment Multiple', key: 'offering.closureSummary.keyTerms.multiple', for: ['active'], getRowValue: value => `${value}x`, isMobile: true, isDesktop: true, securityType: ['REVENUE_SHARING_NOTE'] },
  { label: 'Status', key: 'offering.stage', for: isMobile ? ['pending', 'completed'] : ['pending', 'completed'], getRowValue: value => STAGES[value].label, children: data => stageLabel(data), isMobile: true, isDesktop: true, securityType: ['ALL'] },
  {
    label: 'Days to close',
    key: 'offering.closureSummary.processingDate',
    for: ['pending'],
    isMobile: true,
    isDesktop: true,
    securityType: ['ALL'],
    getRowValue: value => ((DataFormatter.diffDays(value, false, true) < 0 || DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value === 0 ? '' : (includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value < 48 ? `${DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value} ${DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).label}` : DataFormatter.diffInDaysHoursMin(value).diffText)) || 'N/A',
  },
  { label: 'Annualized Interest Rate', key: 'offering.keyTerms.interestRate', for: ['active'], getRowValue: value => `${value}%`, isMobile: true, isDesktop: true, securityType: ['TERM_NOTE'] },
  { label: 'Term', key: 'offering.keyTerms.maturity', for: ['active'], getRowValue: value => `${value} months`, isMobile: true, isDesktop: true, securityType: ['ALL'] },
  { label: 'Net Payments Received', key: 'netPaymentsReceived', for: ['completed', 'active'], getRowValue: value => `$${value}`, isMobile: true, isDesktop: true, securityType: ['ALL'] },
  { label: 'Principal Remaining', key: 'remainingPrincipal', for: ['active'], getRowValue: value => `$${value}`, isMobile: true, isDesktop: true, securityType: ['TERM_NOTE'] }, // pending
  { label: 'Realized Multiple', key: 'realizedMultiple', getRowValue: value => `${value}x`, for: ['completed', 'active'], isMobile: true, isDesktop: true, securityType: [], equityClass: ['PREFERRED'] },
  { label: 'Payments Remaining', key: 'remainingPayment', for: ['active'], getRowValue: value => `$${value}`, isMobile: true, isDesktop: true, securityType: ['REVENUE_SHARING_NOTE'] },
  {
    label: '', for: ['pending'], children: data => handleActions(data), isMobile: false, isDesktop: true, securityType: ['ALL'],
  },
];


const INVESTMENT_CARD_MOBILE = INVESTMENT_CARD_META.filter(meta => meta.isMobile);

const InvestmentCard = ({ data, listOf, viewAgreement, isAccountFrozen, handleInvestNowClick, isAdmin, match }) => {
  const [active, setActive] = useState(false);
  const toggleAccordion = () => setActive(!active);
  const mobileMeta = INVESTMENT_CARD_MOBILE.filter(i => (listOf === 'active' ? i.for.includes(listOf)
    && (
        (i.securityType && (i.securityType.includes('ALL') || i.securityType.includes(get(data, 'offering.keyTerms.securities'))))
        || (i.equityClass && (i.equityClass.length === 0 || i.equityClass.includes(get(data, 'offering.keyTerms.equityClass'))))
      )
    : i.for.includes(listOf)));
  return (
    <Accordion fluid styled>
      <Accordion.Title className="text-capitalize">
        <Header as="h6" className="mt-0" onClick={toggleAccordion}>
          <Icon className={`ns-chevron-${active ? 'down' : 'right'}`} color="green" />
          {get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}
          <Header.Subheader>{getSecurityTitle(get(data, 'offering.keyTerms.securities'), get(data, 'offering.keyTerms.equityClass'), get(data, 'investedAmount'), get(data, 'offering.keyTerms.classThreshold'))}</Header.Subheader>
        </Header>
        {Helper.CurrencyFormat(data.investedAmount)}
      </Accordion.Title>
      <Accordion.Content active={active}>
        <Table basic="very" unstackable className="no-border campaign-card">
          <Table.Body>
            {mobileMeta.map(row => (
              <Table.Row>
                <Table.Cell collapsing>{row.label}</Table.Cell>
                <Table.Cell className="grey-header right-align">
                  {row.getRowValue ? get(data, row.key) ? row.getRowValue(get(data, row.key), get(data, 'offering.keyTerms.equityClass'), get(data, 'investedAmount'), get(data, 'offering.keyTerms.classThreshold')) : 'N/A'
                    : get(data, row.key) || 'N/A'
                  }
                </Table.Cell>
              </Table.Row>
            ))
            }
          </Table.Body>
        </Table>
        {listOf === 'pending' && (
          <>
            {viewAgreement && data.agreementId
              && (
                <Button className="mt-30 link-button" fluid content="View Agreement" onClick={() => viewAgreement(data.agreementId)} />
              )
            }
            {((!get(data, 'tranche') || get(data, 'tranche') < 1) && !isAccountFrozen && (!((DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value <= 0))))
              && <Button className="mt-20" primary fluid onClick={e => handleInvestNowClick(e, data.offering.offeringSlug, data.offering.id)} content="Change Investment Amount" />
            }
            {((!get(data, 'tranche') || get(data, 'tranche') < 1) && (isAdmin || (!get(data, 'offering.closureSummary.processingDate') || (!(DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod)))))
              && <Button className="mt-20 mb-30" basic fluid as={Link} to={`${match.url}/cancel-investment/${data.agreementId}`} content="Cancel" />
            }
          </>
        )}
        <br />
        {['active', 'completed'].includes(listOf)
          && (
            <Button className="mt-20 mb-30" primary fluid content="Open Offering Details" as={Link} to={`${match.url}/investment-details/${get(data, 'offering.offeringSlug') || ''}`} />
          )
        }
      </Accordion.Content>
    </Accordion>
  );
};

const InvestmentList = (props) => {
  const isActive = !props.inActiveItems.includes(props.listOf);
  investmentProps = { ...props };
  const {
    investments, listOf, handleViewInvestment,
  } = props;
  const ListTable = ({ listData, header }) => (
    <div className="table-wrapper">
      <Table verticalAlign="middle" unstackable singleLine selectable className={`investment-details ${props.listOf !== 'pending' ? 'clickable' : ''}`}>
        <Table.Header>
          <Table.Row>
            {
              header.map(col => (
                <Table.HeaderCell key={col.label}>{col.label}</Table.HeaderCell>
              ))
            }
          </Table.Row>
        </Table.Header>
        {
          <Table.Body>
            {listData.map(data => (
              <Table.Row key={data.investmentDate} onClick={() => { if (!isMobile) { handleViewInvestment(!['active', 'pending'].includes(props.listOf) ? get(data, 'offering.offeringSlug') : ''); } }}>
                {header.map(row => (
                  <Table.Cell verticalAlign="middle" className={row.className}>
                    {row.children ? row.children(data)
                      : row.getRowValue ? get(data, row.key) ? row.getRowValue(get(data, row.key), get(data, 'offering.keyTerms.equityClass'), get(data, 'investedAmount'), get(data, 'offering.keyTerms.classThreshold')) : 'N/A'
                        : get(data, row.key) || 'N/A'
                    }
                  </Table.Cell>
                ))
                }
              </Table.Row>
            ))
            }
          </Table.Body>
        }

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="2" />
            <Table.HeaderCell>Total:</Table.HeaderCell>
            <Table.HeaderCell className="neutral-text">{Helper.CurrencyFormat(listData && listData.length ? Helper.getTotal(listData, 'investedAmount') : 0)}</Table.HeaderCell>
<<<<<<< HEAD
            <Table.HeaderCell colSpan={props.listOf === 'completed' ? '2' : props.listOf === 'active' ? getCOllapseCount('Net Payments Received', 'Investment Amount', header) : '3'} />
=======
            {props.listOf === 'completed' && <Table.HeaderCell colSpan="2" />}
>>>>>>> a43e1003eeb893071dc2c1330d18ab9e7e3303a9
            {props.listOf !== 'pending'
              && (
                <Table.HeaderCell>{Helper.CurrencyFormat(listData && listData.length ? Helper.getTotal(listData, 'netPaymentsReceived', false) : 0)}</Table.HeaderCell>
              )}
            {props.listOf === 'pending' && <Table.HeaderCell colSpan="3" />}
            {props.listOf === 'completed' && <Table.HeaderCell colSpan="1" />}
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
  const listAsPerSecurityType = {};
  const listHeaderAsPerSecurityType = {};
  const listMetaByType = INVESTMENT_CARD_META.filter(i => ((i.for.includes(listOf) && i.isDesktop)));
  const keytermsSecurityTypes = Object.keys(CAMPAIGN_KEYTERMS_SECURITIES_ENUM);
  if (props.listOf === 'active') {
    keytermsSecurityTypes.forEach((type) => {
      listAsPerSecurityType[type] = props.investments.filter(i => get(i, 'offering.keyTerms.securities') === type);
      listHeaderAsPerSecurityType[type] = listMetaByType.filter(i => i.securityType.includes('ALL') || i.securityType.includes(type));
    });
  }
  return (
    <>
      {isMobile ? (
        <>
          <Card className="investment-summary investment-card">
            {props.listOf === 'pending'
              ? (
                <Card.Header className="text-capitalize">
                  <PopUpModal
                    customTrigger={<span className="popup-label">{`${props.listOf} (${props.listOfCount})`}</span>}
                    content="These are your investments in Live or Processing campaigns. Your investment has been reserved and will move to Active when the campaign has been closed."
                    position="top center"
                  />
                </Card.Header>
              ) : (
                <Card.Header className="text-capitalize"><span>{`${props.listOf} (${props.listOfCount})`}</span></Card.Header>
              )
            }
            <Card.Content>
              {investments.map(data => (
                <InvestmentCard data={data} {...props} />
              ))}
              <p className="right-align neutral-text">Total: <b>{Helper.CurrencyFormat(investments && investments.length ? Helper.getTotal(investments, 'investedAmount') : 0)}</b></p>
            </Card.Content>
          </Card>
        </>
      ) : (
          <Accordion fluid styled className="card-style portfolio-list">
            <Accordion.Title onClick={() => props.toggleAccordion(props.listOf)} active={isActive} className="text-capitalize">
              <Icon className={`ns-chevron-${isActive ? 'up' : 'right'}`} />
              {props.listOf === 'pending'
              ? (
                <PopUpModal
                  customTrigger={<span className="popup-label">{`${props.listOf} (${props.listOfCount})`}</span>}
                  content="These are your investments in Live or Processing campaigns. Your investment has been reserved and will move to Active when the campaign has been closed."
                  position="top center"
                  showOnlyPopup={!isMobile}
                />
              ) : (
                <span>{`${props.listOf} (${props.listOfCount})`}</span>
              )
            }
            </Accordion.Title>
            <Accordion.Content className="bg-offwhite" active={!props.inActiveItems.includes(props.listOf)}>
              {!investments || !investments.length
                ? <InlineLoader text="No data available" />
                : props.listOf === 'active'
                  ? keytermsSecurityTypes.map(type => (
                    <>
                      {listAsPerSecurityType[type] && listAsPerSecurityType[type].length
                        ? (
                          <>
                            <Header as="h5" className="investment-list" content={CAMPAIGN_KEYTERMS_SECURITIES[type]} />
                            <ListTable listData={listAsPerSecurityType[type]} header={listHeaderAsPerSecurityType[type]} />
                          </>
                        ) : null
                      }
                    </>
                  ))
                  : <ListTable listData={props.investments} header={listMetaByType} />
              }
            </Accordion.Content>
          </Accordion>
        )
      }
    </>
  );
};

export default InvestmentList;
