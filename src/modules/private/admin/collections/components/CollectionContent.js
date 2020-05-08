import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { get } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { Form, Divider, Header, Icon, Confirm, Button } from 'semantic-ui-react';
import formHOC from '../../../../../theme/form/formHOC';
import Offerings from './Offerings';
import Insights from './Insights';
import AddToCollection from '../../../shared/marketing/AddToCollection';


const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_CONTENT_FRM',
};
const offeringMeta = {
  live: 'ACTIVE_INVESTMENTS', completed: 'COMPLETE_INVESTMENTS',
};
@inject('collectionStore', 'nsUiStore', 'uiStore')
@withRouter
@observer
class CollectionContent extends Component {
  state = {
    editable: false,
    showConfirm: false,
  }

  constructor(props) {
    super(props);
    const { index } = this.props.match.params;
    if (index) {
      const { COLLECTION_CONTENT_FRM } = this.props.collectionStore;
      const currIndex = parseInt(index, 10) - 1;
      const { value } = COLLECTION_CONTENT_FRM.fields.content[currIndex].contentType;
      this.props.collectionStore.getCollectionMapping(value, currIndex);
    }
  }

  removeMedia = (form, name) => {
    window.logger(form, name);
  }

  updateState = (val, key = 'editable') => {
    this.setState({ [key]: val });
  }

  handleFormSubmit = (reOrder = false) => {
    const params = {
      keyName: false,
      forms: ['COLLECTION_CONTENT_FRM'],
    };
    if (reOrder) {
      this.props.collectionStore.reOrderHandle(this.props.collectionStore.COLLECTION_CONTENT_FRM.fields.content, 'COLLECTION_CONTENT_FRM', 'content');
    }
    this.props.collectionStore.upsertCollection(params);
  }

  handleDeleteAction = () => {
    this.props.collectionStore.removeOne('COLLECTION_CONTENT_FRM', 'content', this.props.index);
    this.handleFormSubmit(true);
    this.props.history.push(this.props.refLink);
  }

  render() {
    const { smartElement, collectionStore, uiStore } = this.props;
    const index = parseInt(this.props.match.params.index, 10) - 1 || 0;
    const { COLLECTION_CONTENT_FRM, collectionId, collectionMapping } = collectionStore;
    const { value: contentTypeValue } = COLLECTION_CONTENT_FRM.fields.content[index].contentType;
    const { loadingArray } = this.props.nsUiStore;
    return (
      <div className="inner-content-spacer">
        <Form>
          <small className="pull-right">
            {!this.state.editable
              ? <Link to="/" onClick={(e) => { e.preventDefault(); this.updateState(true); }}><Icon className="ns-pencil" />Edit</Link>
              : <Link to="/" className="text-link mr-10" onClick={(e) => { e.preventDefault(); this.updateState(false); }}>Cancel</Link>
            }
            {COLLECTION_CONTENT_FRM.fields.content.length > 1 && <Link to="/" className="ml-10 negative-text" onClick={(e) => { e.preventDefault(); this.updateState(true, 'showConfirm'); }}><Icon className="ns-trash" />Delete</Link>}
          </small>
          <Form.Group widths={2}>
            {smartElement.Input('title', { multiForm: [metaInfo.form, 'content', index], displayMode: !this.state.editable })}
            {smartElement.FormSelect('scope', { multiForm: [metaInfo.form, 'content', index], displayMode: !this.state.editable })}
            {smartElement.Masked('order', { multiForm: [metaInfo.form, 'content', index], displayMode: !this.state.editable })}
            {smartElement.FormSelect('contentType', { multiForm: [metaInfo.form, 'content', index], displayMode: !this.state.editable })}
          </Form.Group>
          {['ACTIVE_INVESTMENTS', 'COMPLETE_INVESTMENTS', 'INSIGHTS'].includes(contentTypeValue)
            && (
              <Form.Group widths={1}>
                <Form.Field>
                  <Header as="h6">Description</Header>
                  {smartElement.HtmlEditor('description', { multiForm: [metaInfo.form, 'content', index], index, readOnly: !this.state.editable, imageUploadPath: `collections/${collectionId}` })}
                </Form.Field>
              </Form.Group>
            )}
          <Divider hidden />
          {['CUSTOM', 'HEADER'].includes(COLLECTION_CONTENT_FRM.fields.content[index].contentType.value)
            && (
              <Form.Group widths={1}>
                <Form.Field>
                  <Header as="h6">{COLLECTION_CONTENT_FRM.fields.content[index].contentType.value === 'CUSTOM' ? COLLECTION_CONTENT_FRM.fields.content[index].customValue.label : 'Issuer Statement'}</Header>
                  {smartElement.HtmlEditor('customValue', { multiForm: [metaInfo.form, 'content', index], index, readOnly: !this.state.editable, imageUploadPath: `collections/${collectionId}` })}
                </Form.Field>
              </Form.Group>
            )}
          <Divider hidden />
          {get(collectionMapping, 'OFFERING')
            && (Object.keys(offeringMeta).map(key => (contentTypeValue === offeringMeta[key] && collectionMapping.OFFERING[key].length > 0
              && (
                <>
                  <Offerings offeringsList={collectionMapping.OFFERING[key]} isLoading={loadingArray.includes('getCollectionMapping')} />
                </>
              ))))}

          {(contentTypeValue === 'INSIGHTS' && collectionMapping.INSIGHT && collectionMapping.INSIGHT.length > 0
            && (
              <>
                <Insights insightsList={collectionMapping.INSIGHT} isLoading={loadingArray.includes('getCollectionMapping')} />
              </>
            ))
          }
          {(this.state.editable)
            && (
              <>
                <div className="sticky-actions">
                  <Button.Group vertical={uiStore.responsiveVars.isMobile} size={uiStore.responsiveVars.isMobile ? 'mini' : ''} compact={uiStore.responsiveVars.isMobile} className={uiStore.responsiveVars.isMobile ? 'sticky-buttons' : ''}>
                    <Button disabled={!this.state.editable || loadingArray.includes('adminCollectionUpsert')} loading={loadingArray.includes('adminCollectionUpsert')} primary onClick={this.handleFormSubmit} color="green" className="relaxed">Save</Button>
                  </Button.Group>
                </div>
              </>
            )}
          {
            ['ACTIVE_INVESTMENTS', 'COMPLETE_INVESTMENTS', 'INSIGHTS'].includes(contentTypeValue)
            && (
              <AddToCollection isDisabled={!this.state.editable} collectionId={collectionId} isContentMapping isOffering={contentTypeValue !== 'INSIGHTS'} {...this.props} />
            )
          }

          <Divider hidden />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this component?"
          open={this.state.showConfirm}
          onCancel={() => this.updateState(false, 'showConfirm')}
          onConfirm={this.handleDeleteAction}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}

export default formHOC(CollectionContent, metaInfo);
