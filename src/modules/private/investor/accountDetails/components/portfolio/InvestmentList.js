import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Accordion, Button, Card, Header } from 'semantic-ui-react';
import { get, includes } from 'lodash';
import Helper from '../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../helper';
import { STAGES } from '../../../../../../services/constants/admin/offerings';
import { INDUSTRY_TYPES_ICONS, CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';
import { DateTimeFormat, InlineLoader } from '../../../../../../theme/shared';

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

const investedAmount = data => (
  <>
    {Helper.CurrencyFormat(data.investedAmount)}
    <p className="date-stamp">
      <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(data.investmentDate, true, false, false)} />
    </p>
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
      {!investmentProps.isAccountFrozen && (!((DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value <= 0)))
        && <Button onClick={e => handleInvestNowClick(e, data.offering.id)} primary content="Change" />
      }
      {(isAdmin || (get(data, 'offering.keyTerms.securities') !== 'REAL_ESTATE' && (!get(data, 'offering.closureSummary.processingDate') || (!(DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod)))))
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

const INVESTMENT_CARD_META = [
  { label: '', for: ['active', 'pending', 'completed'], children: data => <Icon className={`${INDUSTRY_TYPES_ICONS[get(data, 'offering.keyTerms.industry')]} offering-icon`} />, isMobile: false, isDesktop: true, securityType: [] },
  { label: 'Offering', key: 'offering.keyTerms.shorthandBusinessName', for: isMobile ? ['pending'] : ['active', 'pending', 'completed'], children: data => offeringName(data), isMobile: true, isDesktop: true, securityType: [] },
  { label: 'Investment Type', key: 'offering.keyTerms.securities', getRowValue: value => CAMPAIGN_KEYTERMS_SECURITIES[value], for: isMobile ? ['pending'] : ['pending', 'complete'], isMobile: true, isDesktop: true, securityType: [] },
  { label: 'Invested Amount', key: 'investedAmount', for: isMobile ? ['pending'] : ['active', 'pending', 'completed'], getRowValue: value => Helper.CurrencyFormat(value), children: data => investedAmount(data), isMobile: true, isDesktop: true, className: 'text-capitalize', securityType: [] },
  { label: 'Status', key: 'offering.stage', for: isMobile ? ['pending', 'completed'] : ['active', 'pending', 'completed'], getRowValue: value => STAGES[value].label, children: data => stageLabel(data), isMobile: true, isDesktop: true, securityType: [] },
  {
    label: 'Days to close',
    key: 'offering.closureSummary.processingDate',
    for: ['pending'],
    isMobile: true,
    isDesktop: true,
    securityType: [],
    getRowValue: value => ((DataFormatter.diffDays(value, false, true) < 0 || DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value === 0 ? '' : (includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value < 48 ? `${DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value} ${DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).label}` : DataFormatter.diffInDaysHoursMin(value).diffText)) || 'N/A',
  },
  { label: 'Interest Rate', key: 'offering.keyTerms.interestRate', for: ['active'], getRowValue: value => `${value}%`, isMobile: true, isDesktop: false, securityType: ['Term Note'] },
  { label: 'Term', key: 'offering.keyTerms.maturity', for: ['active'], getRowValue: value => `${value} months`, isMobile: true, isDesktop: true, securityType: [] },
  { label: 'Close Date', key: 'offering.closureSummary.hardCloseDate', for: ['active', 'completed'], children: data => closeDate(data), isMobile: true, isDesktop: true, securityType: [] },
  { label: 'Net Payments Received', key: 'netPaymentsReceived', for: ['completed', 'active'], getRowValue: value => `$${value}`, isMobile: true, isDesktop: true, securityType: [] },
  { label: 'Principal Remaining', key: 'remainingPrincipal', for: ['active'], getRowValue: value => `$${value}`, isMobile: true, isDesktop: true, securityType: ['Term Note'] }, // pending
  { label: 'Realized Multiple', key: 'realizedMultiple', getRowValue: value => `${value}x`, for: ['completed', 'active'], isMobile: true, isDesktop: true, securityType: ['Preferred Equity'] },
  { label: 'Payments Remaining', key: 'remainingPayment', for: ['active'], getRowValue: value => `$${value}`, isMobile: true, isDesktop: true, securityType: ['Revenue Sharing Note'] },
  {
    label: '', for: ['pending'], children: data => handleActions(data), isMobile: false, isDesktop: true, securityType: [],
  },
];


const INVESTMENT_CARD_MOBILE = INVESTMENT_CARD_META.filter(meta => meta.isMobile);

const InvestmentCard = ({ data, listOf, viewAgreement, isAccountFrozen, handleInvestNowClick, isAdmin, match }) => {
  const [active, setActive] = useState(false);
  const toggleAccordion = () => setActive(!active);
  const mobileMeta = INVESTMENT_CARD_MOBILE.filter(i => (listOf === 'active' ? i.for.includes(listOf) && (i.securityType.length === 0 || i.securityType.includes(CAMPAIGN_KEYTERMS_SECURITIES[get(data, 'offering.keyTerms.securities')])) : i.for.includes(listOf)));
  return (
    <Accordion fluid styled>
      <Accordion.Title className="text-capitalize">
        <Header as="h6" className="mt-0" onClick={toggleAccordion}>
          <Icon className={`ns-chevron-${active ? 'down' : 'right'}`} color="green" />
          {get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}
          <Header.Subheader>{CAMPAIGN_KEYTERMS_SECURITIES[get(data, 'offering.keyTerms.securities')] || 'N/A'}</Header.Subheader>
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
                  {row.getRowValue ? get(data, row.key) ? row.getRowValue(get(data, row.key)) : 'N/A'
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
            {!isAccountFrozen && (!((DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value <= 0)))
              && <Button className="mt-20" primary fluid onClick={e => handleInvestNowClick(e, data.offering.id)} content="Change Investment Amount" />
            }
            {(isAdmin || (!get(data, 'offering.closureSummary.processingDate') || (!(DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod))))
              && <Button className="mt-20 mb-30" basic fluid as={Link} to={`${match.url}/cancel-investment/${data.agreementId}`} content="Cancel" />
            }
          </>
        )}
        <br />
        {['active', 'completed'].includes(listOf) && false
          && (
            <Button className="mt-20 mb-30" primary fluid content="Open Offering Details" as={Link} to={`${match.url}/investment-details/${data.offering.id}`} />
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
      <Table unstackable singleLine selectable className={`investment-details ${props.listOf !== 'pending' ? 'clickable' : ''}`}>
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
                  <Table.Cell className={row.className}>
                    {row.children ? row.children(data)
                      : row.getRowValue ? get(data, row.key) ? row.getRowValue(get(data, row.key)) : 'N/A'
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
            <Table.HeaderCell colSpan={['active', 'completed'].includes(props.listOf) ? '1' : '2'} />
            <Table.HeaderCell>Total:</Table.HeaderCell>
            <Table.HeaderCell className="neutral-text">{Helper.CurrencyFormat(listData && listData.length ? Helper.getTotal(listData, 'investedAmount') : 0)}</Table.HeaderCell>
            <Table.HeaderCell colSpan={props.listOf === 'completed' ? '2' : '3'} />
            {props.listOf !== 'pending'
              && (
                <Table.HeaderCell>{Helper.CurrencyFormat(listData && listData.length ? Helper.getTotal(listData, 'netPaymentsReceived', false) : 0)}</Table.HeaderCell>
              )}
            {props.listOf !== 'pending' && <Table.HeaderCell colSpan="1" />}
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
  const listAsPerSecurityType = {};
  const listHeaderAsPerSecurityType = {};
  const listMetaByType = INVESTMENT_CARD_META.filter(i => i.for.includes(listOf) && i.isDesktop);
  const keytermsSecurityTypes = Object.keys(CAMPAIGN_KEYTERMS_SECURITIES);
  if (props.listOf === 'active') {
    keytermsSecurityTypes.forEach((type) => {
      listAsPerSecurityType[type] = props.investments.filter(i => get(i, 'offering.keyTerms.securities') === type);
      listHeaderAsPerSecurityType[type] = listMetaByType.filter(i => i.securityType.length === 0 || i.securityType.includes(CAMPAIGN_KEYTERMS_SECURITIES[type]));
    });
  }
  return (
    <>
      {isMobile ? (
        <>
          <Card className="investment-summary investment-card">
            <Card.Header className="text-capitalize">{`${props.listOf} (${props.listOfCount})`}</Card.Header>
            <Card.Content>
              {investments.map(data => (
                <InvestmentCard data={data} {...props} />
              ))
              }
              <p className="right-align neutral-text">Total: <b>{Helper.CurrencyFormat(investments && investments.length ? Helper.getTotal(investments, 'investedAmount') : 0)}</b></p>
            </Card.Content>
          </Card>
        </>
      ) : (
          <Accordion fluid styled className="card-style portfolio-list">
            <Accordion.Title onClick={() => props.toggleAccordion(props.listOf)} active={isActive} className="text-capitalize">
              <Icon className={`ns-chevron-${isActive ? 'up' : 'right'}`} />
              {`${props.listOf} (${props.listOfCount})`}
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
