import React from 'react';
import { Grid } from 'semantic-ui-react';
// import Helper from '../../../../../../helper/utility';

function TransferRequestMethod(props) {
  // const { isPreferredEquity, getTransferRequestAmount, transferMethod, accountDetailsMeta } = props;
  console.log(props);
  return (
    <>
    <Grid columns="equal">
      <Grid.Row className="mt-60">
        <Grid.Column>
          <p><b>Wire Amount</b></p>
        </Grid.Column>
        <Grid.Column>
          <p className="right-align"><b>$ 20,000</b></p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className="mt-60">
        <Grid.Column>
          <p><b>Wire Instructions:</b></p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <p>Please print these instructions for your records
          A copy will also been sent to you via email after you confirm.
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={5}>
          <p className="mb-0">Happy State Bank</p>
          <p className="mb-0">100 E. Main Street</p>
          <p className="mb-0">Happy, Texas  79042</p>
        </Grid.Column>
        <Grid.Column width={10}>
          <p className="mb-0">Routing Number: 111310870</p>
          <p className="mb-0">Account Number: 6002000773</p>
          <p className="mb-0">Memo - For further credit to: Goldstar Trust Operating</p>
          <p className="mb-0">FBO: $</p>
       </Grid.Column>
      </Grid.Row>
    </Grid>

      {/* <Table basic="very" className="confirm-transfer-table mt-30" compact>
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell colspan="6">{transferMethod === 'ACH' ? 'Transfer Request:' : 'Wire Amount:'} </Table.HeaderCell>
            <Table.HeaderCell className="right-align" collapsing>{isPreferredEquity ? Helper.CurrencyFormat(getTransferRequestAmount) : Helper.CurrencyFormat(getTransferRequestAmount, 0)}</Table.HeaderCell>
          </Table.Row>
          {transferMethod === 'ACH'
            && (
              <Table.Row>
                <Table.HeaderCell colspan="6">Transfer Date: </Table.HeaderCell>
                <Table.Cell collapsing className="right-align">
                  04/23/2020
                </Table.Cell>
              </Table.Row>
            )
          }
          {transferMethod === 'WIRE'
            && (
              <>
                <Table.Row>
                  <Table.HeaderCell colspan="6">Wire Instructions: </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell colspan="6">
                    Please print these instructions for your records.
                    A copy will also been sent to you via email after you confirm.
                </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <p className="mb-0">Happy State Bank</p>
                    <p className="mb-0">100 E. Main Street</p>
                    <p className="mb-0">Happy, Texas 79042</p>
                  </Table.Cell>
                  <Table.Cell collapsing></Table.Cell>
                  <Table.Cell>
                    <p className="mb-0">Routing Number: 111310870</p>
                    <p className="mb-0">Account Number: 6002000773</p>
                    <p className="mb-0">Memo - For further credit to: Goldstar Trust Operating</p>
                    <p className="mb-0">{`FBO: ${accountDetailsMeta.userFullName} ${accountDetailsMeta.goldstarAccountNumber}`}</p>
                  </Table.Cell>
                </Table.Row>
              </>
            )
          }
        </Table.Body>
      </Table> */}
      </>
  );
}

export default (TransferRequestMethod);
