import React from 'react';
import { Link, Route } from 'react-router-dom';
import { Card, Grid, Button, Header, Divider, Icon } from 'semantic-ui-react';
import { startCase, includes } from 'lodash';
import AddBeneficiary from './AddBeneficiary';

const NoBeneficiary = (props) => {
  const title = props.title === 'ira' ? props.title.toUpperCase() : startCase(props.title);
  const showButton = !includes(props.curLocation.pathname, `${props.match.url}/add-${title.toLowerCase()}-beneficiary`);
  return (
    <Grid.Row>
      <Grid.Column widescreen={8} largeScreen={10} computer={13} tablet={16} mobile={16}>
        <Card fluid>
          <Card.Content className="padded">
            <Header as="h4">
              <Icon color="green" className={`ns-${title.toLowerCase()}-line`} />
              No beneficiaries have been designated.
            </Header>
            <p>Add your first beneficiary</p>
            <Divider hidden />
            { showButton
              ? (
                <Card.Description>
                  <Button as={Link} to={`${props.match.url}/add-${title.toLowerCase()}-beneficiary`} primary content="Add new beneficiary" />
                </Card.Description>
              )
              : null
            }
            <Route path={`${props.match.url}/add-${title.toLowerCase()}-beneficiary`} render={props1 => <AddBeneficiary refLink={props.match.url} isDataAvailable={false} accountId={props.accountId} {...props1} />} />
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid.Row>
  );
};

export default NoBeneficiary;
