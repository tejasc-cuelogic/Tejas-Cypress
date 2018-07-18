import React, { Component } from 'react';
import { Container, Table, Header, List } from 'semantic-ui-react';
import Aux from 'react-aux';

class Compare extends Component {
  render() {
    return (
      <Aux>
        <section className="mt-74 compare-section">
          <Container>
            <Header as="h2" textAlign="center" className="mb-30">See how we stack up.</Header>
            <Table fixed celled definition striped className="mb-50 compare-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell />
                  <Table.HeaderCell>Bank</Table.HeaderCell>
                  <Table.HeaderCell>Merchant Cash</Table.HeaderCell>
                  <Table.HeaderCell>Equity Investors</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell collapsing>
                  Amount
                  </Table.Cell>
                  <Table.Cell>$50k–$1MM</Table.Cell>
                  <Table.Cell>$250k+</Table.Cell>
                  <Table.Cell>$20k–$100k</Table.Cell>
                  <Table.Cell>Variable</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell collapsing>
                  Total Cost APR1
                  </Table.Cell>
                  <Table.Cell>Term Loans 10–18%<br />Revenue Sharing Notes 15–25%</Table.Cell>
                  <Table.Cell>7–15%</Table.Cell>
                  <Table.Cell>50%</Table.Cell>
                  <Table.Cell>30%+</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell collapsing>
                  Fundraising Period
                  </Table.Cell>
                  <Table.Cell>21+ Days</Table.Cell>
                  <Table.Cell>2–9 Months</Table.Cell>
                  <Table.Cell>14+ Days</Table.Cell>
                  <Table.Cell>3–9 Months</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell collapsing>
                  Security
                  </Table.Cell>
                  <Table.Cell>Flexible collateral terms</Table.Cell>
                  <Table.Cell>Personal guarantee &<br /> asset collateral required</Table.Cell>
                  <Table.Cell>Daily cash withdrawl</Table.Cell>
                  <Table.Cell>Variable</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell collapsing>
                  Capital Base
                  </Table.Cell>
                  <Table.Cell>Community, potential fans<br /> and customers</Table.Cell>
                  <Table.Cell>Bank</Table.Cell>
                  <Table.Cell>Institutional lenders</Table.Cell>
                  <Table.Cell>Typically accredited investors</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell collapsing>
                  Additional Fees1
                  </Table.Cell>
                  <Table.Cell>5–10% success fee (all inclusive)</Table.Cell>
                  <Table.Cell>3–8% origination fee</Table.Cell>
                  <Table.Cell>3–10% origination fee</Table.Cell>
                  <Table.Cell>Expensive legal fees</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell collapsing>
                  Marketing Benefits
                  </Table.Cell>
                  <Table.Cell>
                  Smart army of advocates<br />
                  Community events<br />
                  Social media<br />
                  Targeted marketing
                  </Table.Cell>
                  <Table.Cell>None</Table.Cell>
                  <Table.Cell>None</Table.Cell>
                  <Table.Cell>None</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <List horizontal className="mb-50">
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Icon name="arrow right" color="green" />
                <List.Content as="a">
                Is my business a good fit for NextSeed?
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Icon name="arrow right" color="green" />
                <List.Content as="a">
                Does my business qualify for NextSeed?
                </List.Content>
              </List.Item>
            </List>
            <p className="note">
              ¹ For illustrative purposes only based on general market terms.
              Specific rates offered and fees required by specific lenders or investors
              may vary drastically based on facts and circumstances.
            </p>
          </Container>
        </section>
      </Aux>
    );
  }
}

export default Compare;
