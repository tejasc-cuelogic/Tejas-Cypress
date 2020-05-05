import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { get } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { Form, Divider, Header, Icon, Confirm } from 'semantic-ui-react';
// import Comments from '../../Comments';
// import Updates from '../../Updates';
import formHOC from '../../../../../theme/form/formHOC';
import Listing from '../../offerings/components/Listing';
import AllInsights from '../../insights/components/AllInsights';


const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_CONTENT_FRM',
};
const offeringMeta = {
  live: 'ACTIVE_INVESTMENTS', complete: 'COMPLETE_INVESTMENTS',
};
@inject('collectionStore', 'nsUiStore')
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
      this.props.collectionStore.getCollectionMapping(parseInt(index, 10) - 1);
    }
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
    this.props.collectionStore.updateOffering(params);
  }

  handleDeleteAction = () => {
    this.props.collectionStore.removeOne('COLLECTION_CONTENT_FRM', 'content', this.props.index);
    this.handleFormSubmit(true);
    this.props.history.push(this.props.refLink);
  }

  render() {
    const { smartElement, collectionStore } = this.props;
    const index = parseInt(this.props.match.params.index, 10) - 1 || 0;
    const { COLLECTION_CONTENT_FRM, collection, collectionId, collectionMapping } = collectionStore;
    const isReadOnly = get(collection, 'lock');
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
            {smartElement.Masked('order', { multiForm: [metaInfo.form, 'content', index], displayMode: true })}
            {smartElement.FormSelect('contentType', { multiForm: [metaInfo.form, 'content', index], displayMode: !this.state.editable })}
          </Form.Group>
          <Divider hidden />
          {['CUSTOM', 'HEADER'].includes(COLLECTION_CONTENT_FRM.fields.content[index].contentType.value)
            && (
              <Form.Group widths={1}>
                <Form.Field>
                  <Header as="h6">{COLLECTION_CONTENT_FRM.fields.content[index].contentType.value === 'CUSTOM' ? COLLECTION_CONTENT_FRM.fields.content[index].customValue.label : 'Issuer Statement'}</Header>
                  {smartElement.HtmlEditor('customValue', { multiForm: [metaInfo.form, 'content', index], index, readOnly: isReadOnly, imageUploadPath: `collections/${collectionId}` })}
                </Form.Field>
              </Form.Group>
            )}
          <Divider hidden />
          {get(collectionMapping, 'OFFERING')
            && (Object.keys(offeringMeta).map(key => (contentTypeValue === offeringMeta[key] && collectionMapping.OFFERING[key].length > 0
              && (
                <>
                  <Listing allLiveOfferingsList={collectionMapping.OFFERING[key]} isLoading={loadingArray.includes('getCollectionMapping')} />
                </>
              ))))}

          {(contentTypeValue === 'INSIGHTS' && collectionMapping.INSIGHT && collectionMapping.INSIGHT.length > 0
            && (
              <>
                <AllInsights insightsList={collectionMapping.INSIGHT} isLoading={loadingArray.includes('getCollectionMapping')} />
              </>
            ))
          }

          <Divider section />

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
