import React from 'react';
import { Table, Grid, Responsive } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';

function TransferRequestMethod(props) {
  const { isPreferredEquity, getTransferRequestAmount, transferMethod, accountDetailsMeta, isMobile } = props;
  return (
    <>
      {transferMethod === 'ACH'
        && (
          <Table basic="very" className="bg-offwhite unstackable pb-20 pt-20 mt-30 pl-30 pr-30 confirm-transfer-table" compact>
            <Table.Body>
              <Table.Row>
                <Table.HeaderCell colspan="6">Transfer Request: </Table.HeaderCell>
                <Table.HeaderCell className="right-align" collapsing>{isPreferredEquity ? Helper.CurrencyFormat(getTransferRequestAmount) : Helper.CurrencyFormat(getTransferRequestAmount, 0)}</Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell colspan="6">Transfer Date: </Table.HeaderCell>
                <Table.Cell collapsing className="right-align">
                  04/23/2020
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )
      }
      {transferMethod === 'WIRE'
          && (
            <>
              <Grid columns="equal">
                <Grid.Row className={`bg-offwhite pb-20 pt-20 ${isMobile ? 'mt-20 mr-10 ml-10 pl-10 pr-10' : 'mt-30 pl-30 pr-30'}`}>
                  <Grid.Column>
                    <p><b>Wire Amount:</b></p>
                  </Grid.Column>
                  <Grid.Column>
                    <p className="right-align"><b>{isPreferredEquity ? Helper.CurrencyFormat(getTransferRequestAmount) : Helper.CurrencyFormat(getTransferRequestAmount, 0)}</b></p>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className={isMobile ? 'mt-0 pb-0' : 'mt-30'}>
                  <Grid.Column>
                    <p><b>Wire Instructions:</b></p>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="pb-0 pt-0">
                  <Grid.Column>
                    <p>Please print these instructions for your records.{' '}
                    <Responsive minWidth={768} as="br" />
                    A copy will also been sent to you via email after you confirm.
                </p>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="pt-20">
                  <Grid.Column widescreen={5} computer={5} tablet={16} mobile={16}>
                    <p className="mb-0">Happy State Bank</p>
                    <p className="mb-0">100 E. Main Street</p>
                    <p className="mb-0">Happy, Texas  79042</p>
                  </Grid.Column>
                  <Grid.Column widescreen={10} computer={10} tablet={16} mobile={16}>
                    <p className={`mb-0 ${isMobile ? 'mt-10' : ''}`}>
                      Routing Number: 111310870 <br />
                      Account Number: 6002000773 <br />
                      Memo - For further credit to: Goldstar Trust Operating <br />
                      {`FBO: ${accountDetailsMeta.userFullName} ${accountDetailsMeta.goldstarAccountNumber}`}
                    </p>
                    {/* <p className="mb-0">Routing Number: 111310870</p>
                    <p className="mb-0">Account Number: 6002000773</p>
                    <p className="mb-0">Memo - For further credit to: Goldstar Trust Operating</p>
                    <p className="mb-0">{`FBO: ${accountDetailsMeta.userFullName} ${accountDetailsMeta.goldstarAccountNumber}`}</p> */}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </>
          )
        }

        {/* <Table basic="very" className="confirm-transfer-table mt-30" compact>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell colspan="6">Transfer Request: </Table.HeaderCell>
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
        </Table>  */}
    </>
  );
}

export default (TransferRequestMethod);
