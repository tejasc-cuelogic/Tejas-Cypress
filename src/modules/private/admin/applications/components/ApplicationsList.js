import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
// import { includes } from 'lodash';
import { Form, Grid, Input, Button, Pagination, Card, Table, Header, Item, Rating } from 'semantic-ui-react';
import { DropdownFilter } from '../../../../../theme/form/Filters';
import { FILTER_META } from '../../../../../constants/user';
import { FormCheckbox } from '../../../../../theme/form';
import { ApplicationListStepColumn } from './ApplicationListStepColumn';
import { ApplicationListButtons } from './ApplicationListButtons';
import { AppStatusLabel } from './AppStatusLabel';

@inject('businessAppAdminStore')
@observer
export default class ApplicationsList extends Component {
  componentWillMount() {
    const { match } = this.props;
    const { fetchBusinessApplicationsByStatus } = this.props.businessAppAdminStore;
    fetchBusinessApplicationsByStatus(match.url);
  }
  setSearchParam = (e, { name, value }) =>
    this.props.businessAppAdminStore.setInitiateSrch(name, value);

  checkClicked = () => {
    console.log('clicked');
  }

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.businessAppAdminStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  render() {
    // const { match, helloWorldStore } = this.props;
    const {
      getBusinessApplication,
      requestState,
      filterApplicationStatus,
      columnTitle,
    } = this.props.businessAppAdminStore;
    return (
      <Aux>
        <Form>
          <Grid>
            <Grid.Row verticalAlign="bottom">
              <Grid.Column width={8}>
                <Input fluid onKeyPress={this.executeSearch} icon={{ className: 'ns-search' }} iconPosition="left" placeholder="Search by keyword or phrase" />
              </Grid.Column>
              <Grid.Column width={3}>
                <DropdownFilter name="Sort By" keyName="businessAppSortOption" change={this.setSearchParam} value={requestState.search.businessAppSortOption} options={FILTER_META.businessAppSortOption} />
              </Grid.Column>
              <Grid.Column width={3} floated="right" textAlign="right">
                <Button primary className="relaxed" content="Export" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={10}>
                <FormCheckbox
                  fielddata={filterApplicationStatus}
                  name="applicationStatus"
                  changed={this.setSearchParam}
                  defaults
                  containerclassname="ui list horizontal"
                />
              </Grid.Column>
              <Grid.Column width={6} textAlign="right">
                <Pagination defaultActivePage={1} totalPages={20} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable className="application-list">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Info</Table.HeaderCell>
                  <Table.HeaderCell width={4}>Comments</Table.HeaderCell>
                  <Table.HeaderCell width={4}>{columnTitle}</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {getBusinessApplication.length ?
                  getBusinessApplication.map(application => (
                    <Table.Row verticalAlign="top">
                      <Table.Cell>
                        <Header as="h6">
                          {application.info.businessName}
                          <AppStatusLabel status={application.status} />
                          {/* <Label color="red" size="small" horizontal>Declined</Label> */}
                        </Header>
                        <div className="table-info-wrap">
                          <p>{application.info.name}<br />
                            {application.info.email}<br />
                            {application.info.phone}
                          </p>
                          <p>Sign-up Code <b>-</b><br />
                            Started <b>{application.createdDate}</b><br />
                            Updated <b>{application.updatedDate}</b>
                          </p>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Item>
                          <Item.Header><Rating size="large" defaultRating={0} maxRating={5} /></Item.Header>
                          <Item.Content>
                            <Item.Description>
                              {application.comment.content}
                            </Item.Description>
                            <Item.Extra>
                              <b>5/5/2018 | 1:33PM</b>
                              <b> by {application.comment.user}</b>
                            </Item.Extra>
                          </Item.Content>
                        </Item>
                      </Table.Cell>
                      <ApplicationListStepColumn
                        application={application}
                      />
                      <ApplicationListButtons
                        appStatus={application.applicationStatus}
                        status={application.status}
                      />
                    </Table.Row>
                  )) : null
                }
              </Table.Body>
            </Table>
          </div>
        </Card>
      </Aux>
    );
  }
}
