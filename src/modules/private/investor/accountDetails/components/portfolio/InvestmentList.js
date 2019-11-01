import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Accordion, Button, Card, Header } from 'semantic-ui-react';
import { get, includes, capitalize } from 'lodash';
import Helper from '../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../helper';
import { STAGES } from '../../../../../../services/constants/admin/offerings';
import { INDUSTRY_TYPES_ICONS, CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';
import { DateTimeFormat, InlineLoader } from '../../../../../../theme/shared';

const INVESTMENT_CARD_META = [
  { label: 'Offering', key: 'offering.keyTerms.shorthandBusinessName', for: ['pending'] },
  { label: 'Investment Type', key: 'offering.keyTerms.securities', getRowValue: value => CAMPAIGN_KEYTERMS_SECURITIES[value], for: ['pending'] },
  { label: 'Invested Amount', key: 'investedAmount', for: ['pending'], getRowValue: value => Helper.CurrencyFormat(value) },
  { label: 'Status', key: 'offering.stage', for: ['pending'], getRowValue: value => STAGES[value].label },
  {
    label: 'Days to close',
    key: 'offering.closureSummary.processingDate',
    for: ['pending'],
    getRowValue: value => ((DataFormatter.diffDays(value, false, true) < 0 || DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value === 0 ? '' : (includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value < 48 ? `${DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).value} ${DataFormatter.getDateDifferenceInHoursOrMinutes(value, true, true).label}` : DataFormatter.diffInDaysHoursMin(value).diffText)) || 'N/A',
  },
  { label: 'Interest Rate', key: 'offering.keyTerms.interestRate', for: ['active', 'completed'], getRowValue: value => `${value}%` },
  { label: 'Term', key: 'offering.keyTerms.maturity', for: ['active', 'completed'], getRowValue: value => `${value} months` },
  { label: 'Close Date', key: 'offering.closureSummary.hardCloseDate', for: ['active', 'completed'], getRowValue: value => <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(value, false, false, false)} /> },
  { label: 'Principal Remaining', key: '', for: ['active', 'completed'] }, // pending
];

const InvestmentCard = ({ data, listOf, viewAgreement, isAccountFrozen, handleInvestNowClick, isAdmin, match }) => {
  const [active, setActive] = useState(false);
  const toggleAccordion = () => setActive(!active);
  return (
<Accordion fluid styled>
    <Accordion.Title className="text-capitalize">
      <Header as="h6" className="mt-0" onClick={toggleAccordion}>
        <Icon className={`ns-chevron-${active ? 'up' : 'down'}`} color="green" />
        {get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}
        <Header.Subheader>{CAMPAIGN_KEYTERMS_SECURITIES[get(data, 'offering.keyTerms.securities')] || 'N/A'}</Header.Subheader>
      </Header>
      {Helper.CurrencyFormat(data.investedAmount, 0)}
    </Accordion.Title>
    <Accordion.Content active={active}>
      <Table basic="very" unstackable className="no-border campaign-card">
        <Table.Body>
          {INVESTMENT_CARD_META.filter(i => i.for.includes(listOf)).map(row => (
            <Table.Row>
              <Table.Cell>{row.label}</Table.Cell>
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
        <Button className="mt-30 mb-30 link-button" fluid content="View Agreement" onClick={() => viewAgreement(data.agreementId)} />
      )
      }
      {!isAccountFrozen && (!((DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value <= 0)))
        && <Button className="mt-30 mb-30" primary fluid onClick={e => handleInvestNowClick(e, data.offering.id)} content="Change Investment Amount" />
      }
      {(isAdmin || (!get(data, 'offering.closureSummary.processingDate') || (!(DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod))))
        && <Button className="mt-30 mb-30" basic fluid as={Link} to={`${match.url}/cancel-investment/${data.agreementId}`} content="Cancel" />
      }
        </>
      )}
      {['active', 'completed'].includes(listOf)
      && (
        <Button className="mt-30 mb-30" primary fluid content="Open Offering Details" as={Link} to={`${match.url}/investment-details/${data.offering.id}`} />
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
    active: ['Offering', 'Investment Type', 'Invested Amount', 'Status', 'Close Date', 'Term', 'Net Payments Received'],
    completed: ['Offering', 'Investment Type', 'Invested Amount', 'Status', 'Close Date', 'Net Payments Received'],
  }[props.listOf];

  const {
    investments, match, viewAgreement, handleInvestNowClick, handleViewInvestment, isAdmin,
  } = props;
  const isActive = !props.inActiveItems.includes(props.listOf);
  return (
    <>
    {isMobile ? (
      <>
        <Card className="investment-summary investment-card">
          <Card.Header>{capitalize(props.listOf)}</Card.Header>
          <Card.Content>
            {investments.map(data => (
              <InvestmentCard data={data} {...props} />
            ))
            }
            <p className="right-align neutral-text">Total: <b>{Helper.CurrencyFormat(investments && investments.length ? Helper.getTotal(investments, 'investedAmount') : 0, 0)}</b></p>
          </Card.Content>
        </Card>
      </>
    ) : (
      <Accordion fluid styled className="card-style">
      <Accordion.Title onClick={() => props.toggleAccordion(props.listOf)} active={isActive} className="text-capitalize">
        <Icon className={`ns-chevron-${isActive ? 'up' : 'down'}`} />
        {`${props.listOf} (${props.listOfCount})`}
      </Accordion.Title>
      <Accordion.Content active={!props.inActiveItems.includes(props.listOf)}>
        {!investments || !investments.length
          ? <InlineLoader text="No data available" />
          : (
            <div className="table-wrapper">
              <Table unstackable singleLine selectable className={`investment-details ${props.listOf !== 'pending' ? 'clickable' : ''}`}>
                <Table.Header>
                  <Table.Row>
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
                    investments.map(data => (
                      <Table.Row key={data.investmentDate} onClick={() => { if (!isMobile) { handleViewInvestment(!['active', 'pending'].includes(props.listOf) ? data.offering.id : ''); } }}>
                        <Table.Cell>
                          <Icon className={`${INDUSTRY_TYPES_ICONS[get(data, 'offering.keyTerms.industry')]} offering-icon`} />
                          <div className="offering-title">
                            {props.listOf === 'pending' && !isAdmin ? (<Link to={`/offerings/${get(data, 'offering.offeringSlug')}/overview`} target="_blank">{get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}</Link>) : (props.listOf === 'active' && !isAdmin)
                              ? (<p>{get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}</p>) : (
                              <Link className={`${isMobile ? 'disable-click' : ''}`} to={`${match.url}/investment-details/${data.offering.id}`}>{get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}</Link>
                              )}
                            <p className="date-stamp">
                              {get(data, 'offering.keyTerms.city') || ''} {get(data, 'offering.keyTerms.state') || ''}
                            </p>
                          </div>
                        </Table.Cell>

                        <Table.Cell>
                          {
                            CAMPAIGN_KEYTERMS_SECURITIES[get(data, 'offering.keyTerms.securities')] || 'N/A'
                          }
                        </Table.Cell>
                        <Table.Cell className="text-capitalize">
                          {
                            <>
                              {Helper.CurrencyFormat(data.investedAmount, 0)}
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

                        <Table.Cell>
                          {
                            get(data, 'netPaymentsReceived') || 'N/A'
                          }
                        </Table.Cell>
                        <Table.Cell collapsing>
                          {props.listOf === 'pending' && (
                            <Button.Group size="mini" compact>
                              {viewAgreement && data.agreementId} {
                                <Button onClick={() => viewAgreement(data.agreementId)} secondary content="View Agreement" />
                              }
                              {!props.isAccountFrozen && (!((DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value <= 0)))
                                && <Button onClick={e => handleInvestNowClick(e, data.offering.id)} primary content="Change" />
                              }
                              {(props.isAdmin || (!get(data, 'offering.closureSummary.processingDate') || (!(DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).isLokinPeriod))))
                                && <Button as={Link} to={`${match.url}/cancel-investment/${data.agreementId}`} color="red" content="Cancel" />
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
                    <Table.HeaderCell colSpan="2" />
                    <Table.HeaderCell>Total:</Table.HeaderCell>
                    <Table.HeaderCell>{Helper.CurrencyFormat(investments && investments.length ? Helper.getTotal(investments, 'investedAmount') : 0, 0)}</Table.HeaderCell>
                    <Table.HeaderCell colSpan="3" />
                  </Table.Row>
                </Table.Footer>
              </Table>
            </div>
          )
        }
      </Accordion.Content>
    </Accordion>
    )
    }
    </>
  );
};

export default InvestmentList;
