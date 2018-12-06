import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class DataRoom extends Component {
  componentWillMount() {
    // if (!this.props.offeringCreationStore.initLoad.includes('DOCUMENTATION_FRM')) {
    //   this.props.offeringCreationStore.setFormData('DOCUMENTATION_FRM', 'legal.documentation.issuer');
    // }
  }
  render() {
    const { isIssuer } = this.props.userStore;
    return (
      <div className={isIssuer || (isIssuer && !match.url.includes('offering-creation')) ? 'ui card fluid form-card' : ''}>
        <Form>
          <Header as="h4">Documents</Header>
          data room...
        </Form>
      </div>
    );
  }
}
