import React, { Component } from 'react';
// import Aux from 'react-aux';
import { inject } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { Grid, Header, Segment, Image, Breadcrumb, Statistic, Popup, Icon } from 'semantic-ui-react';
// import businessModel from '../../../../../assets/images/investment-1.jpg';
import businessModel from '../../../../../assets/images/investment-2.jpg';
// import TermNote from './investmentDetails/TermNote';
// import RevenueShare from './investmentDetails/RevenueShare';
import KeyTermsModal from './investmentDetails/KeyTermsModal';
// import SummaryModal from './investmentDetails/SummaryModal';
import PaymentCalculatorModal from './investmentDetails/PaymentCalculatorModal';

@inject('campaignStore')
class InvestmentDetails extends Component {
  render() {
    // const { campaign } = this.props.campaignStore;

    return (
      // <Aux>
      //   {campaign.investmentType === 'Revenue Sharing' ?
      //     <RevenueShare /> : <TermNote />
      //   }
      // </Aux>
      <div className="offering-content-spacer">
        <Grid>
          <Grid.Row>
            <Grid.Column widescreen={7} computer={8}>
              <Segment padded>
                <Header as="h3">Use of Proceeds</Header>
                <p>
                  BuffBrew expects the complete buildout of the new building and brewery to be a
                  $14 million project. The scope of the Buffbrew Taproom is $3.4 million. Buffbrew
                  is committed to financing the total project, while opening up a portion of the
                  financing for BuffBrew Taproom through NextSeed.
                </p>
                <p>
                  100% of the funding proceeds will be used towards the buildout of the new
                  Buffbrew Taproom facility. The spend includes construction as well as the
                  purchasing of equipment, furniture and supplies.
                </p>
              </Segment>
            </Grid.Column>
            <Grid.Column widescreen={9} computer={8}>
              <Segment padded>
                <Image src={businessModel} fluid />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stackable doubling>
            <Grid.Column widescreen={10} computer={10}>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/PaymentCalculatorModal`}>
                    <b>Expand Payment Calculator</b>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h4">Total Payment Calculator</Header>
                <Grid columns={4} divided doubling className="investment-grid mt-30" padded="horizontally">
                  <Grid.Column>
                    <Statistic className="basic">
                      <Statistic.Label>Interest Rate*</Statistic.Label>
                      <Statistic.Value className="center-align">16.00%</Statistic.Value>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic className="basic">
                      <Statistic.Label>Term</Statistic.Label>
                      <Statistic.Value className="center-align">60 months</Statistic.Value>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic className="basic">
                      <Statistic.Label>Principal</Statistic.Label>
                      <Statistic.Value className="center-align highlight-text">
                      $100
                      </Statistic.Value>
                      <div className="slidecontainer">
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value="10"
                          className="slider mt-10 mb-10"
                          id="myRange"
                        />
                      </div>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic className="basic">
                      <Statistic.Label>Total Payment*</Statistic.Label>
                      <Statistic.Value className="center-align">$146</Statistic.Value>
                    </Statistic>
                  </Grid.Column>
                </Grid>
                <p className="note mt-30">
                  * For illustration only. See expanded Payment Calculator view to
                  read more regarding actual performance variables.
                </p>
              </Segment>
              {/* <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section link><b>Expand Summary</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h4">Revenue Sharing Summary*</Header>
                <p>
                  This investment has a 6-month startup period during which no cash payments will
                  be made. The startup period commences the first full month after the offering’s
                  close.
                </p>
                <p>
                  After the end of the startup period or once the Issuer commences
                  operations (whichever comes later), the Issuer will share a percentage of each
                  month’s gross revenue with the investors as a group until they are paid in full.
                  The total amount raised by the offering will determine the Investment Multiple
                  and the monthly Revenue Sharing Percentage.
                </p>
                <p className="note mt-30">
                  * For illustration only. See expanded Payment Calculator view to
                  read more regarding actual performance variables.
                </p>
              </Segment> */}
            </Grid.Column>
            <Grid.Column widescreen={6} computer={6}>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/KeyTermsModal`}>
                    <b>Expand Key Terms</b>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h4">Key Investment Terms</Header>
                <Grid doubling className="mt-30">
                  <Grid.Row columns={2} divided>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Issuer Name</Statistic.Label>
                        <Statistic.Value>A Gard Midtown, LLC</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Security Type</Statistic.Label>
                        <Statistic.Value>Term Note</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={3} divided>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Min Target&nbsp;
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content="If the minimum goal is not met by the end of the offering
                            period, any funds you invest will be automatically returned to your
                            NextSeed account."
                            position="top center"
                          />
                        </Statistic.Label>
                        <Statistic.Value>$200,000</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Max Target&nbsp;
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content="The offering will remain open until the issuer raises the
                            maximum goal or the offering period ends. As long as the raise
                            exceeds the minimumgoal, the issuer will receive the funds."
                            position="top center"
                          />
                        </Statistic.Label>
                        <Statistic.Value>$1,000,000</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Payments&nbsp;
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content="The Issuer will make monthly payments based on the relevant
                            revenue sharing percentage."
                            position="top center"
                          />
                        </Statistic.Label>
                        <Statistic.Value>Monthly</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
              {/* <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/KeyTermsModal`}>
                    <b>View Key Terms</b>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h4">Revenue Sharing Notes</Header>
                <Grid columns={3} doubling className="mt-30">
                  <Grid.Row divided>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Multiple
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content="Lorem Ipsum"
                            position="top center"
                          />
                        </Statistic.Label>
                        <Statistic.Value>1.6x</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Revenue Sharing
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content="Lorem Ipsum"
                            position="top center"
                          />
                        </Statistic.Label>
                        <Statistic.Value>4%</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Maturity
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content="Lorem Ipsum"
                            position="top center"
                          />
                        </Statistic.Label>
                        <Statistic.Value>48 months</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row divided>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Payments&nbsp;
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content="The Issuer will make monthly payments based on the relevant
                            revenue sharing percentage."
                            position="top center"
                          />
                        </Statistic.Label>
                        <Statistic.Value>Monthly</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Ownership
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content="Lorem Ipsum"
                            position="top center"
                          />
                        </Statistic.Label>
                        <Statistic.Value>0%</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment> */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Route path={`${this.props.match.url}/PaymentCalculatorModal`} component={PaymentCalculatorModal} />
        <Route path={`${this.props.match.url}/KeyTermsModal`} component={KeyTermsModal} />
      </div>
    );
  }
}

export default InvestmentDetails;
