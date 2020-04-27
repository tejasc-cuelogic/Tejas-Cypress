import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Form, Divider, Header, Icon, Confirm } from 'semantic-ui-react';
// import Comments from '../../Comments';
// import Updates from '../../Updates';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_CONTENT_FRM',
};

function CollectionContent(props) {
  // state = {
  //   editable: false,
  //   showConfirm: false,
  // };

  const updateState = (val, key = 'editable') => {
    this.setState({ [key]: val });
  };

  const handleFormSubmit = (reOrder = false) => {
    // const params = {
    //   keyName: false,
    //   forms: ['COLLECTION_CONTENT_FRM'],
    // };
    if (reOrder) {
      props.collectionStore.reOrderHandle(props.collectionStore.COLLECTION_CONTENT_FRM.fields.content, 'COLLECTION_CONTENT_FRM', 'content');
    }
    // props.collectionStore.updateOffering(params);
  };

  const handleDeleteAction = () => {
    props.collectionStore.removeOne('COLLECTION_CONTENT_FRM', 'content', props.index);
    handleFormSubmit(true);
    props.history.push(props.refLink);
  };

    const { smartElement, index, offeringCreationStore, collectionStore } = props;
    const { currentOfferingId } = offeringCreationStore;
    const { COLLECTION_CONTENT_FRM } = collectionStore;
    // const isReadOnly = campaignStatus.lock;
    return (
      <div className="inner-content-spacer">
        <Form>
          <small className="pull-right">
            {!this.state.editable
              ? <Link to="/" onClick={(e) => { e.preventDefault(); updateState(true); }}><Icon className="ns-pencil" />Edit</Link>
              : <Link to="/" className="text-link mr-10" onClick={(e) => { e.preventDefault(); updateState(false); }}>Cancel</Link>
            }
            {COLLECTION_CONTENT_FRM.fields.content.length > 1 && <Link to="/" className="ml-10 negative-text" onClick={(e) => { e.preventDefault(); updateState(true, 'showConfirm'); }}><Icon className="ns-trash" />Delete</Link>}
          </small>
          <Form.Group widths={2}>
            {smartElement.Input('title', { multiForm: [metaInfo.form, 'content', index], displayMode: !this.state.editable })}
            {smartElement.FormSelect('scope', { multiForm: [metaInfo.form, 'content', index], displayMode: !this.state.editable })}
            {smartElement.Masked('order', { multiForm: [metaInfo.form, 'content', index], displayMode: true })}
            {smartElement.FormSelect('contentType', { multiForm: [metaInfo.form, 'content', index], displayMode: !this.state.editable })}
          </Form.Group>
          <Divider hidden />
          {['CUSTOM', 'ISSUER_STATEMENT'].includes(COLLECTION_CONTENT_FRM.fields.content[index].contentType.value)
            && (
              <Form.Group widths={1}>
                <Form.Field>
                  <Header as="h6">{COLLECTION_CONTENT_FRM.fields.content[index].contentType.value === 'CUSTOM' ? COLLECTION_CONTENT_FRM.fields.content[index].customValue.label : 'Issuer Statement'}</Header>
                  {smartElement.HtmlEditor('customValue', { multiForm: [metaInfo.form, 'content', index], index, readOnly: false, imageUploadPath: `offerings/${currentOfferingId}` })}
                </Form.Field>
              </Form.Group>
            )}
          <Divider hidden />
          {/* {(this.state.editable || COLLECTION_CONTENT_FRM.fields.content[index].contentType.value === 'CUSTOM' || onDragSaveEnable)
            && (
            <OfferingButtonGroup
              updateOffer={this.handleFormSubmit}
            />
          )} */}
          <Divider section />
          {/* {COLLECTION_CONTENT_FRM.fields.content[index].contentType.value === 'BONUS_REWARDS'
          && (
            <>
              <BonusRewards {...props} />
              <Misc />
            </>
          )} */}
          {/* {COLLECTION_CONTENT_FRM.fields.content[index].contentType.value === 'DATA_ROOM' && <DataRoom {...props} />}
          {COLLECTION_CONTENT_FRM.fields.content[index].contentType.value === 'GALLERY' && <Gallery {...props} />} */}
          {/* {OFFERING_CONTENT_FRM.fields.content[index].contentType.value === 'UPDATES' && <Updates {...props} />} */}
          <Divider hidden />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this component?"
          open={this.state.showConfirm}
          onCancel={() => updateState(false, 'showConfirm')}
          onConfirm={handleDeleteAction}
          size="mini"
          className="deletion"
        />
      </div>
    );
}

export default inject('collectionStore', 'offeringCreationStore')(observer((formHOC(CollectionContent, metaInfo))));
