import React, { Component } from 'react';
import { Grid, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import FormElementWrap from './FormElementWrap';
import AppNavigation from './AppNavigation';
import BusinessDocumentation from '../components/documentation/BusinessDocumentation';
import RealEstateDocumentation from '../components/documentation/RealEstateDocumentation';

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
      <Grid container>
        <Grid.Column>
          <Form className="issuer-signup">
            <FormElementWrap
              as="h1"
              header="Documentation"
              subHeader={!hideFields && `Quickly, safely and accurately submit your ${currentApplicationType === 'business' ? 'business' : 'real estate'} information.`}
            />
            {currentApplicationType === 'business' ?
              <BusinessDocumentation hideFields={hideFields} /> :
              <RealEstateDocumentation hideFields={hideFields} />
            }
            <AppNavigation />
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
