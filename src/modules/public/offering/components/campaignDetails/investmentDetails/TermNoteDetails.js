import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { Header, Segment, Breadcrumb, Statistic, Grid, Popup, Icon } from 'semantic-ui-react';
import PaymentCalculatorModal from './../investmentDetails/PaymentCalculatorModal';
import KeyTermsModal from './KeyTermsModal';

const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth >= 768
&& document.documentElement.clientWidth < 992;
const isTabletLand = document.documentElement.clientWidth >= 992
&& document.documentElement.clientWidth < 1200;
class TermNoteDetails extends Component {
  render() {
    return (
      <Grid.Row>
        <Grid.Column widescreen={10} largeScreen={10} computer={16} tablet={16}>
          <Segment padded>
            <Breadcrumb>
              <Breadcrumb.Section as={Link} to={`${this.props.match.url}/paymentcalculator`}>
                <b>Expand Payment Calculator</b>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
            </Breadcrumb>
            <Header as="h4">Total Payment Calculator</Header>
            <Grid columns={4} divided doubling stackable className="investment-grid mt-30" padded="horizontally">
              <Grid.Column>
                <Statistic className="basic">
                  <Statistic.Label className={isMobile && 'center-align'}>Interest Rate*</Statistic.Label>
                  <Statistic.Value className="center-align">16.00%</Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic className="basic">
                  <Statistic.Label className={isMobile && 'center-align'}>Term</Statistic.Label>
                  <Statistic.Value className="center-align">60 months</Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic className="basic">
                  <Statistic.Label className={isMobile && 'center-align'}>Principal</Statistic.Label>
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
                  <Statistic.Label className={isMobile && 'center-align'}>Total Payment*</Statistic.Label>
                  <Statistic.Value className="center-align">$146</Statistic.Value>
                </Statistic>
              </Grid.Column>
            </Grid>
            <p className="note mt-30">
              * For illustration only. See expanded Payment Calculator view to
              read more regarding actual performance variables.
            </p>
          </Segment>
        </Grid.Column>
        <Grid.Column widescreen={6} largeScreen={6} computer={16} tablet={16} className={isTabletLand && 'mt-30'}>
          <Segment padded>
            <Breadcrumb>
              <Breadcrumb.Section as={Link} to={`${this.props.match.url}/keyterms`}>
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
              <Grid.Row columns={isMobile || isTablet ? 2 : 3} divided>
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
        </Grid.Column>
        <Route path={`${this.props.match.url}/paymentcalculator`} component={PaymentCalculatorModal} />
        <Route path={`${this.props.match.url}/keyterms`} component={KeyTermsModal} />
      </Grid.Row>
    );
  }
}

export default TermNoteDetails;
