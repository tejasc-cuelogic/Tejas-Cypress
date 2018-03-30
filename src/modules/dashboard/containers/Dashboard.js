import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Grid, Card, List, Header, Icon, Statistic, Button, Responsive } from 'semantic-ui-react';
import DashboardWizard from './DashboardWizard';

@inject('uiStore', 'accountStore')
@observer
class Invest extends Component {
  handleAccoutTypeChange = (e, data) => {
    this.props.accountStore.setAccountType(data.activeIndex);
  }

  render() {
    return (
      <div>
        <div className="page-header-section webcontent-spacer">
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <h1>Dashboard</h1>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Responsive {...Responsive.onlyComputer}>
            <div className="sticky-notification">
              <Card fluid raised>
                <Card.Content>
                  <Card.Meta>Next Step:</Card.Meta>
                  <Statistic size="mini" className="cta">
                    <Statistic.Value>Verify your identity</Statistic.Value>
                    <Statistic.Label>Complete all required information about you</Statistic.Label>
                  </Statistic>
                  <Button color="green" as={Link} floated="right" className="rounded pull-right" to="">Verify me</Button>
                </Card.Content>
              </Card>
            </div>
          </Responsive>
        </div>
        <div className="content-spacer">
          <Header as="h3">Welcome to NextSeed!</Header>
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={8}>
                <Card fluid raised className="welcome-card">
                  <Card.Content>
                    {/* <Item.Image size="tiny" floated="left" src={Logo} /> */}
                    <Icon size="huge" name="thin circle" className="pull-left" />
                    <Card.Header>Thank you for signing up!</Card.Header>
                    <Card.Meta>Please complete the following steps in order
                      to unlock all features:
                    </Card.Meta>
                  </Card.Content>
                  <Card.Content>
                    <Card.Description>
                      <List relaxed className="check-list">
                        <List.Item>
                          <List.Icon name="check circle large" />
                          <List.Content verticalAlign="middle">Complete all required information about you <Link as="a" to=""><strong>here</strong></Link></List.Content>
                        </List.Item>
                        <List.Item>
                          <List.Icon name="circle thin large" />
                          <List.Content verticalAlign="middle">Confirm your email address. <Link as="a" to=""><strong>Resend email?</strong></Link></List.Content>
                        </List.Item>
                        <List.Item>
                          <List.Icon name="circle thin large" />
                          <List.Content verticalAlign="middle">Create your first NextSeed Account <Link to="/app/dashboard" onClick={() => this.props.uiStore.setDashboardWizardStep('InvestmentChooseType')}><strong >here</strong></Link></List.Content>
                        </List.Item>
                      </List>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        {this.props.uiStore.dashboardStep &&
        <DashboardWizard
          handleAccoutTypeChange={this.handleAccoutTypeChange}
        />
        }
      </div>
    );
  }
}

export default Invest;
