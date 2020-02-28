import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Form, Divider, Icon, Confirm } from 'semantic-ui-react';
import OfferingButtonGroup from '../../OfferingButtonGroup';
import formHOC from '../../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'INVEST_NOW_TOC_FRM',
};

@inject('manageOfferingStore')
@withRouter
@observer
class InvestNowTocContent extends Component {
  state = {
    showConfirm: false,
  }

  updateState = (val, key = 'editable') => {
    this.setState({ [key]: val });
  }

  handleFormSubmit = () => {
    const { reOrderHandle, updateOffering, INVEST_NOW_TOC_FRM } = this.props.manageOfferingStore;
    const params = {
      keyName: 'investNow',
      forms: ['INVEST_NOW_TOC_FRM'],
    };
    reOrderHandle(INVEST_NOW_TOC_FRM.fields.toc);
    updateOffering(params);
  }

  handleDeleteAction = () => {
    const { manageOfferingStore, history, index, refLink } = this.props;
    manageOfferingStore.removeOne('INVEST_NOW_TOC_FRM', 'toc', index);
    this.handleFormSubmit();
    history.push(refLink);
  }

  render() {
    const { smartElement, index, manageOfferingStore } = this.props;
    const { INVEST_NOW_TOC_FRM } = manageOfferingStore;
    return (
      <div className="inner-content-spacer">
        <Form>
          {INVEST_NOW_TOC_FRM.fields.toc.length > 1
          && (
            <small className="pull-right">
              <Link to="/" className="ml-10 negative-text" onClick={(e) => { e.preventDefault(); this.updateState(true, 'showConfirm'); }}><Icon className="ns-trash" />Delete</Link>
            </small>
          )}
          {smartElement.Masked('order', { multiForm: [metaInfo.form, 'toc', index], displayMode: true })}
          {smartElement.TextArea('label', { multiForm: [metaInfo.form, 'toc', index] })}
          {smartElement.FormDropDown('account', { multiForm: [metaInfo.form, 'toc', index] })}
          {smartElement.FormDropDown('regulation', { multiple: true, multiForm: [metaInfo.form, 'toc', index] })}
          <Divider hidden />
          <OfferingButtonGroup
            updateOffer={this.handleFormSubmit}
          />
          <Divider section />
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

export default formHOC(InvestNowTocContent, metaInfo);
