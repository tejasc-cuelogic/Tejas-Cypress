import React from 'react';
import { Table } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';

function TransferRequestMethod(props) {
  const { isPreferredEquity, getTransferRequestAmount, transferMethod } = props;
  return (
    <>
      <Table basic="very" className="confirm-transfer-table mt-30" compact>
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell>{transferMethod === 'ACH' ? 'Transfer Request:' : 'Wire Amount:'} </Table.HeaderCell>
            <Table.HeaderCell className="right-align" collapsing>{isPreferredEquity ? Helper.CurrencyFormat(getTransferRequestAmount) : Helper.CurrencyFormat(getTransferRequestAmount, 0)}</Table.HeaderCell>
          </Table.Row>
          {transferMethod === 'ACH'
            && (
              <Table.Row>
                <Table.HeaderCell>Transfer Date: </Table.HeaderCell>
                <Table.Cell collapsing className="right-align">
                  04/23/2020
                </Table.Cell>
              </Table.Row>
            )
          }
        </Table.Body>
      </Table>
    </>
  );
}

export default (TransferRequestMethod);
