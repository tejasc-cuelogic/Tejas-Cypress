import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Header, Button, Icon } from 'semantic-ui-react';
import { FormTextarea, FormInput } from '../../../../../../theme/form';

@inject('offeringCreationStore', 'userStore')
@observer
export default class OfferingOverview extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_OVERVIEW_FRM', 'offering', 'overview');
    this.props.offeringCreationStore.setFormData('OFFERING_HIGHLIGHTS_FRM', 'offering', 'overview', 'highlight');
  }
  addNewBullet = (e) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore('OFFERING_HIGHLIGHTS_FRM');
  }
  render() {
    const {
      OFFERING_OVERVIEW_FRM,
      OFFERING_HIGHLIGHTS_FRM,
      formChange,
      formChangeWithIndex,
    } = this.props.offeringCreationStore;
    const { isIssuer } = this.props.userStore;
    const formName = 'OFFERING_OVERVIEW_FRM';
    return (
      <div className={isIssuer ? 'ui card fluid form-card' : ''}>
        <Form>
          {
            ['elevatorPitch', 'tombstoneDescription'].map(field => (
              <Aux>
                <Header as="h4">{OFFERING_OVERVIEW_FRM.fields[field].label}</Header>
                <FormTextarea
                  key={field}
                  name={field}
                  fielddata={OFFERING_OVERVIEW_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, formName)}
                  containerclassname="secondary"
                  hidelabel
                />
                <Divider section />
              </Aux>
            ))
          }
          <Header as="h4">Offering highlights (Top bullet points)</Header>
          {
            OFFERING_HIGHLIGHTS_FRM.fields.data.map((highlights, index) => (
              <FormInput
                name="highlight"
                label={`Bullet ${index + 1}`}
                fielddata={highlights.highlight}
                changed={(e, result) => formChangeWithIndex(e, result, 'OFFERING_HIGHLIGHTS_FRM', index)}
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
                changed={(e, result) => formChange(e, result, formName)}
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
            changed={(e, result) => formChange(e, result, formName)}
          />
          <FormTextarea
            name="facebook_blurb"
            fielddata={OFFERING_OVERVIEW_FRM.fields.facebook_blurb}
            changed={(e, result) => formChange(e, result, formName)}
            containerclassname="secondary"
          />
          <Header as="h6">Twitter</Header>
          <FormInput
            name="twitter_shareLink"
            fielddata={OFFERING_OVERVIEW_FRM.fields.twitter_shareLink}
            changed={(e, result) => formChange(e, result, formName)}
          />
          <FormTextarea
            name="twitter_blurb"
            fielddata={OFFERING_OVERVIEW_FRM.fields.twitter_blurb}
            changed={(e, result) => formChange(e, result, formName)}
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
            changed={(e, result) => formChange(e, result, formName)}
            containerclassname="secondary"
          />
          <Divider section />
          <Header as="h4">Issuer Website
            <Header.Subheader>Links to Issuer’s company website</Header.Subheader>
          </Header>
          <FormInput
            name="issuerWebsite"
            fielddata={OFFERING_OVERVIEW_FRM.fields.issuerWebsite}
            changed={(e, result) => formChange(e, result, formName)}
          />
          <Divider hidden />
          <div className="clearfix mb-20">
            <Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />
              Submitted by ISSUER_NAME on 2/3/2018
            </Button>
            <Button.Group floated="right">
              <Button inverted color="red" content="Decline" disabled={!(OFFERING_OVERVIEW_FRM.meta.isValid && OFFERING_HIGHLIGHTS_FRM.meta.isValid)} />
              <Button color="green" className="relaxed" disabled={!(OFFERING_OVERVIEW_FRM.meta.isValid && OFFERING_HIGHLIGHTS_FRM.meta.isValid)}>Approve</Button>
            </Button.Group>
          </div>
          <div className="clearfix">
            <Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />
              Approved by MANAGER_NAME on 2/3/2018
            </Button>
            <Button.Group floated="right">
              <Button primary type="button" color="green" className="relaxed" disabled={!(OFFERING_OVERVIEW_FRM.meta.isValid && OFFERING_HIGHLIGHTS_FRM.meta.isValid)}>Save</Button>
            </Button.Group>
          </div>
        </Form>
      </div>
    );
  }
}

