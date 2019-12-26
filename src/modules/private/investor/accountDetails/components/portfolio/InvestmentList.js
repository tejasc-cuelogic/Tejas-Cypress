import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Accordion, Button, Card, Header } from 'semantic-ui-react';
import { get, includes } from 'lodash';
import Helper from '../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../helper';
import { STAGES } from '../../../../../../services/constants/admin/offerings';
import { INDUSTRY_TYPES_ICONS, CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';
import { DateTimeFormat, InlineLoader } from '../../../../../../theme/shared';

const INVESTMENT_CARD_META = [
  { label: 'Offering', key: 'offering.keyTerms.shorthandBusinessName', for: ['pending'] },
  { label: 'Investment Type', key: 'offering.keyTerms.securities', getRowValue: value => CAMPAIGN_KEYTERMS_SECURITIES[value], for: ['pending'] },
  { label: 'Invested Amount', key: 'investedAmount', for: ['pending'], getRowValue: value => Helper.CurrencyFormat(value) },
  { label: 'Status', key: 'offering.stage', for: ['pending', 'completed'], getRowValue: value => STAGES[value].label },
  {
    label: 'Days to close',
    key: 'offering.closureSummary.processingDate',
    for: ['pending'],
    getRowValue: value => ((DataFormatter.diffDays(value, false, true) < 0 || DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value === 0 ? '' : (includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value < 48 ? `${DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value} ${DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).label}` : DataFormatter.diffInDaysHoursMin(value).diffText)) || 'N/A',
  },
  { label: 'Interest Rate', key: 'offering.keyTerms.interestRate', for: ['active'], getRowValue: value => `${value}%` },
  { label: 'Term', key: 'offering.keyTerms.maturity', for: ['active'], getRowValue: value => `${value} months` },
  { label: 'Close Date', key: 'offering.closureSummary.hardCloseDate', for: ['active', 'completed'], getRowValue: value => <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(value, false, false, false)} /> },
  { label: 'Net Payments Received', key: 'netPaymentsReceived', for: ['completed', 'active'], getRowValue: value => `$${value}` },
  { label: 'Principal Remaining', key: 'remainingPrincipal', for: ['active'], getRowValue: value => `$${value}` }, // pending
  { label: 'Realized Multiple', key: 'realizedMultiple', getRowValue: value => `${value}x`, for: ['completed'] },
];

const InvestmentCard = ({ data, listOf, viewAgreement, isAccountFrozen, handleInvestNowClick, isAdmin, match }) => {
  const [active, setActive] = useState(false);
  const toggleAccordion = () => setActive(!active);
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
            {INVESTMENT_CARD_META.filter(i => i.for.includes(listOf)).map(row => (
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

const isMobile = document.documentElement.clientWidth < 768;
const InvestmentList = (props) => {
  const listHeader = {
    pending: ['Offering', 'Investment Type', 'Invested Amount', 'Status', 'Days to close'],
    active: ['Offering', 'Invested Amount', 'Status', 'Close Date', 'Term', 'Net Payments Received', 'Principal Remaining'],
    completed: ['Offering', 'Investment Type', 'Invested Amount', 'Status', 'Close Date', 'Net Payments Received', 'Realized Multiple'],
  }[props.listOf];

  const {
    investments, match, viewAgreement, handleInvestNowClick, handleViewInvestment, isAdmin,
  } = props;
  const isActive = !props.inActiveItems.includes(props.listOf);
  const ListTable = ({ listData }) => (
    <div className="table-wrapper">
      <Table unstackable singleLine selectable className={`investment-details ${props.listOf !== 'pending' ? 'clickable' : ''}`}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing />
            {
              listHeader.map(cell => (
                <Table.HeaderCell key={cell.split(' ')[0]}>{cell}</Table.HeaderCell>
              ))
            }
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            listData.map(data => (
              <Table.Row key={data.investmentDate} onClick={() => { if (!isMobile) { handleViewInvestment(!['active', 'pending'].includes(props.listOf) ? get(data, 'offering.offeringSlug') : ''); } }}>
                <Table.Cell>
                  <Icon className={`${INDUSTRY_TYPES_ICONS[get(data, 'offering.keyTerms.industry')]} offering-icon`} />
                </Table.Cell>
                <Table.Cell>
                  <div className="offering-title">
                  {props.listOf === 'pending' && !isAdmin ? (<Link to={`/offerings/${get(data, 'offering.offeringSlug')}/overview`} target="_blank">{get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}</Link>) : (
                    <Link className={`${isMobile ? 'disable-click' : ''}`} to={`${match.url}/investment-details/${get(data, 'offering.offeringSlug')}`}>{get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}</Link>
                  )}
                      {(get(data, 'offering.keyTerms.city') || get(data, 'offering.keyTerms.state')) && (
                        <p className="date-stamp">
                          {get(data, 'offering.keyTerms.city')} {get(data, 'offering.keyTerms.state')}
                        </p>
                      )}
                  </div>
                </Table.Cell>
                {props.listOf !== 'active'
                  && (
                    <Table.Cell>
                      {
                        get(data, 'offering.keyTerms.securities') ? CAMPAIGN_KEYTERMS_SECURITIES[get(data, 'offering.keyTerms.securities')] : '-'
                      }
                    </Table.Cell>
                  )
                }
                <Table.Cell className="text-capitalize">
                  {
                    <>
                      {Helper.CurrencyFormat(data.investedAmount)}
                      <p className="date-stamp">
                        <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(data.investmentDate, true, false, false)} />
                      </p>
                    </>
                  }
                </Table.Cell>
                <Table.Cell>
                  {
                    data && data.offering && data.offering.stage
                      ? props.listOf === 'active' ? 'Active' : data.offering.stage === 'LIVE'
                        ? get(data.offering, 'closureSummary.processingDate') && DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value <= 0 ? STAGES.PROCESSING.label
                          : get(data.offering, 'closureSummary.processingDate') && ((includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod)
                            ? STAGES.LOCK.label : STAGES[data.offering.stage].label : STAGES[data.offering.stage].label : '-'
                  }
                </Table.Cell>
                <Table.Cell collapsing>
                  {props.listOf === 'pending'
                    ? get(data, 'offering.closureSummary.processingDate') ? DataFormatter.diffDays(get(data, 'offering.closureSummary.processingDate'), false, true) < 0 || DataFormatter.getDateDifferenceInHoursOrMinutes(get(data, 'offering.closureSummary.processingDate'), true, true).value === 0 ? '' : (includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(get(data, 'offering.closureSummary.processingDate'), true, true).value < 48 ? `${DataFormatter.getDateDifferenceInHoursOrMinutes(get(data, 'offering.closureSummary.processingDate'), true, true).value} ${DataFormatter.getDateDifferenceInHoursOrMinutes(get(data, 'offering.closureSummary.processingDate'), true, true).label}` : DataFormatter.diffInDaysHoursMin(get(data, 'offering.closureSummary.processingDate')).diffText : 'N/A'
                    : get(data, 'offering.closureSummary.hardCloseDate') ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(get(data, 'offering.closureSummary.hardCloseDate'), false, false, false)} /> : 'N/A'}
                </Table.Cell>
                {props.listOf === 'active'
                  && (
                    <Table.Cell>
                      {
                        get(data, 'offering.keyTerms.maturity') ? `${data.offering.keyTerms.maturity} months` : 'N/A'
                      }
                    </Table.Cell>
                  )
                }
                {props.listOf !== 'pending'
                  && (
                    <Table.Cell>
                      {Helper.MoneyMathDisplayCurrency(get(data, 'netPaymentsReceived') || '0.00')}
                    </Table.Cell>
                  )
                }

                {props.listOf === 'active'
                  && (
                    <Table.Cell>
                      {Helper.MoneyMathDisplayCurrency(get(data, 'remainingPrincipal') || '0.00')}
                    </Table.Cell>
                  )
                }
                {props.listOf === 'completed'
                  && (
                    <Table.Cell>
                      {get(data, 'realizedMultiple') ? `${data.realizedMultiple}x` : 'N/A'}
                    </Table.Cell>
                  )
                }
                <Table.Cell collapsing>
                  {props.listOf === 'pending' && (
                    <Button.Group compact>
                      {viewAgreement && data.agreementId} {
                        <Button className="link-button mr-10" onClick={() => viewAgreement(data.agreementId)} content="View Agreement" />
                      }
                      {!props.isAccountFrozen && (!((DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value <= 0)))
                        && <Button onClick={e => handleInvestNowClick(e, data.offering.id)} primary content="Change" />
                      }
                      {(props.isAdmin || (get(data, 'offering.keyTerms.securities') !== 'REAL_ESTATE' && (!get(data, 'offering.closureSummary.processingDate') || (!(DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod)))))
                        && <Button as={Link} to={`${match.url}/cancel-investment/${data.agreementId}`} basic content="Cancel" />
                      }
                      {(!props.isAdmin && (get(data.offering, 'closureSummary.processingDate') && (DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value <= 0 || (includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod)))
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
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan={props.listOf === 'active' ? '1' : '2'} />
            <Table.HeaderCell textAlign="right">Total:</Table.HeaderCell>
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
  const keytermsSecurityTypes = Object.keys(CAMPAIGN_KEYTERMS_SECURITIES);
  if (props.listOf === 'active') {
    keytermsSecurityTypes.forEach((type) => {
      listAsPerSecurityType[type] = props.investments.filter(i => get(i, 'offering.keyTerms.securities') === type);
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
                            <ListTable listData={listAsPerSecurityType[type]} />
                          </>
                        ) : null
                      }
                    </>
                  ))
                  : <ListTable listData={props.investments} />
              }
            </Accordion.Content>
          </Accordion>
        )
      }
    </>
  );
};

export default InvestmentList;
