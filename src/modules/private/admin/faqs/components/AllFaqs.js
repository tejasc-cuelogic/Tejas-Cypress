import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { Button, Grid, Form, Checkbox, Icon, Label, Confirm } from 'semantic-ui-react';
import { DropdownFilter } from '../../../../../theme/form/Filters';
import { InlineLoader, NsPagination, DateTimeFormat } from './../../../../../theme/shared';
import { FAQ_TYPE_ENUM, GLOBAL_ACTIONS } from '../../../../../services/constants/admin/faqs';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
};
const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({
  faq, key, handleAction, checkedRecords, selectedRecords,
}) => (
  <div className="row-wrap" key={key}>
    <div className="balance">
      <DragHandle />
    </div>
    <div className="balance">
      <Checkbox
        name={faq.id}
        value={faq.id}
        checked={selectedRecords.includes(faq.id)}
        onChange={(e, result) => checkedRecords(e, result)}
      />
    </div>
    <div className="balance-half">
      <span className="user-name">
        <Link to={`/app/faqs/${faq.id}`}>{faq.question}</Link>
      </span>
    </div>
    <div className="balance-half">{FAQ_TYPE_ENUM[faq.faqType]}</div>
    <div className="balance-half">{faq.categoryName || 'N/A'}</div>
    <div className="balance-half">{faq.author || 'N/A'}</div>
    <div className="balance-half"><Label color={`${faq.itemStatus === 'PUBLISHED' ? 'green' : faq.itemStatus === 'DRAFT' ? 'red' : 'yellow'}`} circular empty /></div>
    <div className="balance-half">
      <DateTimeFormat format="MM-DD-YYYY" datetime={faq.updated && faq.updated.date} />
    </div>
    <div className="balance-half">{faq.order}</div>
    <div className="action right-align">
      <Button.Group>
        {Object.keys(actions).map(action => (
          <Button className="link-button" >
            <Icon className={`ns-${actions[action].icon}`} onClick={() => handleAction(actions[action].label, faq.id, faq.itemStatus)} />
          </Button>
        ))}
      </Button.Group>
    </div>
  </div>
));

const SortableList = SortableContainer(({
  allFaqs, handleAction, checkedRecords, selectedRecords,
}) => (
  <div className="tbody">
    { allFaqs.map((faq, index) => (
      <SortableItem
        key={faq.id}
        docIndx={index}
        faq={faq}
        index={index}
        handleAction={handleAction}
        checkedRecords={checkedRecords}
        selectedRecords={selectedRecords}
      />
    )) };
  </div>
));
@inject('faqStore', 'uiStore')
@withRouter
@observer
export default class AllFaqs extends Component {
  componentWillMount() {
    this.props.faqStore.initRequest(); // load data
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { allFaqs, setFaqOrder } = this.props.faqStore;
    if (oldIndex !== newIndex) {
      setFaqOrder(allFaqs[newIndex], newIndex);
    }
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
      count,
      requestState,
      confirmBox,
      applyGlobalAction,
      disableApply,
      selectedCount,
      selectedRecords,
      globalAction,
    } = this.props.faqStore;
    const totalRecords = count || 0;
    const { inProgress } = this.props.uiStore;
    if (inProgress) {
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
        <div className="ui card fluid">
          <div className="ui basic table team-table striped">
            <div className="row-wrap thead">
              <div className="balance">&nbsp;</div>
              <div className="balance">
                <Checkbox
                  indeterminate={selectedCount > 0 && !selectedRecords.includes('all')}
                  value="all"
                  checked={selectedRecords.includes('all')}
                  onChange={(e, result) => this.checkAll(e, result)}
                />
              </div>
              <div className="balance-half">Title</div>
              <div className="balance-half">Type</div>
              <div className="balance-half">Category</div>
              <div className="balance-half">Author</div>
              <div className="balance-half">Status</div>
              <div className="balance-half">Last update date</div>
              <div className="balance-half">Order</div>
              <div className="action right-align" />
            </div>
            <SortableList
              allFaqs={allFaqs}
              pressDelay={100}
              onSortEnd={e => this.onSortEnd(e)}
              lockAxis="y"
              useDragHandle
              handleAction={this.handleAction}
              checkedRecords={this.checkedRecords}
              selectedRecords={selectedRecords}
            />
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
          onConfirm={this.deleteFaq}
          closeOnDimmerClick={false}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
