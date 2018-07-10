import React from 'react';
import { Link, Route } from 'react-router-dom';
import { Card, Grid, Button, Header, Divider, Icon } from 'semantic-ui-react';
import startCase from 'lodash/startCase';
import AddBeneficiary from './AddBeneficiary';

const NoBeneficiary = (props) => {
  const title = props.title === 'ira' ? props.title.toUpperCase() : startCase(props.title);
  const showButton = props.curLocation.pathname === props.match.url;
  return (
    <Grid.Row>
      <Grid.Column widescreen={8} largeScreen={10} computer={13} tablet={16} mobile={16}>
        <Card fluid>
          <Card.Content className="padded">
            <Header as="h3">
              <Icon color="green" className={`ns-${title.toLowerCase()}-line`} />
              {`You have no ${title} Account beneficiaries yet`}
            </Header>
            <p>Add your first beneficiary and lorem ipsum dolor sit amet lorem ipsum dolor</p>
            <Divider hidden />
            { showButton ?
              <Card.Description>
                <Button as={Link} to={`${props.match.url}/add-${title.toLowerCase()}-beneficiary`} primary content="Add new beneficiary" />
              </Card.Description> :
              null
            }
            <Route path={`${props.match.url}/add-${title.toLowerCase()}-beneficiary`} render={props1 => <AddBeneficiary refLink={props.match.url} isDataAvailable={false} accountId={props.accountId} {...props1} />} />
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid.Row>
  );
};

export default NoBeneficiary;
