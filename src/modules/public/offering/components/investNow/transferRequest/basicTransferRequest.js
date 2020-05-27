import React from 'react';
import { Table } from 'semantic-ui-react';
import money from 'money-math';
import { PopUpModal } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

function BasicTransferRequest(props) {
  const { isPreferredEquity,
    investmentAmount,
    changeInvest,
    getPreviousInvestedAmount,
    getCurrCashAvailable,
    getCurrCreditAvailable,
    getTransferRequestAmount,
    isMobile,
    transferRequest } = props;
    const currentCashFormat = isPreferredEquity ? Helper.CurrencyFormat(getCurrCashAvailable) : Helper.CurrencyFormat(getCurrCashAvailable, 0);
    const currentCashAvailable = !money.isZero(getCurrCashAvailable) ? `(${currentCashFormat})` : currentCashFormat;
    const currentCreditFormat = isPreferredEquity ? Helper.CurrencyFormat(getCurrCreditAvailable) : Helper.CurrencyFormat(getCurrCreditAvailable, 0);
    const currentCreditAvailable = !money.isZero(getCurrCreditAvailable) ? `(${currentCreditFormat})` : currentCreditFormat;

  return (
    <>
      <Table basic="very" className="confirm-transfer-table unstackable mt-30 fundinvestmentTable" compact>
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
                customTrigger={<span className="popup-label">Cash Available:</span>}
                content="If this investment is a request to change an existing investment in this offering, then Cash Available also includes any dollars currently reserved or invested in the same offering."
                position="top center"
                showOnlyPopup={!isMobile}
              />
            </Table.Cell>
            <Table.Cell collapsing className="right-align">
              {currentCashAvailable}
            </Table.Cell>
          </Table.Row>
          {!money.isZero(getCurrCreditAvailable)
            && (
              <Table.Row>
                <Table.Cell>Available Credit: </Table.Cell>
                <Table.Cell collapsing className="right-align">
                  {currentCreditAvailable}
                </Table.Cell>
              </Table.Row>
            )
          }
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell>{transferRequest === 'basic' ? 'Transfer Request:' : 'Balance Required:'} </Table.HeaderCell>
            <Table.HeaderCell className="right-align" collapsing>{isPreferredEquity ? Helper.CurrencyFormat(getTransferRequestAmount) : Helper.CurrencyFormat(getTransferRequestAmount, 0)}</Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
}

export default (BasicTransferRequest);
