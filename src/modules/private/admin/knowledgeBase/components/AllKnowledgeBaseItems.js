/* eslint-disable max-len */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { SortableContainer, SortableElement, sortableHandle, arrayMove } from 'react-sortable-hoc';
import _ from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Button, Icon, Label, Confirm, Accordion } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
};

const DragHandle = sortableHandle(props => <Icon className={`${props.className} ns-drag-holder-large mr-10`} />);
const SortableItem = SortableElement(({
  knowledgeBase, key, handleAction,
}) => (
  <div className="row-wrap striped-table" key={key}>
    <div className="balance-half first-column">
      <DragHandle />
      <Label color={`${knowledgeBase.itemStatus === 'PUBLISHED' ? 'green' : knowledgeBase.itemStatus === 'DRAFT' ? 'red' : 'yellow'}`} circular empty className="mr-10" />
      <span className="user-name">
        <Link to={`/app/knowledge-base/${knowledgeBase.id}/${knowledgeBase.itemStatus}`}>{_.capitalize(knowledgeBase.title)}</Link>
      </span>
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
  allCategorizedKnowledgeBase, handleAction, checkedRecords, getSelectedRecords,
}) => (
  <div className="tbody">
    {allCategorizedKnowledgeBase.map((knowledgeBase, index) => (
      <SortableItem
        key={knowledgeBase.id}
        docIndx={index}
        knowledgeBase={knowledgeBase}
        index={index}
        handleAction={handleAction}
        checkedRecords={checkedRecords}
        getSelectedRecords={getSelectedRecords}
      />
    ))}
  </div>
));
@withRouter
@inject('knowledgeBaseStore', 'uiStore')
@observer
export default class AllKnowledgeBaseItems extends Component {
  state = { activeIndex: 0, innerActiveIndex: [] }
  componentWillMount() {
    this.props.knowledgeBaseStore.resetPagination();
    this.props.knowledgeBaseStore.resetSearch();
    this.props.knowledgeBaseStore.initRequest(); // load data
  }
  onSortEnd = ({ oldIndex, newIndex }, userType, category) => {
    const { allCategorizedKnowledgeBase, setKnowledgeBaseOrder } = this.props.knowledgeBaseStore;
    if (oldIndex !== newIndex) {
      // eslint-disable-next-line max-len
      setKnowledgeBaseOrder(arrayMove(allCategorizedKnowledgeBase[userType][category], oldIndex, newIndex));
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
    } else {
      this.props.knowledgeBaseStore.removeSelectedRecords(result.value);
    }
  }
  toggleAccordion = (index, field) => {
    let stateChange = { ...this.state };
    const newIndex = this.state[field] === index ? -1 : index;
    if (field === 'activeIndex') {
      stateChange = { activeIndex: newIndex, innerActiveIndex: [] };
    } else if (this.state.innerActiveIndex.includes(index)) {
      this.state.innerActiveIndex = this.state.innerActiveIndex.filter(innerIndex => innerIndex !== index);
      stateChange = { ...this.state };
    } else {
      this.state.innerActiveIndex.push(index);
      stateChange = { ...this.state };
    }
    this.setState(stateChange);
  }
  checkedAllRecords = (e, result) => {
    this.props.knowledgeBaseStore.selectRecordsOnPage(result.checked);
  }

  render() {
    const { knowledgeBaseStore } = this.props;
    const {
      loading,
      confirmBox,
      categoryLoading,
      allCategorizedKnowledgeBase,
    } = knowledgeBaseStore;
    const { activeIndex, innerActiveIndex } = this.state;
    if (loading || categoryLoading) {
      return <InlineLoader />;
    }
    if (Object.keys(allCategorizedKnowledgeBase).length === 0) {
      return <InlineLoader text="No data found." />;
    }
    return (
      <Aux>
        {Object.keys(allCategorizedKnowledgeBase).map(userType => (
          <Accordion key={userType} fluid styled className="card-style">
            <Accordion.Title onClick={() => this.toggleAccordion(userType, 'activeIndex')} className="text-capitalize">
              <Icon className={activeIndex === userType ? 'ns-chevron-up' : 'ns-chevron-down'} />
              {userType}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === userType} className="categories-acc pt-0">
              {Object.keys(allCategorizedKnowledgeBase[userType]).map(category => (
                <Accordion key={category} fluid styled>
                  <Accordion.Title onClick={() => this.toggleAccordion(category, 'innerActiveIndex')} className="text-capitalize">
                    <Icon className={!innerActiveIndex.includes(category) ? 'ns-chevron-up' : 'ns-chevron-down'} />
                    {allCategorizedKnowledgeBase[userType][category][0].categoryName}
                    <Button as={Link} to={`${this.props.match.url}/new/DRAFT/${userType}/${category}`} className="link-button pull-right"><small>+ Add Knowledge Base Article</small></Button>
                  </Accordion.Title>
                  <Accordion.Content active={!innerActiveIndex.includes(category)}>
                    <SortableList
                      allCategorizedKnowledgeBase={allCategorizedKnowledgeBase[userType][category]}
                      pressDelay={100}
                      onSortEnd={e => this.onSortEnd(e, userType, category)}
                      lockAxis="y"
                      useDragHandle
                      handleAction={this.handleAction}
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
          onConfirm={this.deleteKnowledgeBase}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
