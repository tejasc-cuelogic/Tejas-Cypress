/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Form } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import AddNewContingency from './overview/AddNewContingency';

@withRouter
@inject('offeringCreationStore')
@observer
export default class Overview extends Component {
  render() {
    const {
      LAUNCH_CONTITNGENCIES_FRM,
      CLOSING_CONTITNGENCIES_FRM,
      formChangeWithIndex,
    } = this.props.offeringCreationStore;
    const { match } = this.props;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Route exact path={`${match.url}/add-new-contingency`} render={props => <AddNewContingency refLink={match.url} {...props} />} />
          <Contingency formChangeWithIndex={formChangeWithIndex} form={LAUNCH_CONTITNGENCIES_FRM} formName="LAUNCH_CONTITNGENCIES_FRM" />
          <Contingency formChangeWithIndex={formChangeWithIndex} form={CLOSING_CONTITNGENCIES_FRM} formName="CLOSING_CONTITNGENCIES_FRM" />
        </div>
      </Form>
    );
  }
}
