import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Card, Table, Checkbox, Button, Icon, Label, Grid, Form, Confirm } from 'semantic-ui-react';
import { GLOBAL_ACTIONS } from '../../../../../services/constants/admin/knowledgeBase';
import { DropdownFilter } from '../../../../../theme/form/Filters';
import { DateTimeFormat, InlineLoader, NsPagination } from '../../../../../theme/shared';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
};

@withRouter
@inject('knowledgeBaseStore', 'uiStore')
@observer
export default class AllKnowledgeBaseItems extends Component {
  componentWillMount() {
    this.props.knowledgeBaseStore.initRequest(null, false); // load data
    this.props.knowledgeBaseStore.resetPagination();
  }
  globalActionChange = (e, { name, value }) =>
    this.props.knowledgeBaseStore.setGlobalAction(name, value);
  handleAction = (action, articleId) => {
    if (action === 'Delete') {
      this.props.knowledgeBaseStore.setConfirmBox(action, articleId);
    } else if (action === 'Edit') {
      this.props.history.push(`${this.props.match.url}/${articleId}`);
    }
  }
  deleteTeamMember = () => {
    const { deleteKBById, setConfirmBox } = this.props.knowledgeBaseStore;
    deleteKBById(this.props.knowledgeBaseStore.confirmBox.refId);
    setConfirmBox('');
  }
  handleDeleteCancel = () => {
    this.props.knowledgeBaseStore.setConfirmBox('');
  }

  paginate = params => this.props.knowledgeBaseStore.pageRequest(params);

  checkedRecords = (e, result) => {
    if (result && result.type === 'checkbox' && result.checked) {
      this.props.knowledgeBaseStore.addSelectedRecords(result.value);
    }
  }

  render() {
    const { knowledgeBaseStore } = this.props;
    const {
      AllKnowledgeBase,
      loading,
      globalAction,
      confirmBox,
      count,
      requestState,
      applyGlobalAction,
      disableApply,
    } = knowledgeBaseStore;
    const totalRecords = count || 0;
    if (loading) {
      return <InlineLoader />;
    }
    if (AllKnowledgeBase.length === 0) {
      return <InlineLoader text="No data found." />;
    }
    return (
      <Aux>
        <Form>
          <Grid columns="equal" verticalAlign="bottom">
            <Grid.Row>
              {/* <Grid.Column>Selected 15 items</Grid.Column> */}
              <Grid.Column width={3} floated="right">
                <DropdownFilter value={globalAction} change={this.globalActionChange} name="globalAction" keyName="globalAction" label="Global actions" options={GLOBAL_ACTIONS} />
              </Grid.Column>
              <Grid.Column width={2}>
                <Button inverted color="green" compact fluid content="Apply" onClick={applyGlobalAction} disabled={disableApply} />
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
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                  <Table.HeaderCell>Author</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Last update date</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  AllKnowledgeBase.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell>
                        <Checkbox
                          name={record.id}
                          value={record.id}
                          onChange={(e, result) => this.checkedRecords(e, result)}
                        />
                      </Table.Cell>
                      <Table.Cell>{record.title}</Table.Cell>
                      <Table.Cell>{record.userType}</Table.Cell>
                      <Table.Cell>{record.category || 'N/A'}</Table.Cell>
                      <Table.Cell>
                        {(record.author && record.author.info && record.author.info.firstName) || 'N/A'}
                        {record.author && record.author.info && record.author.info.lastName}
                      </Table.Cell>
                      <Table.Cell><Label color={`${record.itemStatus === 'PUBLISHED' ? 'green' : record.itemStatus === 'DRAFT' ? 'red' : 'yellow'}`} circular empty /></Table.Cell>
                      <Table.Cell>
                        <DateTimeFormat format="MM-DD-YYYY" datetime={record.updated && record.updated.date} />
                      </Table.Cell>
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
        {totalRecords > 0 &&
          <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
        }
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this item?"
          open={confirmBox.entity === 'Delete'}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.deleteTeamMember}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
