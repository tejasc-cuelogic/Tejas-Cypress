import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Card, Header, Icon } from 'semantic-ui-react';
import PageHeaderSection from '../../../components/common/PageHeaderSection';
import StickyNotification from '../components/StickyNotification';
import AccountSetupChecklist from '../components/AccountSetupChecklist';
import InvestorPersonalDetails from '../components/InvestorPersonalDetails';

@inject('uiStore')
@observer
class Dashboard extends Component {
  render() {
    const stepinfo = {
      value: 'Verify your identity',
      label: 'Complete all required information about yourself',
    };
    return (
      <div>
        <PageHeaderSection title="Dashboard">
          <StickyNotification stepinfo={stepinfo} />
        </PageHeaderSection>
        <div className="content-spacer">
          <Header as="h3">Welcome to NextSeed!</Header>
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={8}>
                <Card fluid raised className="welcome-card">
                  <Card.Content>
                    <Icon size="huge" name="thin circle" className="pull-left" />
                    <Card.Header>Thank you for signing up!</Card.Header>
                    <Card.Meta>Please complete the following steps in order
                      to unlock all features:
                    </Card.Meta>
                  </Card.Content>
                  <AccountSetupChecklist />
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        {this.props.uiStore.modalStatus &&
          <InvestorPersonalDetails />
        }
      </div>
    );
  }
}

export default Dashboard;
