import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Grid, Input, Button, Pagination, Card, Table, Header, Item, Rating, Label } from 'semantic-ui-react';
import { DropdownFilter } from '../../../../../theme/form/Filters';
import { FILTER_META } from '../../../../../constants/user';
// import { FormCheckbox } from '../../../../../theme/form';

@inject('helloWorldStore')
@observer
export default class AllApplications extends Component {
  componentWillMount() {
    this.props.helloWorldStore.initRequest(); // load data
  }
  render() {
    // const { match, helloWorldStore } = this.props;
    // const { allRecords } = helloWorldStore;
    return (
      <Aux>
        <Form>
          <Grid>
            <Grid.Row verticalAlign="bottom">
              <Grid.Column width={8}>
                <Input fluid icon={{ className: 'ns-search' }} iconPosition="left" placeholder="Search by keyword or phrase" />
              </Grid.Column>
              <Grid.Column width={3}>
                <DropdownFilter name="Status" keyName="accountStatus" options={FILTER_META.accountStatus} />
              </Grid.Column>
              <Grid.Column width={3} floated="right" textAlign="right">
                <Button primary className="relaxed" content="Export" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={10}>
                <Form.Group inline>
                  <Form.Checkbox label="New (3)" />
                  <Form.Checkbox label="Offered (1)" />
                  <Form.Checkbox label="Review (1)" />
                  <Form.Checkbox label="Accepted (1)" />
                  <Form.Checkbox label="Deleted (1)" />
                </Form.Group>
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
                  <Table.HeaderCell width={4}>Failed reasons</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row verticalAlign="top">
                  <Table.Cell>
                    <Header as="h6">
                      California 88
                      <Label color="red" size="small" horizontal>Declined</Label>
                    </Header>
                    <div className="table-info-wrap">
                      <p>John Doe<br />
                        jdoe234@gmail.com<br />
                        235-443-7851
                      </p>
                      <p>Sign-up Code <b>joedoe</b><br />
                        Started <b>Apr 9, 2018</b><br />
                        Updated <b>Apr 9, 2018</b>
                      </p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Item>
                      <Item.Header><Rating icon="heart" size="large" defaultRating={3} maxRating={5} /></Item.Header>
                      <Item.Content>
                        <Item.Description>
                          Good application, several fail reasons, though. We should contact them
                        </Item.Description>
                        <Item.Extra><b>5/5/2018 | 1:33PM</b> by <b>Jack Black</b></Item.Extra>
                      </Item.Content>
                    </Item>
                  </Table.Cell>
                  <Table.Cell>
                    <p>
                      Net income ($100) is lower than required $15,000. Net income ($100) is
                      lower than required $15,000. Net income ($100) is lower than required $15,000.
                    </p>
                  </Table.Cell>
                  <Table.Cell width={1} textAlign="center">
                    <Button.Group vertical compact size="mini">
                      <Button color="green">Pramote</Button>
                      <Button color="red">Delete</Button>
                      <Button color="blue" inverted className="relaxed">View</Button>
                    </Button.Group>
                  </Table.Cell>
                </Table.Row>

              </Table.Body>
            </Table>
          </div>
        </Card>
      </Aux>
    );
  }
}
