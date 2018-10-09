import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Header, Button, Icon } from 'semantic-ui-react';
import { FormTextarea, FormInput } from '../../../../../../theme/form';

@inject('offeringCreationStore', 'userStore')
@observer
export default class OfferingOverview extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_COMPANY_FRM', 'offering.about');
    this.props.offeringCreationStore.setFormData('COMPANY_LAUNCH_FRM', 'offering.launch');
    this.props.offeringCreationStore.setFormData('OFFERING_OVERVIEW_FRM', 'offering.overview');
  }
  addNewBullet = (e) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore('OFFERING_OVERVIEW_FRM', 'highlight');
  }
  handleFormSubmit = () => {
    const {
      OFFERING_OVERVIEW_FRM,
      currentOfferingId, updateOffering,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, OFFERING_OVERVIEW_FRM.fields, 'offering', 'overview');
  }
  render() {
    const {
      OFFERING_OVERVIEW_FRM,
      formArrayChange,
    } = this.props.offeringCreationStore;
    const formName = 'OFFERING_OVERVIEW_FRM';
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    return (
      <Form onSubmit={this.handleFormSubmit}>
        {
          ['elevatorPitch', 'tombstoneDescription'].map(field => (
            <Aux>
              <Header as="h4">{OFFERING_OVERVIEW_FRM.fields[field].label}</Header>
              <FormTextarea
                key={field}
                name={field}
                fielddata={OFFERING_OVERVIEW_FRM.fields[field]}
                changed={(e, result) => formArrayChange(e, result, formName)}
                containerclassname="secondary"
                hidelabel
              />
              <Divider section />
            </Aux>
          ))
        }
        <Header as="h4">Offering highlights (Top bullet points)</Header>
        {
          OFFERING_OVERVIEW_FRM.fields.highlight.map((highlights, index) => (
            <FormInput
              name="highlight"
              label={`Bullet ${index + 1}`}
              fielddata={highlights.highlight}
              changed={(e, result) => formArrayChange(e, result, 'OFFERING_OVERVIEW_FRM', 'highlight', index)}
            />
          ))
        }
        <Button type="button" size="small" color="blue" className="link-button" onClick={e => this.addNewBullet(e)}>+ Add new bullet</Button>
        <Divider section />
        <Header as="h4">Social Media
          <Header.Subheader>
            Links to social media profiles where investors can learn more about offering
          </Header.Subheader>
        </Header>
        {
          ['facebook_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'yelp_url'].map(field => (
            <FormInput
              key={field}
              name={field}
              fielddata={OFFERING_OVERVIEW_FRM.fields[field]}
              changed={(e, result) => formArrayChange(e, result, formName)}
            />
          ))
        }
        <Divider section />
        <Header as="h4">Social media share links
          <Header.Subheader>
            Share links that go on the user’s social media to share the offering
          </Header.Subheader>
        </Header>
        <Header as="h6">Facebook</Header>
        <FormInput
          name="facebook_shareLink"
          fielddata={OFFERING_OVERVIEW_FRM.fields.facebook_shareLink}
          changed={(e, result) => formArrayChange(e, result, formName)}
        />
        <FormTextarea
          name="facebook_blurb"
          fielddata={OFFERING_OVERVIEW_FRM.fields.facebook_blurb}
          changed={(e, result) => formArrayChange(e, result, formName)}
          containerclassname="secondary"
        />
        <Header as="h6">Twitter</Header>
        <FormInput
          name="twitter_shareLink"
          fielddata={OFFERING_OVERVIEW_FRM.fields.twitter_shareLink}
          changed={(e, result) => formArrayChange(e, result, formName)}
        />
        <FormTextarea
          name="twitter_blurb"
          fielddata={OFFERING_OVERVIEW_FRM.fields.twitter_blurb}
          changed={(e, result) => formArrayChange(e, result, formName)}
          containerclassname="secondary"
        />
        <Divider section />
        <Header as="h4">Google
          <Header.Subheader>
            Google metadata that shows up when people search for the offering
          </Header.Subheader>
        </Header>
        <FormTextarea
          name="googleMeta"
          fielddata={OFFERING_OVERVIEW_FRM.fields.googleMeta}
          changed={(e, result) => formArrayChange(e, result, formName)}
          containerclassname="secondary"
        />
        <Divider section />
        <Header as="h4">Issuer Website
          <Header.Subheader>Links to Issuer’s company website</Header.Subheader>
        </Header>
        <FormInput
          name="issuerWebsite"
          fielddata={OFFERING_OVERVIEW_FRM.fields.issuerWebsite}
          changed={(e, result) => formArrayChange(e, result, formName)}
        />
        <Divider hidden />
        <div className="clearfix">
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />
            Submitted by USER_NAME on 2/3/2018
          </Button>
          <Button.Group floated="right">
            {access.asManager ? (
              <Aux>
                <Button inverted color="red" content="Decline" disabled={!OFFERING_OVERVIEW_FRM.meta.isValid} />
                <Button color="green" className="relaxed" disabled={!OFFERING_OVERVIEW_FRM.meta.isValid}>Approve</Button>
              </Aux>
            ) : (
              <Button primary color="green" className="relaxed" disabled={!OFFERING_OVERVIEW_FRM.meta.isValid}>Save</Button>
            )}
          </Button.Group>
        </div>
      </Form>
    );
  }
}

