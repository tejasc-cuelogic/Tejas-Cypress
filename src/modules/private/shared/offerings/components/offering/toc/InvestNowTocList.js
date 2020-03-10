import React, { Component } from 'react';
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Confirm, Accordion } from 'semantic-ui-react';
import { SortableContainer, SortableElement, arrayMove, sortableHandle } from 'react-sortable-hoc';
// import Helper from '../../../../../../../helper/utility';


const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({ toc, handleAction, preview, isReadOnly, tocIndex }) => (
    <div className="row-wrap striped-table">
      <div className="balance first-column">
        <DragHandle />
        {preview(get(toc, 'label'))}
      </div>
      <div className="balance width-100">
        {get(toc, 'account')}
      </div>
      <div className="balance width-100">
        {get(toc, 'required') ? 'Yes' : 'No'}
      </div>
      <div className="action right-align width-100">
        <Button.Group>
          {!isReadOnly
            && (
              <>
              <Button icon className="link-button">
                <Icon className="ns-view" onClick={e => handleAction(e, 'REQUIRED', tocIndex)} />
              </Button>
              <Button icon className="link-button">
                <Icon className="ns-pencil" onClick={e => handleAction(e, 'EDIT', tocIndex)} />
              </Button>
              <Button icon className="link-button">
                <Icon className="ns-trash" onClick={e => handleAction(e, 'DELETE', tocIndex)} />
              </Button>
              </>
            )
          }
        </Button.Group>
      </div>
    </div>
));
const SortableList = SortableContainer(({ data, handleAction, preview, isReadOnly }) => (
    <div className="tbody">
      {data && data.length && data.map((toc, index) => (
        <SortableItem
          key={`item-${toc.order}`}
          toc={toc}
          tocIndex={index}
          handleAction={handleAction}
          index={index}
          preview={preview}
          isReadOnly={isReadOnly}
        />
      ))}
    </div>
));
@inject('manageOfferingStore', 'agreementsStore')
@withRouter
@observer
export default class InvestNowTocList extends Component {
  state = {
    showConfirm: false,
    activeIndex: [0],
  };

  toggleAccordianContent = (categoryIndex = null) => {
    const index = categoryIndex;
    const { activeIndex } = this.state;
    const newIndex = activeIndex;

    const currentIndexPosition = activeIndex.indexOf(index);
    if (currentIndexPosition > -1) {
      newIndex.splice(currentIndexPosition, 1);
    } else {
      newIndex.push(index);
    }

    this.setState({ activeIndex: newIndex });
  };

  updateState = (val, key = 'editable') => {
    this.setState({ [key]: val });
  }

  handleFormSubmit = () => {
    const { reOrderHandle, updateOffering, INVEST_NOW_TOC_FRM } = this.props.manageOfferingStore;
    const params = {
      keyName: 'investNow',
      forms: ['INVEST_NOW_TOC_FRM'],
      cleanData: true,
    };
    reOrderHandle(INVEST_NOW_TOC_FRM.fields.toc, 'INVEST_NOW_TOC_FRM', 'toc');
    updateOffering(params);
  }

  handleAction = (e, action, index) => {
    e.preventDefault();
    console.log(action, index);
    // const { manageOfferingStore, history, index, refLink } = this.props;
    // manageOfferingStore.removeOne('INVEST_NOW_TOC_FRM', 'toc', index);
    // history.push(`${refLink}/${index}`);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { allOfferingsSorted, setOrderForOfferings } = this.props.offeringsStore;
    const { allLiveOfferingsList, stage } = this.props;
    const offeringList = stage === 'live' && allLiveOfferingsList ? allLiveOfferingsList : allOfferingsSorted;
    const isArrayNeedToMerge = !!(stage === 'live' && allLiveOfferingsList);
    if (oldIndex !== newIndex) {
      setOrderForOfferings(arrayMove(offeringList, oldIndex, newIndex), this.props.stage, isArrayNeedToMerge, this.props.offeringListIndex);
    }
  }

  callbackFun = (e) => { e.preventDefault(); window.logger('Agreement Preview'); }

  addMore = (e, type) => {
    e.stopPropagation();
    window.logger('Agreement Preview', type);
  }

  preview = label => this.props.agreementsStore.preview(label, { docuSignHandeler: this.callbackFun, refLink: '', agreementPDFLoader: this.callbackFun });

  render() {
    const { data } = this.props;
    const { showConfirm, activeIndex } = this.state;
    const isReadOnly = false;
    return (
      <>
      <Button size="small" color="blue" floated="right" className="link-button mt-20 mb-20" onClick={e => this.addMore(e, 'PAGE')}>+ Add another Page</Button>
      {data && data.length && data.map((toc, index) => (
        <Accordion exclusive={false} fluid styled className={`card-style ${index === 0 ? 'mt-20' : ''}`}>
          <Accordion.Title onClick={() => this.toggleAccordianContent(index)}>
            <Icon className={activeIndex.includes(index) ? 'ns-chevron-up' : 'ns-chevron-down'} />
            {`Page - ${index + 1}`}
            <Button size="small" floated="right" color="blue" className="link-button mt-10" onClick={e => this.addMore(e, 'TOC')}>+ Add another TOC</Button>
          </Accordion.Title>
          <Accordion.Content active={activeIndex.includes(index)} className="categories-acc">
            <div className="ui card fluid">
              <div className="ui basic table">
                <div className="row-wrap striped-table thead">
                  <div className="balance first-column">Label</div>
                  <div className="balance width-100">Account</div>
                  <div className="balance width-100">Required</div>
                  <div className="action right-align width-100" />
                </div>
                <SortableList
                  data={toc.toc}
                  pressDelay={100}
                  handleAction={this.handleAction}
                  onSortEnd={e => this.onSortEnd(e)}
                  lockAxis="y"
                  useDragHandle
                  preview={this.preview}
                  isReadOnly={isReadOnly}
                />
              </div>
            </div>
          </Accordion.Content>
        </Accordion>
      ))}
        <Confirm
          header="Confirm"
          content={showConfirm === 'Publish' ? `Are you sure you want to make this offering ${this.state.isPublic ? 'Public' : 'Non-Public'}?` : 'Are you sure you want to delete this offering?'}
          open={showConfirm === 'Delete' || showConfirm === 'Publish'}
          onCancel={this.handleDeleteCancel}
          onConfirm={showConfirm === 'Publish' ? this.handlePublishOffering : this.handleDeleteOffering}
          size="mini"
          className="deletion"
        />
      </>
    );
  }
}
