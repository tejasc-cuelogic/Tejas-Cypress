import React from 'react';
import { Table } from 'semantic-ui-react';
import money from 'money-math';
import { PopUpModal } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;
function TransferRequestMethod(props) {
  const { isPreferredEquity,
    investmentAmount,
    changeInvest,
    getPreviousInvestedAmount,
    getCurrCashAvailable,
    getCurrCreditAvailable,
    getTransferRequestAmount } = props;

  return (
    <>
      <Table basic="very" className="confirm-transfer-table mt-30" compact>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Investment Amount:</Table.Cell>
            <Table.Cell collapsing className="right-align">
              {isPreferredEquity ? Helper.CurrencyFormat(investmentAmount) : Helper.CurrencyFormat(investmentAmount, 0)}
            </Table.Cell>
          </Table.Row>
          {changeInvest
            && (
              <Table.Row>
                <Table.Cell>Previous Investment:</Table.Cell>
                <Table.Cell collapsing className="right-align">
                  {isPreferredEquity ? Helper.CurrencyFormat(getPreviousInvestedAmount) : Helper.CurrencyFormat(getPreviousInvestedAmount, 0)}
                </Table.Cell>
              </Table.Row>
            )
          }
          <Table.Row>
            <Table.Cell>
              <PopUpModal
                wide
                customTrigger={<span className="popup-label">Available Cash:</span>}
                content="If this investment is a request to change an existing investment in this offering, then Cash Available also includes any dollars currently reserved or invested in the same offering."
                position="top center"
                showOnlyPopup={!isMobile}
              />
            </Table.Cell>
            <Table.Cell collapsing className="right-align">
              {isPreferredEquity ? Helper.CurrencyFormat(getCurrCashAvailable) : Helper.CurrencyFormat(getCurrCashAvailable, 0)}
            </Table.Cell>
          </Table.Row>
          {!money.isZero(getCurrCreditAvailable)
            && (
              <Table.Row>
                <Table.Cell>Available Credit: </Table.Cell>
                <Table.Cell collapsing className="right-align">
                  {isPreferredEquity ? Helper.CurrencyFormat(getCurrCreditAvailable) : Helper.CurrencyFormat(getCurrCreditAvailable, 0)}
                </Table.Cell>
              </Table.Row>
            )
          }
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell>Transfer Request: </Table.HeaderCell>
            <Table.HeaderCell className="positive-text right-align" collapsing>{isPreferredEquity ? Helper.CurrencyFormat(getTransferRequestAmount) : Helper.CurrencyFormat(getTransferRequestAmount, 0)}</Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
}

export default (TransferRequestMethod);
