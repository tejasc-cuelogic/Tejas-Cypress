import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import moment from 'moment';
import { Icon, Table, Accordion, Button } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import { INDUSTRY_TYPES_ICONS } from '../../../../../../constants/offering';
import { InlineLoader } from '../../../../../../theme/shared';

const investmentsMeta = ['Offering', 'Location', 'Investment Type', 'Invested Amount', 'Status'];
const InvestmentList = (props) => {
  const listHeader = [...investmentsMeta, ...(props.listOf === 'pending' ? ['Days to close'] : ['Close Date'])];
  const { investments } = props;
  return (
    <Accordion fluid styled className="card-style">
      <Accordion.Title active>
        <Icon className="ns-chevron-up" />
        {props.listOf}
      </Accordion.Title>
      <Accordion.Content active>
        {!investments || !investments.length ?
          <InlineLoader text="No data available" /> :
          <div className="table-wrapper">
            <Table unstackable singleLine className="investment-details">
              <Table.Header>
                <Table.Row>
                  {
                    listHeader.map(cell => (
                      <Table.HeaderCell key={cell.split(' ')[0]} textAlign={cell === 'Invested Amount' ? 'right' : ''}>{cell}</Table.HeaderCell>
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
                        <Link to={`${props.match.url}/investment-details/1`}>{data.name}</Link>
                      </Table.Cell>
                      <Table.Cell>{data.location}</Table.Cell>
                      <Table.Cell>{data.offering.keyTerms.securities === 'TERM_NOTE' ? 'Term Note' : 'Rev Share'}</Table.Cell>
                      <Table.Cell textAlign="right">{Helper.CurrencyFormat(data.investedAmount)}</Table.Cell>
                      <Table.Cell>{data.status}</Table.Cell>
                      <Table.Cell collapsing>{moment(props.listOf === 'pending' ? data.daysToClose : data.closeDate).format('MM/DD/YYYY')}</Table.Cell>
                      <Table.Cell collapsing>
                        {props.listOf !== 'pending' ?
                          <Button as={Link} to={`${props.match.url}/investment-details/${data.offering.id}`} size="tiny" color="green" className="ghost-button">View Details</Button>
                        :
                          <Aux>
                            <Button as={Link} to={`${props.match.url}/investment-details/${data.offering.id}`} size="tiny" color="green" className="ghost-button">Change</Button>
                            <Button as={Link} to={`${props.match.url}/investment-details/${data.offering.id}`} size="tiny" color="red" className="ghost-button">Cancel</Button>
                          </Aux>
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
                  <Table.HeaderCell textAlign="right">{Helper.CurrencyFormat(investments && investments.length ? Helper.getTotal(investments, 'investedAmount') : 0)}</Table.HeaderCell>
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
