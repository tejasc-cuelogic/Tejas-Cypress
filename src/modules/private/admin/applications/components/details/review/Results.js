import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Table, Form } from 'semantic-ui-react';
// import ManagerOverview from './ManagerOverview';
import Helper from '../../../../../../../helper/utility';

@inject('businessAppReviewStore')
@observer
export default class Results extends Component {
  render() {
    const { RESULTS_FRM } = this.props.businessAppReviewStore;
    return (
      <>
        <Header as="h4">
          Results
        </Header>
        <Table className="bg-offwhite">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell colSpan="4" textAlign="center" className="dark-cell"><b>Term Loan</b></Table.HeaderCell>
              <Table.HeaderCell colSpan="4" textAlign="center"><b>Rev Share</b></Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Term</Table.HeaderCell>
              <Table.HeaderCell className="dark-cell" textAlign="right">Rate</Table.HeaderCell>
              <Table.HeaderCell className="dark-cell">DSCR</Table.HeaderCell>
              <Table.HeaderCell className="dark-cell">Feasible</Table.HeaderCell>
              <Table.HeaderCell className="dark-cell" textAlign="right">Expected<br />Pmt Amount</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">RSL<br />Multiple</Table.HeaderCell>
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
                  <Table.Cell className="dark-cell" textAlign="right">
                    {result.rate.value}%
                  </Table.Cell>
                  <Table.Cell className="dark-cell">
                    {result.termLoanDscr.value}
                  </Table.Cell>
                  <Table.Cell className="dark-cell">
                    {result.termLoanFeasible.value}
                  </Table.Cell>
                  <Table.Cell className="dark-cell" textAlign="right">
                    {Helper.CurrencyFormat(result.expectedAmount.value)}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {Helper.CurrencyFormat(result.rslMultiple.value)}
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
        <Form>
          {/* <ManagerOverview form={MODEL_MANAGER_FRM} formName="MODEL_MANAGER_FRM" /> */}
        </Form>
      </>
    );
  }
}
