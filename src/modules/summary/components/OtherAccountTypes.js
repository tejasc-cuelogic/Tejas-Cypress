import React from 'react';
import Aux from 'react-aux';
import _ from 'lodash';
import { Button, Card, Header, Divider } from 'semantic-ui-react';
import PrivateLayout from '../../../containers/common/PrivateHOC';
import DashboardWizard from '../containers/DashboardWizard';

const OtherAccountTypes = props => (
  <Aux>
    <PrivateLayout
      {...props}
    >
      <div className="conent-spacer">
        <Card.Group itemsPerRow={3}>
          {
            props.accTypes.map(item => (
              <Card fluid>
                <Card.Content>
                  <Header as="h3">New {_.startCase(item)} Account</Header>
                  <p>Start new application process to proceed</p>
                  <Divider hidden />
                  <Button onClick={() => props.navToAccTypes(_.lowerCase(item))} primary>
                    Create {_.startCase(item)} Account
                  </Button>
                </Card.Content>
              </Card>
            ))
          }
        </Card.Group>
      </div>
    </PrivateLayout>
    {props.dashboardStep &&
    <DashboardWizard />
    }
  </Aux>
);

export default OtherAccountTypes;
