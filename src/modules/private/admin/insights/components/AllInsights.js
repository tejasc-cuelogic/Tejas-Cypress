import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { join } from 'lodash';
import { Card, Table, Button, Icon, Label, Confirm } from 'semantic-ui-react';
import { DateTimeFormat, InlineLoader } from '../../../../../theme/shared';
import { DataFormatter } from '../../../../../helper';

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
  constructor(props) {
    super(props);
    this.props.articleStore.sortArticlesByFilter();
  }

  globalActionChange = (e, { name, value }) => this.props.articleStore.setGlobalAction(name, value);

  handleAction = (action, articleId, status) => {
    if (action === 'Delete') {
      this.handleDeleteConfirm(articleId);
    } else if (action === 'Edit') {
      this.props.articleStore.currentArticleId = articleId;
      this.props.history.push(`${this.props.match.url}/${articleId}/${status}`);
    }
  }

  handleDeleteConfirm = (id) => {
    this.props.uiStore.setConfirmBox('Delete', id);
  }

  handleDelete = () => {
    this.props.articleStore.deleteArticle(this.props.uiStore.confirmBox.refId).then(() => {
      this.props.uiStore.setConfirmBox('');
      this.props.history.replace(this.props.refLink);
    });
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
    const { confirmBox, inProgress } = this.props.uiStore;
    const {
      articleListingLoader,
      sortOrder,
      adminInsightList,
    } = articleStore;
    if (articleListingLoader || inProgress) {
      return <InlineLoader />;
    }
    if (adminInsightList.length === 0) {
      return <InlineLoader text="No data found." />;
    }
    return (
      <>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable striped sortable className="user-list">
              <Table.Header>
                <Table.Row>
                  {meta.map(cell => (
                    <Table.HeaderCell
                      key={cell.label.split(' ')[0]}
                      width={cell.value === 'title' ? 5 : ''}
                      textAlign={cell.value === 'action' ? 'center' : ''}
                      sorted={sortOrder.column === cell.value ? sortOrder.direction === 'asc' ? 'ascending' : 'descending' : null}
                      onClick={this.handleSort(cell.value)}
                    >
                      {cell.label}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {adminInsightList ? adminInsightList.map(record => (
                  <Table.Row key={record.id}>
                    <Table.Cell><Link to={`${this.props.match.url}/${record.id}/${record.articleStatus}`}>{record.title || '-'}</Link></Table.Cell>
                    <Table.Cell>{record.category || 'N/A'}</Table.Cell>
                    <Table.Cell>{record.tags ? join(record.tags, ', ') : '-'}</Table.Cell>
                    <Table.Cell>
                      {record.author || 'N/A'}
                    </Table.Cell>
                    <Table.Cell><Label color={`${record.articleStatus === 'PUBLISHED' ? 'green' : record.articleStatus === 'DRAFT' ? 'red' : 'yellow'}`} circular empty /></Table.Cell>
                    <Table.Cell>
                      <DateTimeFormat format="MM-DD-YYYY" datetime={DataFormatter.getDateAsPerTimeZone((record.updated && record.updated.date), true, false, false)} />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button.Group>
                        {Object.keys(actions).map(action => (
                          <Button className="link-button">
                            <Icon className={`ns-${actions[action].icon}`} onClick={() => this.handleAction(actions[action].label, record.id, record.articleStatus)} />
                          </Button>
                        ))}
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))
                  : (
<Table.Row>
                  <Table.Cell colSpan="7">
                    <InlineLoader text="No data available." />
                  </Table.Cell>
                </Table.Row>
                  )}
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
      </>
    );
  }
}
