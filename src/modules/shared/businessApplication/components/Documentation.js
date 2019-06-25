import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import FormElementWrap from './FormElementWrap';
import AppNavigation from './AppNavigation';
import BusinessDocumentation from './documentation/BusinessDocumentation';
import RealEstateDocumentation from './documentation/RealEstateDocumentation';

@inject('businessAppStore')
@observer
export default class Documentation extends Component {
  componentWillMount() {
    this.props.businessAppStore.setFieldvalue('applicationStep', 'documentation');
  }

  render() {
    const { currentApplicationType } = this.props.businessAppStore;
    const { hideFields } = this.props;
    return (
      <div className={hideFields ? 'inner-content-spacer' : 'ui container'}>
        <Form className="issuer-signup">
          {!hideFields
            && (
<FormElementWrap
  as="h1"
  header="Documentation"
  subHeader={`Quickly, safely and accurately submit your ${currentApplicationType === 'business' ? 'business' : 'real estate'} information.`}
/>
            )
          }
          {currentApplicationType === 'business'
            ? <BusinessDocumentation hideFields={hideFields} />
            : <RealEstateDocumentation hideFields={hideFields} />
          }
          <AppNavigation hideFields={hideFields} />
        </Form>
      </div>
    );
  }
}
