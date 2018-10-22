import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Accordion, Progress, Button } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import { INDUSTRY_TYPES_ICONS } from '../../../../../../constants/offering';

const investmentsMeta = ['Offering', 'Location', 'Investment Type', 'Invested Amount', 'Status'];
const investments1 = [
  {
    type: 'food', name: 'MUHU Hot Pot', location: 'Houston', investmentType: 'Term Note', amount: 20000, status: 'Live', achieved: 25, closeDate: '2-12-2018',
  },
  {
    type: 'food', name: 'Intero Ristorante', location: 'New York', investmentType: 'Term Note', amount: 1500, status: 'Processing', achieved: 50, closeDate: '2-12-2018',
  },
  {
    type: 'food', name: 'The Brewers Table', location: 'San Francisco', investmentType: 'Rev Share', amount: 12000, status: 'Processing', achieved: 5, closeDate: '2-12-2018',
  },
  {
    type: 'food', name: 'Smiley Transportation', location: 'Bostan', investmentType: 'Term Note', amount: 400, status: 'Live', achieved: 25, closeDate: '2-12-2018',
  },
];

const InvestmentList = (props) => {
  const listHeader = [...investmentsMeta, ...(props.listOf === 'pending' ? ['% to goal'] : ['Close Date'])];
  const { investments } = props;
  console.log(investments1);
  return (
    <Accordion fluid styled className="card-style">
      <Accordion.Title active>
        <Icon className="ns-chevron-up" />
        {props.listOf}
      </Accordion.Title>
      <Accordion.Content active>
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
              {investments && investments.length &&
                investments.map(data => (
                  <Table.Row key={data.name}>
                    <Table.Cell>
                      <Icon className={`${INDUSTRY_TYPES_ICONS[data.offering.keyTerms.industry]} offering-icon`} />
                      <Link to={`${props.match.url}/investment-details/1`}>{data.name}</Link>
                    </Table.Cell>
                    <Table.Cell>{data.location}</Table.Cell>
                    <Table.Cell>{data.offering.keyTerms.securities === 'TERM_NOTE' ? 'Term Note' : 'Rev Share'}</Table.Cell>
                    <Table.Cell textAlign="right">${data.investedAmount}</Table.Cell>
                    <Table.Cell>{data.status}</Table.Cell>
                    {
                      props.listOf === 'pending' ?
                        <Table.Cell collapsing><Progress percent={(data.achieved || 0)} size="small" color="violet" label={`${(data.achieved || 0)}%`} /></Table.Cell> :
                        <Table.Cell>{data.closeDate || data.daysToClose}</Table.Cell>
                    }
                    <Table.Cell collapsing>
                      <Button size="tiny" color="red" className="ghost-button">Cancel</Button>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="2" />
                <Table.HeaderCell>Total:</Table.HeaderCell>
                <Table.HeaderCell textAlign="right">{investments && investments.length ? Helper.getTotal(investments, 'investedAmount') : 0}</Table.HeaderCell>
                <Table.HeaderCell colSpan="3" />
              </Table.Row>
            </Table.Footer>
          </Table>
        </div>
      </Accordion.Content>
    </Accordion>
  );
};

export default InvestmentList;
