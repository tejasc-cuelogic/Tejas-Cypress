import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Table } from 'semantic-ui-react';

@inject('businessAppReviewStore')
@observer
export default class Results extends Component {
  render() {
    const { RESULTS_FRM } = this.props.businessAppReviewStore;
    return (
      <Aux>
        <Header as="h4">
          Results
        </Header>
        <Table basic compact singleLine className="form-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell colSpan="4" textAlign="center"><b>Term Loan</b></Table.HeaderCell>
              <Table.HeaderCell colSpan="4" textAlign="center"><b>Rev Share</b></Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Term</Table.HeaderCell>
              <Table.HeaderCell>Rate</Table.HeaderCell>
              <Table.HeaderCell>DSCR</Table.HeaderCell>
              <Table.HeaderCell>Feasible</Table.HeaderCell>
              <Table.HeaderCell>Expected Pmt Amount</Table.HeaderCell>
              <Table.HeaderCell>RSL Multiple</Table.HeaderCell>
              <Table.HeaderCell>RSP</Table.HeaderCell>
              <Table.HeaderCell>DSCR</Table.HeaderCell>
              <Table.HeaderCell>Feasible</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              RESULTS_FRM.fields.data.map(result => (
                <Table.Row>
                  <Table.Cell>
                    {result.term.value}
                  </Table.Cell>
                  <Table.Cell>
                    {result.rate.value}%
                  </Table.Cell>
                  <Table.Cell>
                    {result.termLoanDscr.value}
                  </Table.Cell>
                  <Table.Cell>
                    {result.termLoanFeasible.value}
                  </Table.Cell>
                  <Table.Cell>
                    {result.expectedAmount.value}
                  </Table.Cell>
                  <Table.Cell>
                    {result.rslMultiple.value}
                  </Table.Cell>
                  <Table.Cell>
                    {result.rsp.value}%
                  </Table.Cell>
                  <Table.Cell>
                    {result.revShareDscr.value}
                  </Table.Cell>
                  <Table.Cell>
                    {result.revShareFeasible.value}
                  </Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
      </Aux>
    );
  }
}
