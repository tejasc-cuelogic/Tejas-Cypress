import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Accordion, Button, Card, Header } from 'semantic-ui-react';
import { get, includes } from 'lodash';
import Helper from '../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../helper';
import { STAGES } from '../../../../../../services/constants/admin/offerings';
import { INDUSTRY_TYPES_ICONS } from '../../../../../../constants/offering';
import { DateTimeFormat, InlineLoader } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
const InvestmentList = (props) => {
  const investmentsMeta = props.listOf !== 'pending' ? ['Offering', 'Status', 'Investment Type', 'Invested Amount'] : ['Offering', 'Status', 'Investment Type', 'Invested Amount'];
  const listHeader = [...investmentsMeta, ...(props.listOf === 'pending' ? ['Days to close'] : ['Close Date'])];
  const {
    investments, match, viewAgreement, handleInvestNowClick, handleViewInvestment, isAdmin,
  } = props;
  const isActive = !props.inActiveItems.includes(props.listOf);
  return (
    <>
    {isMobile ? (
      <>
        <Card className="investment-summary investment-card">
          <Card.Header>Active</Card.Header>
          <Card.Content>
            <Accordion fluid styled>
              <Accordion.Title className="text-capitalize">
                <Header as="h6" className="mt-0">
                  <Icon className="ns-chevron-down" color="green" />
                  Business Name Here
                  <Header.Subheader>Revenue Sharing Note</Header.Subheader>
                </Header>
                $1,000.00
              </Accordion.Title>
              <Accordion.Content active>
                <Table basic="very" unstackable className="no-border campaign-card">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Interest Rate</Table.Cell>
                      <Table.Cell className="grey-header right-align">xx.x%</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Term</Table.Cell>
                      <Table.Cell className="grey-header right-align">xx months</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Close Date</Table.Cell>
                      <Table.Cell className="grey-header right-align">01/24/2019</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Principal Remaining</Table.Cell>
                      <Table.Cell className="grey-header right-align">$100.00</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                <Button className="mt-30 mb-14" primary fluid content="Open Offering Details" />
              </Accordion.Content>
            </Accordion>
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
                      <Table.Row key={data.investmentDate} onClick={() => { if (!isMobile) { handleViewInvestment(props.listOf !== 'pending' ? data.offering.id : ''); } }}>
                        <Table.Cell>
                          <Icon className={`${INDUSTRY_TYPES_ICONS[get(data, 'offering.keyTerms.industry')]} offering-icon`} />
                          <div className="offering-title">
                            {props.listOf === 'pending' && !isAdmin ? (<Link to={`/offerings/${get(data, 'offering.offeringSlug')}/overview`} target="_blank">{get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}</Link>) : (
                              <Link className={`${isMobile ? 'disable-click' : ''}`} to={`${match.url}/investment-details/${data.offering.id}`}>{get(data, 'offering.keyTerms.shorthandBusinessName') || 'N/A'}</Link>
                            )}
                            <p className="date-stamp">
                              {get(data, 'offering.keyTerms.city') || ''} {get(data, 'offering.keyTerms.state') || ''}
                            </p>
                          </div>
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
                        <Table.Cell>
                          {
                            get(data, 'offering.keyTerms.securities') === 'TERM_NOTE' ? 'Term Note' : 'Rev Share'
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
                        <Table.Cell collapsing>
                          {props.listOf === 'pending'
                            ? get(data, 'offering.closureSummary.processingDate') ? DataFormatter.diffDays(get(data, 'offering.closureSummary.processingDate'), false, true) < 0 || DataFormatter.getDateDifferenceInHoursOrMinutes(get(data, 'offering.closureSummary.processingDate'), true, true).value === 0 ? '' : (includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(get(data.offering, 'closureSummary.processingDate'), true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(get(data, 'offering.closureSummary.processingDate'), true, true).value < 48 ? `${DataFormatter.getDateDifferenceInHoursOrMinutes(get(data, 'offering.closureSummary.processingDate'), true, true).value} ${DataFormatter.getDateDifferenceInHoursOrMinutes(get(data, 'offering.closureSummary.processingDate'), true, true).label}` : DataFormatter.diffInDaysHoursMin(get(data, 'offering.closureSummary.processingDate')).diffText : 'N/A'
                            : get(data, 'offering.closureSummary.hardCloseDate') ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(get(data, 'offering.closureSummary.hardCloseDate'), false, false, false)} /> : 'N/A'}
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
