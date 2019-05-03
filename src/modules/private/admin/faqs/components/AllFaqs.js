import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Card, Table, Button, Grid, Form, Checkbox, Icon, Label, Confirm } from 'semantic-ui-react';
import { DropdownFilter } from '../../../../../theme/form/Filters';
import { InlineLoader, NsPagination, DateTimeFormat } from './../../../../../theme/shared';
import { FAQ_TYPE_ENUM, GLOBAL_ACTIONS } from '../../../../../services/constants/admin/faqs';

@inject('faqStore')
@withRouter
@observer
export default class AllFaqs extends Component {
  componentWillMount() {
    this.props.faqStore.initRequest(); // load data
  }
  handleAction = (action, faqId) => {
    if (action === 'Delete') {
      this.props.faqStore.setConfirmBox(action, faqId);
    } else if (action === 'Edit') {
      this.props.history.push(`${this.props.match.url}/${faqId}`);
    }
  }
  globalActionChange = (e, { name, value }) =>
    this.props.faqStore.setGlobalAction(name, value);
  deleteFaq = () => {
    this.props.faqStore.deleteRecords(this.props.faqStore.confirmBox.refId);
    this.props.faqStore.setConfirmBox('');
  }
  handleDeleteCancel = () => {
    this.props.faqStore.setConfirmBox('');
  }
  paginate = params => this.props.faqStore.pageRequest(params);
  checkedRecords = (e, result) => {
    if (result && result.type === 'checkbox' && result.checked) {
      this.props.faqStore.addSelectedRecord(result.value);
    } else {
      this.props.faqStore.removeUnSelectedRecord(result.value);
    }
  }
  checkAll = (e, result) => {
    this.props.faqStore.checkUncheckAll(result.checked);
  }
  render() {
    const {
      allFaqs,
      loading,
      count,
      requestState,
      confirmBox,
      applyGlobalAction,
      disableApply,
      selectedCount,
      selectedRecords,
      globalAction,
    } = this.props.faqStore;
    const actions = {
      edit: { label: 'Edit', icon: 'pencil' },
      delete: { label: 'Delete', icon: 'trash' },
    };
    const totalRecords = count || 0;
    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form>
          <Grid columns="equal" verticalAlign="bottom">
            <Grid.Row>
              <Grid.Column>{selectedCount ? `Selected ${selectedRecords.includes('all') ? selectedCount - 1 : selectedCount} items` : ''}</Grid.Column>
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
                  <Table.HeaderCell collapsing>
                    <Checkbox
                      defaultIndeterminate={false}
                      value="all"
                      checked={selectedRecords.includes('all')}
                      onChange={(e, result) => this.checkAll(e, result)}
                    />
                  </Table.HeaderCell>
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
                  allFaqs.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell>
                        <Checkbox
                          name={record.id}
                          value={record.id}
                          checked={selectedRecords.includes(record.id)}
                          onChange={(e, result) => this.checkedRecords(e, result)}
                        />
                      </Table.Cell>
                      <Table.Cell><Link to={`${this.props.match.url}/${record.id}`}>{record.question}</Link></Table.Cell>
                      <Table.Cell>{FAQ_TYPE_ENUM[record.faqType]}</Table.Cell>
                      <Table.Cell>{record.categoryName}</Table.Cell>
                      <Table.Cell>{record.author}</Table.Cell>
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
          onConfirm={this.deleteFaq}
          closeOnDimmerClick={false}
          size="mini"
          className="deletion"
        />

      </Aux>
    );
  }
}
