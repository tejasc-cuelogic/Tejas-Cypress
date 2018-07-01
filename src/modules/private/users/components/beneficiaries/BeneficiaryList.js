import React from 'react';
import { Link, Route } from 'react-router-dom';
import Aux from 'react-aux';
import startCase from 'lodash/startCase';
import { Card, Grid, Button, Header, Icon, Item } from 'semantic-ui-react';
import DateTimeFormat from '../../../../../theme/common/DateTimeFormat';
import { BENEFICIARY_STATUS } from '../../../../../constants/user';
import AddBeneficiary from './AddBeneficiary';

// const statuses = ['Rejected', 'Pending Approval', 'Approved'];
const BeneficiaryList = (props) => {
  const title = props.title === 'ira' ? props.title.toUpperCase() : startCase(props.title);
  const status = startCase(props.beneficiaries.requestStatus);
  const statusImg = (BENEFICIARY_STATUS.PENDING === props.beneficiaries.requestStatus ? 'orange reload' : 'green check').split(' ');
  const showButton = props.curLocation.pathname !== `${props.match.url}/add-${title.toLowerCase()}-beneficiary`;
  return (
    <Grid.Row>
      <Grid.Column widescreen={8} largeScreen={10} computer={13} tablet={16} mobile={16}>
        <Card fluid>
          <Card.Content className="padded beneficiaries">
            <Header as="h3">
              <Icon color="green" className={`ns-${title.toLowerCase()}-line`} />
              {`${title} Account beneficiaries`}
            </Header>
            { showButton ?
              <Aux>
                <div className="status">
                  <span className="time-stamp">Updated: 4-05-2018</span>
                  <Icon color={statusImg[0]} className={`ns-${statusImg[1]}-circle`} /> {`${status}`}
                </div>
                <p>
                  Pellentesque facilisis. Nulla imperdiet sit amet magna.
                  Vestibulum dapibus, mauris nec malesuada fames ac turpis
                </p>
                <Item.Group>
                  {
                    props.beneficiaries.recipients ?
                    props.beneficiaries.recipients.map(beneficiary => (
                      <Item>
                        <Grid stackable celled="internally" padded="horizontally">
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <Card.Content>
                                <dl className="dl-horizontal">
                                  <dt>Names</dt>
                                  <dd>{`${beneficiary.firstName} ${beneficiary.lastName}`}</dd>
                                  <dt>DOB</dt>
                                  <dd><DateTimeFormat datetime={beneficiary.dob} /></dd>
                                  <dt>Relationship</dt>
                                  <dd>{beneficiary.relationship}</dd>
                                </dl>
                              </Card.Content>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <Card.Content>
                                <dl className="dl-horizontal">
                                  <dt>Legal Address</dt>
                                  <dd>
                                    {`${beneficiary.address.street}`}<br />{`${beneficiary.address.city} ${beneficiary.address.state} ${beneficiary.address.zipCode}`}
                                  </dd>
                                </dl>
                              </Card.Content>
                              <Card.Content>
                                <dl className="dl-horizontal">
                                  <dt>Share</dt>
                                  <dd>{`${beneficiary.shares}%`}</dd>
                                </dl>
                              </Card.Content>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Item>
                    )) :
                    <div>loading...</div>
                  }
                </Item.Group>
                <Button as={Link} to={`${props.match.url}/add-${title.toLowerCase()}-beneficiary`} color="green">Manage beneficiaries</Button>
              </Aux>
              : null }
            <Route exact path={`${props.match.url}/add-${title.toLowerCase()}-beneficiary`} render={props1 => <AddBeneficiary refLink={props.match.url} isDataAvailable accountId={props.accountId} {...props1} />} />
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid.Row>
  );
};

export default BeneficiaryList;
