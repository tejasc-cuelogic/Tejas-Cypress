import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import _ from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Checkbox, Button, Icon, Label, Grid, Form, Confirm } from 'semantic-ui-react';
import { GLOBAL_ACTIONS } from '../../../../../services/constants/admin/knowledgeBase';
import { DropdownFilter } from '../../../../../theme/form/Filters';
import { DateTimeFormat, InlineLoader, NsPagination } from '../../../../../theme/shared';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
};


const DragHandle = sortableHandle(props => <Icon className={`${props.className} ns-drag-holder-large mr-10`} />);
const SortableItem = SortableElement(({
  knowledgeBase, key, handleAction, checkedRecords,
}) => (
  <div className="row-wrap striped-table" key={key}>
    {/* <div className="balance">
    </div>
    <div className="balance">
    </div> */}
    <div className="balance-half first-column">
      <DragHandle />
      <Checkbox
        name={knowledgeBase.id}
        value={knowledgeBase.id}
        onChange={(e, result) => checkedRecords(e, result)}
      />
      <span className="user-name">
        <Link to={`/app/knowledge-base/${knowledgeBase.id}/${knowledgeBase.itemStatus}`}>
          <b>{_.capitalize(knowledgeBase.title)}</b>
        </Link>
      </span>
    </div>
    <div className="balance width-130">
      {_.capitalize(knowledgeBase.userType)}
    </div>
    <div className="balance-half">
      {_.capitalize(knowledgeBase.categoryName) || 'N/A'}
    </div>
    <div className="balance">
      {_.capitalize(knowledgeBase.authorName) || 'N/A'}
    </div>
    <div className="balance width-70 center-align">
      <Label color={`${knowledgeBase.itemStatus === 'PUBLISHED' ? 'green' : knowledgeBase.itemStatus === 'DRAFT' ? 'red' : 'yellow'}`} circular empty />
    </div>
    <div className="balance width-130">
      <DateTimeFormat format="MM-DD-YYYY" datetime={knowledgeBase.updated && knowledgeBase.updated.date} />
    </div>
    <div className="action width-100 right-align">
      <Button.Group>
        {Object.keys(actions).map(action => (
          <Button className="link-button" >
            <Icon className={`ns-${actions[action].icon}`} onClick={() => handleAction(actions[action].label, knowledgeBase.id, knowledgeBase.itemStatus)} />
          </Button>
        ))}
      </Button.Group>
    </div>
  </div>
));

const SortableList = SortableContainer(({
  AllKnowledgeBase, handleAction, checkedRecords,
}) => (
  <div className="tbody">
    {AllKnowledgeBase.map((knowledgeBase, index) => (
      <SortableItem
        key={knowledgeBase.id}
        docIndx={index}
        knowledgeBase={knowledgeBase}
        index={index}
        handleAction={handleAction}
        checkedRecords={checkedRecords}
      />
    ))}
  </div>
));

@withRouter
@inject('knowledgeBaseStore', 'uiStore')
@observer
export default class AllKnowledgeBaseItems extends Component {
  componentWillMount() {
    this.props.knowledgeBaseStore.initRequest(); // load data
    this.props.knowledgeBaseStore.resetPagination();
    this.props.knowledgeBaseStore.resetSearch();
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { AllKnowledgeBase, setKnowledgeBaseOrder } = this.props.knowledgeBaseStore;
    if (oldIndex !== newIndex) {
      setKnowledgeBaseOrder(AllKnowledgeBase[newIndex], newIndex);
    }
  }
  globalActionChange = (e, { name, value }) =>
    this.props.knowledgeBaseStore.setGlobalAction(name, value);

  handleAction = (action, articleId, status) => {
    if (action === 'Delete') {
      this.props.knowledgeBaseStore.setConfirmBox(action, articleId);
    } else if (action === 'Edit') {
      this.props.history.push(`${this.props.match.url}/${articleId}/${status}`);
    }
  }
  deleteKnowledgeBase = () => {
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
      categoryLoading,
      selectedRecordsCount,
      selectRecordsOnPage,
    } = knowledgeBaseStore;
    const totalRecords = count || 0;
    if (loading || categoryLoading) {
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
              <Grid.Column>Selected {selectedRecordsCount} items</Grid.Column>
              <Grid.Column width={3} floated="right">
                <DropdownFilter value={globalAction} change={this.globalActionChange} name="globalAction" keyName="globalAction" label="Global actions" options={GLOBAL_ACTIONS} />
              </Grid.Column>
              <Grid.Column width={2}>
                <Button inverted color="green" compact fluid content="Apply" onClick={applyGlobalAction} disabled={disableApply} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <div className="ui card fluid">
          <div className="ui basic table">
            <div className="row-wrap striped-table thead">
              {/* <div className="balance">&nbsp;</div>
              <div className="balance">
              </div> */}
              <div className="balance-half first-column">
                <DragHandle className="invisible" />
                <Checkbox
                  name="selectAllChkbox"
                  value="selectAllChkbox"
                  onChange={selectRecordsOnPage}
                  defaultIndeterminate
                />
                Title
              </div>
              <div className="balance width-130">Type</div>
              <div className="balance-half">Category</div>
              <div className="balance">Author</div>
              <div className="balance width-70 center-align">Status</div>
              <div className="balance width-130">Last update date</div>
              <div className="action width-100 right-align" />
            </div>
            {/* {AllKnowledgeBase.map((knowledgeBase, index) => ( */}
            <SortableList
              AllKnowledgeBase={AllKnowledgeBase}
              pressDelay={100}
              onSortEnd={e => this.onSortEnd(e)}
              lockAxis="y"
              useDragHandle
              handleAction={this.handleAction}
              checkedRecords={this.checkedRecords}
            />
            {/* ))} */}

          </div>
        </div>
        {totalRecords > 0 &&
          <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
        }
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this item?"
          open={confirmBox.entity === 'Delete'}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.deleteKnowledgeBase}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
