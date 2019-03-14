import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Accordion, Button } from 'semantic-ui-react';
import { get } from 'lodash';
import Helper from '../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../helper';
import { STAGES } from '../../../../../../services/constants/admin/offerings';
import { INDUSTRY_TYPES_ICONS } from '../../../../../../constants/offering';
import { DateTimeFormat, InlineLoader } from '../../../../../../theme/shared';

const investmentsMeta = ['Offering', 'Location', 'Investment Type', 'Invested Amount', 'Status'];
const InvestmentList = (props) => {
  const listHeader = [...investmentsMeta, ...(props.listOf === 'pending' ? ['Days to close'] : ['Close Date'])];
  const { investments, match } = props;
  const isActive = !props.inActiveItems.includes(props.listOf);
  return (
    <Accordion fluid styled className="card-style">
      <Accordion.Title onClick={() => props.toggleAccordion(props.listOf)} active={isActive} className="text-capitalize">
        <Icon className={`ns-chevron-${isActive ? 'up' : 'down'}`} />
        {`${props.listOf} (${props.listOfCount})`}
      </Accordion.Title>
      <Accordion.Content active={!props.inActiveItems.includes(props.listOf)}>
        {!investments || !investments.length ?
          <InlineLoader text="No data available" /> :
          <div className="table-wrapper">
            <Table unstackable singleLine className="investment-details">
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
                    <Table.Row key={data.name}>
                      <Table.Cell>
                        <Icon className={`${INDUSTRY_TYPES_ICONS[data.offering.keyTerms.industry]} offering-icon`} />
                        {props.listOf === 'pending' ? (<Link to={`/offerings/${data.offering.offeringSlug}/overview`} target="_blank">{data.offering.keyTerms.shorthandBusinessName}</Link>) : (
                          <Link to={`${match.url}/investment-details/${data.offering.id}`}>{data.offering.keyTerms.shorthandBusinessName}</Link>
                        )}
                      </Table.Cell>
                      <Table.Cell>{data.offering.keyTerms.city ? `${data.offering.keyTerms.city}, ` : ''}{data.offering.keyTerms.state}</Table.Cell>
                      <Table.Cell>{data.offering.keyTerms.securities === 'TERM_NOTE' ? 'Term Note' : 'Rev Share'}</Table.Cell>
                      <Table.Cell>
                        {Helper.MoneyMathDisplayCurrency(data.investedAmount)}
                        <p className="date-stamp">
                          <DateTimeFormat format="MM/DD/YYYY" datetime={data.investmentDate} />
                        </p>
                      </Table.Cell>
                      <Table.Cell className="text-capitalize">
                        {data && data.offering && data.offering.stage ?
                          STAGES[data.offering.stage].label : '-'
                        }
                      </Table.Cell>
                      <Table.Cell collapsing>
                        {props.listOf === 'pending' ? `${DataFormatter.diffDays(data && data.offering && data.offering.offering &&
                          data.offering.offering.launch &&
                          data.offering.offering.launch.terminationDate ?
                          data.offering.offering.launch.terminationDate : null)} days`
                          :
                        <DateTimeFormat format="MM/DD/YYYY" datetime={get(data, 'offering.offering.launch.terminationDate')} />}
                      </Table.Cell>
                      <Table.Cell collapsing>
                        {props.listOf !== 'pending' ?
                          DataFormatter.diffDays(data && data.offering &&
                            data.offering.offering && data.offering.offering.launch &&
                            data.offering.offering.launch.terminationDate ?
                            data.offering.offering.launch.terminationDate : null) <= 0 ?
                              <Button as={Link} to={`${match.url}/investment-details/${data.offering.id}`} primary compact size="mini" content="View Details" />
                            :
                            null
                          :
                            <Button.Group size="mini" compact>
                              <Button as={Link} to={`${match.url}/${data.offering.id}/invest-now`} primary content="Change" />
                              {DataFormatter.diffDays(data && data.offering &&
                                data.offering.offering && data.offering.offering.launch &&
                                data.offering.offering.launch.terminationDate ?
                                data.offering.offering.launch.terminationDate : null) > 2 &&
                                <Button as={Link} to={`${match.url}/cancel-investment/${data.agreementId}`} color="red" content="Cancel" />
                              }
                            </Button.Group>
                        }
                      </Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="2" />
                  <Table.HeaderCell>Total:</Table.HeaderCell>
                  <Table.HeaderCell>{Helper.MoneyMathDisplayCurrency(investments && investments.length ? Helper.getTotal(investments, 'investedAmount') : 0)}</Table.HeaderCell>
                  <Table.HeaderCell colSpan="3" />
                </Table.Row>
              </Table.Footer>
            </Table>
          </div>
        }
      </Accordion.Content>
    </Accordion>
  );
};

export default InvestmentList;
