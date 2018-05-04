import React, { Component } from 'react';
import { Modal, Header, Card, Grid, Statistic, Popup, Icon, Tab } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const panes = [
  {
    menuItem: 'Tab 1',
    render: () => (
      <Tab.Pane attached="bottom">
        <h1>Check out our chef featurette video on Ben McPherson, Founder of Krisp Bird & Batter.
        He was inspired by trips with his father to Italy and is bringing the concept of BOH
          to the Bravery Chef Hall.In Naples, Italy is where I found my passion for food” states
          “BOH Pasta will use a simple technique with the best ingredients.We are so excited to
          him on our team!Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a
          dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur
          Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac,
          Phasellus fermentum in, dolor. Pellentesque facilisis.Nulla imperdiet sit amet magna.
          dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum
          Aliquam erat ac ipsum. Integer aliquam purusQuisque lorem tortor fringilla sed,
          eleifend justo vel bibendum sapien massa ac turpis faucibus
          He was inspired by trips with his father to Italy and is bringing the concept of BOH
          to the Bravery Chef Hall.In Naples, Italy is where I found my passion for food” states
          “BOH Pasta will use a simple technique with the best ingredients.We are so excited to
          him on our team!Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a
          dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur
          Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac,
          Phasellus fermentum in, dolor. Pellentesque facilisis.Nulla imperdiet sit amet magna.
          dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum
          Aliquam erat ac ipsum. Integer aliquam purusQuisque lorem tortor fringilla sed,
          eleifend justo vel bibendum sapien massa ac turpis faucibus
          He was inspired by trips with his father to Italy and is bringing the concept of BOH
          to the Bravery Chef Hall.In Naples, Italy is where I found my passion for food” states
          “BOH Pasta will use a simple technique with the best ingredients.We are so excited to
          him on our team!Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a
          dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur
          Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac,
          Phasellus fermentum in, dolor. Pellentesque facilisis.Nulla imperdiet sit amet magna.
          dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum
          Aliquam erat ac ipsum. Integer aliquam purusQuisque lorem tortor fringilla sed,
          eleifend justo vel bibendum sapien massa ac turpis faucibus
          He was inspired by trips with his father to Italy and is bringing the concept of BOH
          to the Bravery Chef Hall.In Naples, Italy is where I found my passion for food” states
          “BOH Pasta will use a simple technique with the best ingredients.We are so excited to
          him on our team!Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a
          dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur
          Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac,
          Phasellus fermentum in, dolor. Pellentesque facilisis.Nulla imperdiet sit amet magna.
          dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum
          Aliquam erat ac ipsum. Integer aliquam purusQuisque lorem tortor fringilla sed,
          eleifend justo vel bibendum sapien massa ac turpis faucibus
        </h1>
      </Tab.Pane>),
  },
  { menuItem: 'Tab 2', render: () => <Tab.Pane attached="bottom">Tab 2 Content</Tab.Pane> },
  { menuItem: 'Tab 3', render: () => <Tab.Pane attached="bottom">Tab 3 Content</Tab.Pane> },
];

@inject('uiStore')
@observer
class InvestmentDetails extends Component {
  handleCloseModal = () => {
    this.props.uiStore.setModalStatus(false);
  }
  render() {
    return (
      <Modal closeIcon size="large" dimmer="inverted" open={this.props.uiStore.modalStatus === 'InvestmentDetails'} onClose={this.handleCloseModal}>
        <Modal.Content>
          <Header as="h2">The Brewers Table</Header>
          <Card fluid>
            <Grid divided stackable padded="horizontally" doubling columns={5}>
              <Grid.Row>
                <Grid.Column>
                  <Card.Content>
                    <Statistic size="mini">
                      <Statistic.Label>
                        Total invested amount
                        <Popup
                          trigger={<Icon className="ns-help-circle" />}
                          content="Your Total invested amount as of today"
                          position="top center"
                          className="center-align"
                        />
                      </Statistic.Label>
                      <Statistic.Value>$3,810.00</Statistic.Value>
                    </Statistic>
                  </Card.Content>
                </Grid.Column>
                <Grid.Column>
                  <Card.Content>
                    <Statistic size="mini">
                      <Statistic.Label>
                        Status
                        <Popup
                          trigger={<Icon className="ns-help-circle" />}
                          content="Your Status as of today"
                          position="top center"
                          className="center-align"
                        />
                      </Statistic.Label>
                      <Statistic.Value>Funded</Statistic.Value>
                    </Statistic>
                  </Card.Content>
                </Grid.Column>
                <Grid.Column>
                  <Card.Content>
                    <Statistic size="mini">
                      <Statistic.Label>
                        Date
                        <Popup
                          trigger={<Icon className="ns-help-circle" />}
                          content="Date of investment started"
                          position="top center"
                          className="center-align"
                        />
                      </Statistic.Label>
                      <Statistic.Value>May 5<sup>th</sup>, 2018</Statistic.Value>
                    </Statistic>
                  </Card.Content>
                </Grid.Column>
                <Grid.Column>
                  <Card.Content>
                    <Statistic size="mini">
                      <Statistic.Label>
                        Net Payments Received
                        <Popup
                          trigger={<Icon className="ns-help-circle" />}
                          content="Your Net Payments Received till date"
                          position="top center"
                          className="center-align"
                        />
                      </Statistic.Label>
                      <Statistic.Value>$3,810.00</Statistic.Value>
                    </Statistic>
                  </Card.Content>
                </Grid.Column>
                <Grid.Column>
                  <Card.Content>
                    <Statistic size="mini">
                      <Statistic.Label>
                        Net Annualied Returns
                        <Popup
                          trigger={<Icon className="ns-help-circle" />}
                          content="Your Net Annualied Returns till date"
                          position="top center"
                          className="center-align"
                        />
                      </Statistic.Label>
                      <Statistic.Value>10.28%</Statistic.Value>
                    </Statistic>
                  </Card.Content>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card>
          <Card fluid>
            <Tab menu={{ attached: 'top', inverted: 'true' }} panes={panes} />
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}

export default InvestmentDetails;
