import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { join } from 'lodash';
import { Card, Table, Button, Icon, Label, Form, Confirm } from 'semantic-ui-react';
// import { GLOBAL_ACTIONS } from '../../../../../services/constants/admin/article';
// import { DropdownFilter } from '../../../../../theme/form/Filters';
import { DateTimeFormat, InlineLoader } from '../../../../../theme/shared';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
};
const meta = [
  { label: 'Title', value: 'title' },
  { label: 'Category', value: 'category' },
  { label: 'Tags', value: 'tags' },
  { label: 'Author', value: 'author' },
  { label: 'Status', value: 'articleStatus' },
  { label: 'Last update date', value: 'updated' },
  { label: '', value: 'action' },
];

@withRouter
@inject('articleStore', 'uiStore')
@observer
export default class AllInsights extends Component {
  componentWillMount() {
    // this.props.articleStore.requestAllArticles(false); // load data
    this.props.articleStore.sortArticlesByFilter();
    console.log('allInsightsList ->', this.props.articleStore.allInsightsList);
  }
  globalActionChange = (e, { name, value }) =>
    this.props.articleStore.setGlobalAction(name, value);
  handleAction = (action, articleId) => {
    if (action === 'Delete') {
      // this.props.uiStore.setConfirmBox(action, articleId);
      this.handleDeleteConfirm(articleId);
    } else if (action === 'Edit') {
      this.props.articleStore.currentArticleId = articleId;
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
  paginate = params => this.props.articleStore.pageRequest(params);
  checkedRecords = (e, result) => {
    if (result && result.type === 'checkbox' && result.checked) {
      this.props.articleStore.addSelectedRecords(result.value);
    } else {
      this.props.articleStore.removeSelectedRecords(result.value);
    }
  }

  checkedAllRecords = (e, result) => {
    this.props.articleStore.selectRecordsOnPage(result.checked);
  }

  handleSort = clickedColumn => () => {
    if (clickedColumn === 'tags' || clickedColumn === 'action') {
      return;
    }
    const { setSortingOrder, sortOrder } = this.props.articleStore;
    setSortingOrder(clickedColumn, sortOrder.direction === 'asc' ? 'desc' : 'asc');
  }


  render() {
    const { articleStore } = this.props;
    const { confirmBox } = this.props.uiStore;
    const {
      // adminInsightArticleListing,
      // allInsightsListing,
      articleListingLoader,
      sortOrder,
      adminInsightList,
      // globalAction,
      // count,
      // requestState,
      // getSelectedRecords,
      // selectedRecordsCount,
    } = articleStore;
    // const totalRecords = count || 0;
    if (articleListingLoader) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form>
          {/* <Grid columns="equal" verticalAlign="bottom">
            <Grid.Row>
              <Grid.Column>{`Selected ${selectedRecordsCount} items`}</Grid.Column>
              <Grid.Column width={3} floated="right">
                <DropdownFilter value={globalAction} change={this.globalActionChange}
                name="globalAction" keyName="globalAction" label="Global actions"
                options={GLOBAL_ACTIONS} /></Grid.Column>
              <Grid.Column width={2}>
                <Button inverted color="green" compact fluid content="Apply" />
              </Grid.Column>
            </Grid.Row>
          </Grid> */}
        </Form>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable striped sortable className="user-list">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell collapsing>
                    {/* <Checkbox
                      name="selectAllChkbox"
                      value="selectAllChkbox"
                      onChange={(e, result) => this.checkedAllRecords(e, result)}
                      indeterminate={(getSelectedRecords.length > 0 &&
                        getSelectedRecords.length < allInsightsListing.length)}
                      checked={getSelectedRecords.length > 0 &&
                        getSelectedRecords.length === allInsightsListing.length}
                    /> */}
                  </Table.HeaderCell>
                  {/* <Table.HeaderCell width={5}>Title</Table.HeaderCell>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                  <Table.HeaderCell>Tags</Table.HeaderCell>
                  <Table.HeaderCell>Author</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Last update date</Table.HeaderCell> */}
                  {
                    meta.map(cell => (
                      <Table.HeaderCell
                        key={cell.label.split(' ')[0]}
                        width={cell.value === 'title' ? 5 : ''}
                        textAlign={cell.value === 'action' ? 'center' : ''}
                        sorted={sortOrder.column === cell.value ? sortOrder.direction === 'asc' ? 'ascending' : 'descending' : null}
                        onClick={this.handleSort(cell.value)}
                      >
                        {cell.label}
                      </Table.HeaderCell>
                    ))
                  }
                  {/* <Table.HeaderCell textAlign="center" /> */}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  adminInsightList ? adminInsightList.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell>
                        {/* <Checkbox
                          name={record.id}
                          value={record.id}
                          onChange={(e, result) => this.checkedRecords(e, result)}
                          checked={getSelectedRecords.includes(record.id)}
                        /> */}

                      </Table.Cell>
                      <Table.Cell>{record.title || '-'}</Table.Cell>
                      <Table.Cell>{record.category || 'N/A'}</Table.Cell>
                      <Table.Cell>{record.tags ? join(record.tags, ', ') : '-'}</Table.Cell>
                      <Table.Cell>
                        {record.author || 'N/A'}
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
                  )) :
                  <Table.Row>
                    <Table.Cell colSpan="7">
                      <InlineLoader text="No data available." />
                    </Table.Cell>
                  </Table.Row>
                }
              </Table.Body>
            </Table>
          </div>
          {/* {totalRecords > 0 &&
            <NsPagination floated="right" initRequest={this.paginate}
            meta={{ totalRecords, requestState }} />
          } */}
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
