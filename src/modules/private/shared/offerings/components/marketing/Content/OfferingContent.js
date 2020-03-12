import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Form, Divider, Header, Icon, Confirm } from 'semantic-ui-react';
import OfferingButtonGroup from '../../OfferingButtonGroup';
import BonusRewards from '../../BonusRewards';
// import Comments from '../../Comments';
// import Updates from '../../Updates';
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
  state = {
    editable: false,
    showConfirm: false,
  }

  updateState = (val, key = 'editable') => {
    this.setState({ [key]: val });
  }

  handleFormSubmit = (reOrder = false) => {
    const params = {
      keyName: false,
      forms: ['OFFERING_CONTENT_FRM'],
    };
    if (reOrder) {
      this.props.manageOfferingStore.reOrderHandle(this.props.manageOfferingStore.OFFERING_CONTENT_FRM.fields.content);
    }
    this.props.manageOfferingStore.updateOffering(params);
  }

  handleDeleteAction = () => {
    this.props.manageOfferingStore.removeOne('OFFERING_CONTENT_FRM', 'content', this.props.index);
    this.handleFormSubmit(true);
    this.props.history.push(this.props.refLink);
  }

  render() {
    const { smartElement, index, offeringCreationStore, manageOfferingStore } = this.props;
    const { currentOfferingId } = offeringCreationStore;
    const { OFFERING_CONTENT_FRM, onDragSaveEnable } = manageOfferingStore;
    const isReadonly = false;
    return (
      <div className="inner-content-spacer">
        <Form>
          <small className="pull-right">
            {!this.state.editable
              ? <Link to="/" onClick={(e) => { e.preventDefault(); this.updateState(true); }}><Icon className="ns-pencil" />Edit</Link>
              : <Link to="/" className="text-link mr-10" onClick={(e) => { e.preventDefault(); this.updateState(false); }}>Cancel</Link>
            }
            <Link to="/" className="ml-10 negative-text" onClick={(e) => { e.preventDefault(); this.updateState(true, 'showConfirm'); }}><Icon className="ns-trash" />Delete</Link>
          </small>
          <Form.Group widths={2}>
            {smartElement.Input('title', { multiForm: [metaInfo.form, 'content', index], displayMode: !this.state.editable })}
            {smartElement.FormSelect('scope', { multiForm: [metaInfo.form, 'content', index], displayMode: !this.state.editable })}
            {smartElement.Masked('order', { multiForm: [metaInfo.form, 'content', index], displayMode: true })}
            {smartElement.FormSelect('contentType', { multiForm: [metaInfo.form, 'content', index], displayMode: !this.state.editable })}
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
          {(this.state.editable || OFFERING_CONTENT_FRM.fields.content[index].contentType.value === 'CUSTOM' || onDragSaveEnable)
            && (
            <OfferingButtonGroup
              updateOffer={this.handleFormSubmit}
            />
          )}
          <Divider section />
          {OFFERING_CONTENT_FRM.fields.content[index].contentType.value === 'BONUS_REWARDS' && <BonusRewards {...this.props} />}
          {OFFERING_CONTENT_FRM.fields.content[index].contentType.value === 'DATA_ROOM' && <DataRoom {...this.props} />}
          {/* {OFFERING_CONTENT_FRM.fields.content[index].contentType.value === 'COMMENTS' && <Comments {...this.props} />}
          {OFFERING_CONTENT_FRM.fields.content[index].contentType.value === 'UPDATES' && <Updates {...this.props} />} */}
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

export default formHOC(OfferingContent, metaInfo);
