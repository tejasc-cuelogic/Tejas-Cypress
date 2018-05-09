import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Accordion, Progress, Button } from 'semantic-ui-react';

const investmentsMeta = ['Offering', 'Location', 'Investment Type', 'Invested Amount', 'Status'];
const investments = [
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
  return (
    <Accordion fluid styled className="card-style">
      <Accordion.Title active>
        <Icon className="ns-chevron-up" />
        {props.listOf}
      </Accordion.Title>
      <Accordion.Content active>
        <div className="table-wrapper">
          <Table singleLine className="investment-details">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                {listHeader.map(cell => <Table.HeaderCell textAlign={cell === 'Invested Amount' ? 'right' : ''}>{cell}</Table.HeaderCell>)}
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                investments.map(data => (
                  <Table.Row key={data.name}>
                    <Table.Cell />
                    <Table.Cell>
                      <Icon className={`ns-${data.type} offering-icon`} />
                      <Link to="/app/individual-account" onClick={() => this.props.uiStore.setModalStatus('InvestmentDetails')}>{data.name}</Link>
                    </Table.Cell>
                    <Table.Cell>{data.location}</Table.Cell>
                    <Table.Cell>{data.investmentType}</Table.Cell>
                    <Table.Cell textAlign="right">${data.amount}</Table.Cell>
                    <Table.Cell>{data.status}</Table.Cell>
                    {
                      props.listOf === 'pending' ?
                        <Table.Cell collapsing><Progress percent={data.achieved} size="small" color="violet" label={`${data.achieved}%`} /></Table.Cell> :
                        <Table.Cell>{data.closeDate}</Table.Cell>
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
                <Table.HeaderCell />
                <Table.HeaderCell colSpan="3">Total:</Table.HeaderCell>
                <Table.HeaderCell textAlign="right">$33,900</Table.HeaderCell>
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
