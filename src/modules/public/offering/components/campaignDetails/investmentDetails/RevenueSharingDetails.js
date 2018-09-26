import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { Header, Segment, Breadcrumb, Statistic, Grid, Popup, Icon } from 'semantic-ui-react';
import KeyTermsModal from './../investmentDetails/KeyTermsModal';
import SummaryModal from '../investmentDetails/SummaryModal';

const isTabletLand = document.documentElement.clientWidth >= 992
&& document.documentElement.clientWidth < 1200;
class RevenueSharingDetails extends Component {
  render() {
    return (
      <Grid.Row>
        <Grid.Column widescreen={10} largeScreen={10} computer={16} tablet={16}>
          <Segment padded>
            <Breadcrumb>
              <Breadcrumb.Section as={Link} to={`${this.props.match.url}/summary`}><b>Expand Summary</b></Breadcrumb.Section>
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
          </Segment>
        </Grid.Column>
        <Grid.Column widescreen={6} largeScreen={6} computer={16} tablet={16} className={isTabletLand && 'mt-30'}>
          <Segment padded>
            <Breadcrumb>
              <Breadcrumb.Section as={Link} to={`${this.props.match.url}/keyterms`}>
                <b>View Key Terms</b>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
            </Breadcrumb>
            <Header as="h4" className="mb-20">Revenue Sharing Notes</Header>
            <Grid columns={3} doubling divided className="vertical-gutter">
              <Grid.Column>
                <Statistic size="mini" className="basic">
                  <Statistic.Label>Multiple{' '}
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
                  <Statistic.Label>Revenue Sharing{' '}
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
                  <Statistic.Label>Maturity{' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="Lorem Ipsum"
                      position="top center"
                    />
                  </Statistic.Label>
                  <Statistic.Value>48 months</Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic size="mini" className="basic">
                  <Statistic.Label>Payments{' '}
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
                  <Statistic.Label>Ownership{' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="Lorem Ipsum"
                      position="top center"
                    />
                  </Statistic.Label>
                  <Statistic.Value>0%</Statistic.Value>
                </Statistic>
              </Grid.Column>
            </Grid>
          </Segment>
        </Grid.Column>
        <Route path={`${this.props.match.url}/keyterms`} component={KeyTermsModal} />
        <Route path={`${this.props.match.url}/summary`} component={SummaryModal} />
      </Grid.Row>
    );
  }
}

export default RevenueSharingDetails;
