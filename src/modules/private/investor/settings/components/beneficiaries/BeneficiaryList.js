import React from 'react';
import { Link, Route } from 'react-router-dom';
import Aux from 'react-aux';
import startCase from 'lodash/startCase';
import moment from 'moment';
import { Card, Grid, Button, Header, Icon, Item, Divider } from 'semantic-ui-react';
import { DateTimeFormat, InlineLoader, EmptyDataSet } from '../../../../../../theme/shared';
import { BENEFICIARY_STATUS } from '../../../../../../constants/user';
import AddBeneficiary from './AddBeneficiary';

const BeneficiaryList = (props) => {
  const title = props.title === 'ira' ? props.title.toUpperCase() : startCase(props.title);
  const { status } = props.beneficiaries.request;
  const statusImg = (BENEFICIARY_STATUS.PENDING === props.beneficiaries.request.status ? 'orange reload' : 'green check').split(' ');
  const showButton = (props.curLocation.pathname !== `${props.match.url}/add-${title.toLowerCase()}-beneficiary` && props.curLocation.pathname !== `${props.match.url}/add-${title.toLowerCase()}-beneficiary/confirm`);
  const headerMsg = '';
  if (props.loading) {
    return <InlineLoader />;
  }
  return (
    <Grid.Row>
      <Grid.Column widescreen={8} largeScreen={10} computer={13} tablet={16} mobile={16}>
        <Card fluid>
          <Card.Content className="padded beneficiaries">
            <Header as="h4">
              <Icon color="green" className={`ns-${title.toLowerCase()}-line`} />
              {`${title} Account beneficiaries`}
            </Header>
            { showButton
              ? (
<Aux>
                <div className="status">
                  <span className="time-stamp">{`Updated: ${moment(props.updatedDate.date).format('MM-DD-YYYY')}`}</span>
                  <Icon color={statusImg[0]} className={`ns-${statusImg[1]}-circle`} /> <span className="capitalize">{`${status}`}</span>
                </div>
                <p>{headerMsg}</p>
                <Divider hidden />
                <Item.Group>
                  {
                    props.beneficiaries.recipients
                      ? props.beneficiaries.recipients.map(beneficiary => (
                      <Item>
                        <Grid stackable celled="internally" padded="horizontally">
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <Card.Content>
                                <dl className="dl-horizontal">
                                  <dt>Names</dt>
                                  <dd>{`${beneficiary.firstName} ${beneficiary.lastName}`}</dd>
                                  <dt>DOB</dt>
                                  <dd>
                                    <DateTimeFormat
                                      format="MM/DD/YYYY"
                                      datetime={moment(beneficiary.dob, 'MM/DD/YYYY')}
                                    />
                                  </dd>
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
                                    {`${beneficiary.address.street}`}, {`${beneficiary.address.city} ${beneficiary.address.state} ${beneficiary.address.zipCode}`}
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
                      )) : <EmptyDataSet title="No data available for beneficiaries." />
                  }
                </Item.Group>
                <Button as={Link} to={`${props.match.url}/add-${title.toLowerCase()}-beneficiary`} color="green">Manage beneficiaries</Button>
              </Aux>
              )
              : <p>{headerMsg}</p>
              }
            <Route path={`${props.match.url}/add-${title.toLowerCase()}-beneficiary`} render={props1 => <AddBeneficiary refLink={props.match.url} isDataAvailable accountId={props.accountId} {...props1} />} />
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid.Row>
  );
};

export default BeneficiaryList;
