import React, { Component } from 'react';
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Confirm, Accordion, Header, Modal } from 'semantic-ui-react';
import { SortableContainer, SortableElement, arrayMove, sortableHandle } from 'react-sortable-hoc';
import { CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../../constants/offering';
import InvestNowAddPage from './InvestNowAddPage';
import InvestNowAddToc from './InvestNowAddToc';
import InvestNowTocPreview from './InvestNowTocPreview';

const accountTitle = {
  INDIVIDUAL: 'Individual & IRA',
  ENTITY: 'Entity',
  ALL: 'All',
};

const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({ toc, handleAction, preview, isReadOnly, tocIndex, pageIndex }) => (
  <div className="row-wrap striped-table">
    <div className="balance first-column break-text">
      {!isReadOnly && <DragHandle />}
      <div>
      {preview(get(toc, 'label'))}
      </div>
    </div>
    <div className="balance width-100">
      {get(toc, 'account') ? accountTitle[get(toc, 'account')] : 'N/A'}
    </div>
    <div className={`action ${isReadOnly ? '' : 'right-align'} width-100`}>
      {!isReadOnly
        ? (
          <Button.Group>
            <Button color="green" className="link-button" onClick={e => handleAction(e, { action: 'REQUIRED', tocIndex, pageIndex })}>
              <Icon name="asterisk" color={get(toc, 'required') ? 'green' : ''} />
            </Button>
            <Button icon className="link-button" onClick={e => handleAction(e, { action: 'EDIT', tocIndex, pageIndex })}>
              <Icon className="ns-pencil" />
            </Button>
            <Button color="red" icon className="link-button" onClick={e => handleAction(e, { action: 'DELETE', tocIndex, pageIndex })}>
              <Icon className="ns-trash" color="red" />
            </Button>
          </Button.Group>
          ) : get(toc, 'required') ? 'Yes' : 'No'
        }
    </div>
  </div>
));
const SortableList = SortableContainer(({ data, handleAction, preview, isReadOnly, pageIndex }) => (
  <div className="tbody">
    {data && data.length ? data.map((toc, index) => (
      <SortableItem
        key={`item-${toc.index}`}
        toc={toc}
        tocIndex={index}
        handleAction={handleAction}
        index={index}
        pageIndex={pageIndex}
        preview={preview}
        isReadOnly={isReadOnly}
      />
    )) : <div className="center-align mb-10">No record found.</div>}
  </div>
));

const ToCList = ({ toc, title, regulation, isReadOnly, onSortEnd, handleAction, preview, addMore }) => (
  <>
  {title && <Header as="h6" content={title} />}
  <div className="ui card fluid">
    <div className="ui basic table">
      <div className="row-wrap striped-table thead">
        <div className="balance first-column">Label</div>
        <div className="balance width-100">Account</div>
        {isReadOnly ? <div className="balance width-100">Required</div> : <div className="action right-align width-100" />}
      </div>
      <SortableList
        pageIndex={toc.page}
        data={toc.toc}
        pressDelay={100}
        handleAction={handleAction}
        onSortEnd={e => onSortEnd(e, toc.page, regulation)}
        lockAxis="y"
        useDragHandle
        preview={preview}
        isReadOnly={isReadOnly}
      />
    </div>
  </div>
  {!isReadOnly && <Button size="small" color="blue" className="link-button" onClick={e => addMore(e, 'TOC', toc.page)}>+ Add ToC</Button>}
  </>
);

@inject('manageOfferingStore', 'agreementsStore', 'offeringsStore')
@withRouter
@observer
export default class InvestNowTocList extends Component {
  state = {
    showConfirm: null,
    activeIndex: [0],
    showModal: null,
    page: null,
    tocIndex: null,
    previewMode: false,
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

  updateState = (key, val) => {
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

  handleAction = (e, { action, tocIndex, pageIndex }) => {
    e.preventDefault();
    this.updateState('page', pageIndex);
    this.updateState('tocIndex', tocIndex);
    if (action === 'DELETE') {
      this.updateState('showConfirm', 'TOC_DELETE');
    } else if (action === 'EDIT') {
      this.updateState('showModal', 'TOC_EDIT');
    } else if (action === 'REQUIRED') {
      this.updateState('showConfirm', 'TOC_REQUIRED');
    }
  }

  onSortEnd = ({ oldIndex, newIndex }, page, regulation) => {
    if (oldIndex !== newIndex) {
      const { investNowAddData, updateOffering } = this.props.manageOfferingStore;
      const offeringData = investNowAddData({ regulation, page, type: 'REORDER' });
      const { index, investNow } = offeringData;
      if (index !== -1) {
        let sorted = arrayMove(investNow[index].toc, oldIndex, newIndex);
        sorted = sorted.map((s, i) => ({ ...s, order: i + 1 }));
        investNow[index] = {
          ...investNow[index],
          toc: sorted,
        };
        updateOffering({ keyName: 'investNow', offeringData: { page: investNow }, cleanData: true });
      }
    }
  }

  callbackFun = (e) => { e.preventDefault(); window.logger('Agreement Preview'); }

  addMore = (e, type, page) => {
    e.stopPropagation();
    this.updateState('showModal', type);
    this.updateState('page', page);
  }

  handlePreview = (page) => {
    this.updateState('page', page);
    this.updateState('previewMode', true);
  }

  handleClosePreview = () => this.updateState('previewMode', false);

  remove = (type, page, regulation, tocIndex) => {
    this.updateState('showConfirm', null);
    this.updateState('page', null);
    this.updateState('tocIndex', null);
    const { updateOffering, investNowAddData } = this.props.manageOfferingStore;
    let offeringData;
    if (['TOC_REQUIRED', 'PAGE', 'TOC_DELETE'].includes(type)) {
      offeringData = investNowAddData({ type, page, regulation, tocIndex });
    }
    updateOffering({ keyName: 'investNow', offeringData, cleanData: true });
  }

  preview = label => this.props.agreementsStore.preview(label, { docuSignHandeler: this.callbackFun, refLink: '', agreementPDFLoader: this.callbackFun });

  render() {
    const { data, regulation, offeringsStore, manageOfferingStore } = this.props;
    const { offer } = offeringsStore;
    const { INVEST_NOW_TOC_TEMPLATE_FRM } = manageOfferingStore;
    const { showConfirm, activeIndex, showModal, page, tocIndex, previewMode } = this.state;
    const tocTemplate = INVEST_NOW_TOC_TEMPLATE_FRM.fields.template.value;
    const isReadOnly = get(offer, 'stage') !== 'CREATION' || tocTemplate !== 2 || (!get(offer, 'investNow.page') && tocTemplate === 2);
    return (
      <>
        {!isReadOnly && <Button size="small" color="blue" floated="right" className="link-button mt-20 mb-20" onClick={e => this.addMore(e, 'PAGE')}>+ Add Page</Button>}
        {data && data.length ? data.map((toc, index) => (data.length === 1 ? (
          <>
            <div className="toc-header">
              <Header as="h6" content={toc.title} />
              <Button.Group>
                {data.length
                  && (
                  <Button color="green" className="link-button mb-10" onClick={() => this.handlePreview(toc.page)}>
                    <Icon className="ns-view" />
                  </Button>
                )}
                {!isReadOnly && data.length
                  && (
                  <Button className="link-button mb-10" onClick={() => { this.updateState('showModal', 'PAGE_EDIT'); this.updateState('page', toc.page); }}>
                    <Icon className="ns-pencil" />
                  </Button>
                )}
              </Button.Group>
            </div>
            <ToCList
              toc={toc}
              handleAction={this.handleAction}
              onSortEnd={this.onSortEnd}
              preview={this.preview}
              isReadOnly={isReadOnly}
              regulation={regulation}
              addMore={this.addMore}
            />
          </>
        ) : (
          <Accordion exclusive={false} fluid styled className={`card-style ${index === 0 ? 'mt-20' : ''}`}>
            <Accordion.Title onClick={() => this.toggleAccordianContent(index)}>
              <Icon className={activeIndex.includes(index) ? 'ns-chevron-up' : 'ns-chevron-down'} />
              {`${CAMPAIGN_KEYTERMS_REGULATION[toc.regulation]} ToC Page - ${toc.page}`}
              {!isReadOnly
              && (
                <>
                  {data.length > 1 && <Button floated="right" color="red" className="link-button mb-10" onClick={() => { this.updateState('showConfirm', 'PAGE'); this.updateState('page', toc.page); }}><Icon className="ns-trash" /></Button>}
                  {data.length && <Button floated="right" className="link-button mb-10" onClick={() => { this.updateState('showModal', 'PAGE_EDIT'); this.updateState('page', toc.page); }}><Icon className="ns-pencil" /></Button>}
                </>
              )}
              {data.length && <Button color="green" floated="right" className="link-button mb-10" onClick={() => this.handlePreview(toc.page)}><Icon className="ns-view" /></Button>}
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(index)} className="categories-acc">
            <ToCList
              toc={toc}
              title={toc.title}
              handleAction={this.handleAction}
              onSortEnd={this.onSortEnd}
              preview={this.preview}
              isReadOnly={isReadOnly}
              regulation={regulation}
              addMore={this.addMore}
            />
            </Accordion.Content>
          </Accordion>
        ))) : ''}
        {previewMode && <InvestNowTocPreview handleClosePreview={this.handleClosePreview} page={page} regulation={regulation} previewMode callbackFun={this.callbackFun} />}
        <Modal open={!!showModal} closeIcon onClose={() => this.updateState('showModal', null)} size="small" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h3">{['PAGE_EDIT', 'TOC_EDIT'].includes(showModal) ? 'Edit' : 'Add new'} {['PAGE', 'PAGE_EDIT'].includes(showModal) ? 'ToC page' : 'ToC'}</Header>
          </Modal.Header>
          <Modal.Content className="signup-content">
            {['PAGE', 'PAGE_EDIT'].includes(showModal) && <InvestNowAddPage type={showModal} regulation={regulation} page={page} />}
            {['TOC', 'TOC_EDIT'].includes(showModal) && <InvestNowAddToc type={showModal} tocIndex={tocIndex} page={page} regulation={regulation} />}
          </Modal.Content>
        </Modal>
        <Confirm
          header="Confirm"
          content={showConfirm === 'TOC_REQUIRED' ? 'Are you sure you want to execute required action?' : `Are you sure you want to remove ${showConfirm === 'PAGE' ? `ToC page - ${page}` : 'ToC'}`}
          open={!!showConfirm}
          onCancel={() => this.updateState('showConfirm', null)}
          onConfirm={() => this.remove(showConfirm, page, regulation, tocIndex)}
          size="mini"
          className="deletion"
        />
      </>
    );
  }
}
