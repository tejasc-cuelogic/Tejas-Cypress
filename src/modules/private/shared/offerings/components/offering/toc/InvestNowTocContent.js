import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Form, Divider, Icon, Confirm } from 'semantic-ui-react';
import OfferingButtonGroup from '../../OfferingButtonGroup';
import formHOC from '../../../../../../../theme/form/formHOC';
// import Helper from '../../../../../../../helper/utility';

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

  handleDeleteAction = (e) => {
    e.preventDefault();
    const { manageOfferingStore, history, index, refLink } = this.props;
    manageOfferingStore.removeOne('INVEST_NOW_TOC_FRM', 'toc', index);
    history.push(`${refLink}/${index}`);
  }

  render() {
    const { smartElement, index, manageOfferingStore } = this.props;
    const { INVEST_NOW_TOC_FRM } = manageOfferingStore;
    const isReadOnly = false;
    return (
      <div className="inner-content-spacer">
        <Form>
          <small>
            <Link to="/" onClick={(e) => { e.preventDefault(); this.preview(INVEST_NOW_TOC_FRM.fields.toc[index].label.value); }}><Icon className="ns-view" />Preview</Link>
          </small>
          {!isReadOnly && INVEST_NOW_TOC_FRM.fields.toc.length > 1
            && (
              <small className="pull-right">
                <Link to="/" className="ml-10 negative-text" onClick={(e) => { e.preventDefault(); this.updateState(true, 'showConfirm'); }}><Icon className="ns-trash" />Delete</Link>
              </small>
            )}
          {smartElement.FormDropDown('account', { multiForm: [metaInfo.form, 'toc', index], displayMode: isReadOnly })}
          {smartElement.FormDropDown('regulation', { multiple: true, multiForm: [metaInfo.form, 'toc', index], displayMode: isReadOnly })}
          {smartElement.RadioGroup('required', { multiForm: [metaInfo.form, 'toc', index], displayMode: isReadOnly })}
          {smartElement.TextArea('label', { multiForm: [metaInfo.form, 'toc', index], displayMode: isReadOnly })}
          <Divider hidden />
          {!isReadOnly
            && (
              <OfferingButtonGroup
                updateOffer={this.handleFormSubmit}
              />
            )}
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
