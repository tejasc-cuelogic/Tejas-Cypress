import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Header } from 'semantic-ui-react';
import { FormTextarea, FormInput } from '../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class OfferingOverview extends Component {
  render() {
    const { OFFERING_OVERVIEW_FRM, formChange } = this.props.offeringCreationStore;
    const formName = 'OFFERING_OVERVIEW_FRM';
    return (
      <Aux>
        <Form>
          {
            ['elevatorPitch', 'tombstoneDescription'].map(field => (
              <Aux>
                <FormTextarea
                  key={field}
                  name={field}
                  fielddata={OFFERING_OVERVIEW_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, formName)}
                  containerclassname="secondary"
                />
                <Divider section />
              </Aux>
            ))
          }
          <Header as="h4">
            Social Media
            <Header.Subheader>
              Links to social media profiles where investors can learn more about offering
            </Header.Subheader>
          </Header>
          {
            ['facebookProfile', 'linkedInProfile', 'twitterProfile', 'instagramProfile', 'yelpProfile'].map(field => (
              <FormInput
                key={field}
                name={field}
                fielddata={OFFERING_OVERVIEW_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
              />
            ))
          }
          <Divider section />
          <Header as="h4">
            Social media share links
            <Header.Subheader>
              Share links that go on the user’s social media to share the offering
            </Header.Subheader>
          </Header>
          <Header as="h4">
            Facebook
          </Header>
          <FormInput
            name="facebookSharelink"
            fielddata={OFFERING_OVERVIEW_FRM.fields.facebookSharelink}
            changed={(e, result) => formChange(e, result, formName)}
          />
          <FormTextarea
            name="facebookBlurb"
            fielddata={OFFERING_OVERVIEW_FRM.fields.facebookBlurb}
            changed={(e, result) => formChange(e, result, formName)}
            containerclassname="secondary"
          />
          <Header as="h4">
            Twitter
          </Header>
          <FormInput
            name="twitterSharelink"
            fielddata={OFFERING_OVERVIEW_FRM.fields.twitterSharelink}
            changed={(e, result) => formChange(e, result, formName)}
          />
          <FormTextarea
            name="twitterBlurb"
            fielddata={OFFERING_OVERVIEW_FRM.fields.twitterBlurb}
            changed={(e, result) => formChange(e, result, formName)}
            containerclassname="secondary"
          />
          <Divider section />
          <Header as="h4">
            Google
            <Header.Subheader>
              Google metadata that shows up when people search for the offering
            </Header.Subheader>
          </Header>
          <FormTextarea
            name="googleMetadata"
            fielddata={OFFERING_OVERVIEW_FRM.fields.googleMetadata}
            changed={(e, result) => formChange(e, result, formName)}
            containerclassname="secondary"
          />
          <Divider section />
          <Header as="h4">
            Issuer Website
            <Header.Subheader>
              Links to Issuer’s company website
            </Header.Subheader>
          </Header>
          <FormTextarea
            name="issuerWebsite"
            fielddata={OFFERING_OVERVIEW_FRM.fields.issuerWebsite}
            changed={(e, result) => formChange(e, result, formName)}
            containerclassname="secondary"
          />
        </Form>
      </Aux>
    );
  }
}
