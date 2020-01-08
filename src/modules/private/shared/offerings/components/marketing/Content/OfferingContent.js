import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Divider, Header } from 'semantic-ui-react';
import OfferingButtonGroup from '../../OfferingButtonGroup';
import BonusRewards from '../../BonusRewards';
import Comments from '../../Comments';
import Updates from '../../Updates';
import DataRoom from '../../legal/DataRoom';
import formHOC from '../../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'OFFERING_CONTENT_FRM',
};

@inject('manageOfferingStore', 'offeringCreationStore')
@withRouter
@observer
class OfferingContent extends Component {
  handleFormSubmit = () => {
    const params = {
      keyName: false,
      forms: ['OFFERING_CONTENT_FRM'],
    };
    this.props.manageOfferingStore.updateOffering(params);
  }

  render() {
    const { smartElement, index, offeringCreationStore, manageOfferingStore } = this.props;
    const { currentOfferingId } = offeringCreationStore;
    const { OFFERING_CONTENT_FRM } = manageOfferingStore;
    const isReadonly = false;
    return (
      <div className="inner-content-spacer">
        <Form>
          <Form.Group widths={2}>
            {smartElement.Input('title', { multiForm: [metaInfo.form, 'content', index] })}
            {smartElement.Masked('order', { multiForm: [metaInfo.form, 'content', index] })}
            {smartElement.FormSelect('scope', { multiForm: [metaInfo.form, 'content', index] })}
            {smartElement.FormSelect('contentType', { multiForm: [metaInfo.form, 'content', index] })}
          </Form.Group>
          <Divider hidden />
          {OFFERING_CONTENT_FRM.fields.content[index].contentType.value === 'CUSTOM'
          && (
          <Form.Group widths={1}>
            <Form.Field>
              <Header as="h6">{OFFERING_CONTENT_FRM.fields.content[index].customValue.label}</Header>
              {smartElement.HtmlEditor('customValue', { multiForm: [metaInfo.form, 'content', index], index, readOnly: isReadonly, imageUploadPath: `offerings/${currentOfferingId}` })}
            </Form.Field>
          </Form.Group>
          )}
          <Divider hidden />
          {/* {!['BONUS_REWARDS', 'DATA_ROOM'].includes(OFFERING_CONTENT_FRM.fields.content[index].contentType.value)
          && ( */}
          <OfferingButtonGroup
            updateOffer={this.handleFormSubmit}
          />
          {/* )} */}
          <Divider section />
          {OFFERING_CONTENT_FRM.fields.content[index].contentType.value === 'BONUS_REWARDS' && <BonusRewards {...this.props} />}
          {OFFERING_CONTENT_FRM.fields.content[index].contentType.value === 'DATA_ROOM' && <DataRoom {...this.props} />}
          {OFFERING_CONTENT_FRM.fields.content[index].contentType.value === 'COMMENTS' && <Comments {...this.props} />}
          {OFFERING_CONTENT_FRM.fields.content[index].contentType.value === 'UPDATES' && <Updates {...this.props} />}
          <Divider hidden />
        </Form>
      </div>
    );
  }
}

export default formHOC(OfferingContent, metaInfo);
