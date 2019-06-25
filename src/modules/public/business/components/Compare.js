import React from 'react';
import { Container, Table, Header, List, Responsive, Accordion, Icon } from 'semantic-ui-react';
import Aux from 'react-aux';

const isMobile = document.documentElement.clientWidth < 768;

const Compare = () => (
  <Aux>
    <section className="compare-section edu-center">
      <Container>
        <Header as="h2" textAlign="center" className="mb-30">See how we stack up.</Header>
        <Responsive minWidth={768} as={Table} celled definition striped className="mb-50 compare-table">
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
              <Table.Cell>
              Amount
              </Table.Cell>
              <Table.Cell>$50k–$1MM</Table.Cell>
              <Table.Cell>$250k+</Table.Cell>
              <Table.Cell>$20k–$100k</Table.Cell>
              <Table.Cell>Variable</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
              Total Cost APR1
              </Table.Cell>
              <Table.Cell>Term Loans 10–18%<br />Revenue Sharing Notes 15–25%</Table.Cell>
              <Table.Cell>7–15%</Table.Cell>
              <Table.Cell>50%</Table.Cell>
              <Table.Cell>30%+</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
              Fundraising Period
              </Table.Cell>
              <Table.Cell>21+ Days</Table.Cell>
              <Table.Cell>2–9 Months</Table.Cell>
              <Table.Cell>14+ Days</Table.Cell>
              <Table.Cell>3–9 Months</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
              Security
              </Table.Cell>
              <Table.Cell>Flexible collateral terms</Table.Cell>
              <Table.Cell>Personal guarantee &<br /> asset collateral required</Table.Cell>
              <Table.Cell>Daily cash withdrawl</Table.Cell>
              <Table.Cell>Variable</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
              Capital Base
              </Table.Cell>
              <Table.Cell>Community, potential fans<br /> and customers</Table.Cell>
              <Table.Cell>Bank</Table.Cell>
              <Table.Cell>Institutional lenders</Table.Cell>
              <Table.Cell>Typically accredited investors</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
              Additional Fees1
              </Table.Cell>
              <Table.Cell>5–10% success fee (all inclusive)</Table.Cell>
              <Table.Cell>3–8% origination fee</Table.Cell>
              <Table.Cell>3–10% origination fee</Table.Cell>
              <Table.Cell>Expensive legal fees</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
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
        </Responsive>
        <Responsive maxWidth={767} as={Accordion} className="splitted mb-50 compare-section">
          <Accordion.Title active>
            Amount
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content active>
            <Table striped unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="highlight-text"><b>NextSeed</b></Table.HeaderCell>
                  <Table.HeaderCell className="highlight-text"><b>$50k–$1MM</b></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Bank</Table.Cell>
                  <Table.Cell>$250k+</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Merchant Cash</Table.Cell>
                  <Table.Cell>$20k–$100k</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Equity Investors</Table.Cell>
                  <Table.Cell>Variable</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Accordion.Content>
          <Accordion.Title active>
            Total cost APR
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content active>
            <Table striped unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="highlight-text"><b>NextSeed</b></Table.HeaderCell>
                  <Table.HeaderCell className="highlight-text"><b>Term Loans 10–18%<br />Revenue Sharing 15–25%</b></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Bank</Table.Cell>
                  <Table.Cell>$250k+</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Merchant Cash</Table.Cell>
                  <Table.Cell>$20k–$100k</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Equity Investors</Table.Cell>
                  <Table.Cell>Variable</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Accordion.Content>
          <Accordion.Title active>
            Funding Period
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content active>
            <Table striped unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="highlight-text"><b>NextSeed</b></Table.HeaderCell>
                  <Table.HeaderCell className="highlight-text"><b>21+ days</b></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Bank</Table.Cell>
                  <Table.Cell>2–9 months</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Merchant Cash</Table.Cell>
                  <Table.Cell>14+ days</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Equity Investors</Table.Cell>
                  <Table.Cell>3–9 months</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Accordion.Content>
          <Accordion.Title active>
            Security
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content active>
            <Table striped unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="highlight-text"><b>NextSeed</b></Table.HeaderCell>
                  <Table.HeaderCell className="highlight-text"><b>Flexible collateral terms</b></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Bank</Table.Cell>
                  <Table.Cell>Personal guarantee & assets collateral</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Merchant Cash</Table.Cell>
                  <Table.Cell>Daily cash withdrawl</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Equity Investors</Table.Cell>
                  <Table.Cell>Variable</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Accordion.Content>
          <Accordion.Title active>
            Capital Base
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content active>
            <Table striped unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="highlight-text"><b>NextSeed</b></Table.HeaderCell>
                  <Table.HeaderCell className="highlight-text"><b>Community, fans and customers</b></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Bank</Table.Cell>
                  <Table.Cell>Bank</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Merchant Cash</Table.Cell>
                  <Table.Cell>Institutional lenders</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Equity Investors</Table.Cell>
                  <Table.Cell>Typically accredited investors</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Accordion.Content>
          <Accordion.Title active>
            Additional Fees
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content active>
            <Table striped unstackable className="mb-50">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="highlight-text"><b>NextSeed</b></Table.HeaderCell>
                  <Table.HeaderCell className="highlight-text"><b>5–10%  sucess fee<br />(all inclusive)</b></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Bank</Table.Cell>
                  <Table.Cell>3–8% origination fee</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Merchant Cash</Table.Cell>
                  <Table.Cell>3–10% origination fee</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Equity Investors</Table.Cell>
                  <Table.Cell>Expensive legal fees</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Accordion.Content>
          <Accordion.Title active>
            Marketing Benefits
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content active>
            <Table striped unstackable className="mb-50">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="highlight-text"><b>NextSeed</b></Table.HeaderCell>
                  <Table.HeaderCell className="highlight-text"><b>Smart army of advocates Community events Social media Targeted marketing</b></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Bank</Table.Cell>
                  <Table.Cell>Bank</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Merchant Cash</Table.Cell>
                  <Table.Cell>Institutional lenders</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Equity Investors</Table.Cell>
                  <Table.Cell>Typically accredited investors</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Accordion.Content>
        </Responsive>
        <List horizontal={!isMobile} relaxed className="learn-more-list mb-50">
          <List.Item>
            <List.Header>Learn more</List.Header>
            <List.Icon className="ns-arrow-right" color="green" />
            <List.Content as="a">Is my business a good fit for NextSeed?</List.Content>
          </List.Item>
          <List.Item>
            {!isMobile
              && <List.Header>&nbsp;</List.Header>
            }
            <List.Icon className="ns-arrow-right" color="green" />
            <List.Content as="a">Does my business qualify for NextSeed?</List.Content>
          </List.Item>
        </List>
        <p className="center-align">
          ¹ For illustrative purposes only based on general market terms.
          Specific rates offered and fees required by specific lenders or investors
          may vary drastically based on facts and circumstances.
        </p>
      </Container>
    </section>
  </Aux>
);

export default Compare;
