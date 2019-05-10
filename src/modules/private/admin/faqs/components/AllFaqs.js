import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { SortableContainer, SortableElement, sortableHandle, arrayMove } from 'react-sortable-hoc';
import { Button, Icon, Label, Confirm, Accordion } from 'semantic-ui-react';
import { InlineLoader } from './../../../../../theme/shared';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
};
const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({
  faq, key, handleAction,
}) => (
  <div className="row-wrap striped-table" key={key}>
    <div className="balance-half first-column">
      <DragHandle />
      <Label color={`${faq.itemStatus === 'PUBLISHED' ? 'green' : faq.itemStatus === 'DRAFT' ? 'red' : 'yellow'}`} circular empty className="mr-10" />
      <span className="user-name">
        <Link to={`/app/faqs/${faq.id}`}>{faq.question}</Link>
      </span>
    </div>
    <div className="action width-100 right-align">
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
    )) }
  </div>
));
@inject('faqStore', 'uiStore')
@withRouter
@observer
export default class AllFaqs extends Component {
  state = { activeIndex: 0, innerActiveIndex: [] }
  componentWillMount() {
    this.props.faqStore.initRequest(); // load data
  }
  onSortEnd = ({ oldIndex, newIndex }, faqType, categorizedFaqs) => {
    const { allCategorizedFaqs, setFaqOrder } = this.props.faqStore;
    if (oldIndex !== newIndex) {
      setFaqOrder(arrayMove(allCategorizedFaqs[faqType][categorizedFaqs], oldIndex, newIndex));
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
  toggleAccordion = (index, field) => {
    let stateChange = [];
    const newIndex = this.state[field] === index ? -1 : index;
    if (field === 'activeIndex') {
      stateChange = { activeIndex: newIndex };
    } else if (this.state.innerActiveIndex.includes(index)) {
      this.state.innerActiveIndex =
        this.state.innerActiveIndex.filter(innerIndex => innerIndex !== index);
    } else {
      this.state.innerActiveIndex.push(newIndex);
      stateChange = { ...this.state };
    }
    // const stateChange = field === 'activeIndex' ?
    // { activeIndex: newIndex, innerActiveIndex: 0 } : { innerActiveIndex: newIndex };
    this.setState(stateChange);
  }
  render() {
    const { activeIndex, innerActiveIndex } = this.state;
    const {
      confirmBox,
      selectedRecords,
      allCategorizedFaqs,
      loading,
    } = this.props.faqStore;
    const { inProgress } = this.props.uiStore;
    if (inProgress || loading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        {Object.keys(allCategorizedFaqs).map(faqType => (
          <Accordion key={faqType} fluid styled className="card-style">
            <Accordion.Title onClick={() => this.toggleAccordion(faqType, 'activeIndex')} className="text-capitalize">
              <Icon className={activeIndex === faqType ? 'ns-chevron-up' : 'ns-chevron-down'} />
              {faqType}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === faqType} className="categories-acc">
              {Object.keys(allCategorizedFaqs[faqType]).map(categorizedFaqs => (
                <Accordion key={categorizedFaqs} styled fluid className="card-style">
                  <Accordion.Title onClick={() => this.toggleAccordion(categorizedFaqs, 'innerActiveIndex')} className="text-capitalize">
                    <Icon className={!innerActiveIndex.includes(categorizedFaqs) ? 'ns-chevron-up' : 'ns-chevron-down'} />
                    {categorizedFaqs}
                  </Accordion.Title>
                  <Accordion.Content active={!innerActiveIndex.includes(categorizedFaqs)} className="categories-acc">
                    <SortableList
                      allFaqs={allCategorizedFaqs[faqType][categorizedFaqs]}
                      pressDelay={100}
                      onSortEnd={e => this.onSortEnd(e, faqType, categorizedFaqs)}
                      lockAxis="y"
                      useDragHandle
                      handleAction={this.handleAction}
                      checkedRecords={this.checkedRecords}
                      selectedRecords={selectedRecords}
                    />
                  </Accordion.Content>
                </Accordion>
              ))}
            </Accordion.Content>
          </Accordion>
        ))}
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
