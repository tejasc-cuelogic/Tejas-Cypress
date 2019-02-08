import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Card, Table, Checkbox, Button, Icon, Label, Grid, Form, Confirm } from 'semantic-ui-react';
import { GLOBAL_ACTIONS } from '../../../../../services/constants/admin/article';
import { DropdownFilter } from '../../../../../theme/form/Filters';
import { DateTimeFormat, InlineLoader } from '../../../../../theme/shared';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
};

@withRouter
@inject('articleStore', 'uiStore')
@observer
export default class AllInsights extends Component {
  componentWillMount() {
    this.props.articleStore.requestAllArticles(false); // load data
  }
  globalActionChange = (e, { name, value }) =>
    this.props.articleStore.setGlobalAction(name, value);
  handleAction = (action, articleId) => {
    if (action === 'Delete') {
      // this.props.uiStore.setConfirmBox(action, articleId);
      this.handleDeleteConfirm(articleId);
    } else if (action === 'Edit') {
      this.props.history.push(`${this.props.match.url}/${articleId}`);
    }
  }
  handleDeleteConfirm = (id) => {
    this.props.uiStore.setConfirmBox('Delete', id);
  }
  handleDelete = () => {
    this.props.articleStore.deleteArticle(this.props.uiStore.confirmBox.refId);
    this.props.uiStore.setConfirmBox('');
  }
  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const { articleStore } = this.props;
    const { confirmBox } = this.props.uiStore;
    const {
      InsightArticles,
      loading,
      globalAction,
    } = articleStore;
    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form>
          <Grid columns="equal" verticalAlign="bottom">
            <Grid.Row>
              <Grid.Column>Selected 15 items</Grid.Column>
              <Grid.Column width={3} floated="right">
                <DropdownFilter value={globalAction} change={this.globalActionChange} name="globalAction" keyName="globalAction" options={GLOBAL_ACTIONS} />
              </Grid.Column>
              <Grid.Column width={2}>
                <Button inverted primary compact fluid content="Apply" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable striped sortable className="user-list">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell collapsing>&nbsp;</Table.HeaderCell>
                  <Table.HeaderCell width={5}>Title</Table.HeaderCell>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                  <Table.HeaderCell>Tags</Table.HeaderCell>
                  <Table.HeaderCell>Author</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Last update date</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  InsightArticles.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell><Checkbox /></Table.Cell>
                      <Table.Cell>{record.title}</Table.Cell>
                      <Table.Cell>{record.category}</Table.Cell>
                      <Table.Cell>{record.tags}</Table.Cell>
                      <Table.Cell>
                        {record.author && record.author.info && record.author.info.firstName}
                        {record.author && record.author.info && record.author.info.lastName}
                      </Table.Cell>
                      <Table.Cell><Label color={`${record.articleStatus === 'PUBLISHED' ? 'green' : record.articleStatus === 'DRAFT' ? 'red' : 'yellow'}`} circular empty /></Table.Cell>
                      <Table.Cell>
                        <DateTimeFormat format="MM-DD-YYYY" datetime={record.updated && record.updated.date} />
                      </Table.Cell>
                      {/* <div className="actions">
                        <Button
                          as={Link}
                          to={`${this.props.match.url}/${record.id}`}
                          className="link-button"
                        > */}
                      {/* Details
                          </Button> */}
                      <Table.Cell textAlign="center">
                        <Button.Group>
                          {Object.keys(actions).map(action => (
                            <Button className="link-button" >
                              <Icon className={`ns-${actions[action].icon}`} onClick={() => this.handleAction(actions[action].label, record.id)} />
                            </Button>
                          ))}
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
          </div>
        </Card>
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this Article?"
          open={confirmBox.entity === 'Delete'}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDelete}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
