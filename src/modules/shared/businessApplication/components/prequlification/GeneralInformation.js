import React from 'react';
import { Header, Grid, Form, Popup, Icon } from 'semantic-ui-react';
import { FormInput, MaskedInput, AutoComplete } from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';

const GeneralInformation = props => (
  <FormElementWrap header="General Information">
    <Grid>
      <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
        <div className="field-wrap">
          {
            ['businessName', 'website'].map(field => (
              <FormInput
                disabled={props.preQualFormDisabled}
                key={field}
                type="text"
                name={field}
                label={field === 'businessName' ? props.currentApplicationType === 'business' ? 'Business Name' : 'Entity Name' : 'Website'}
                value={props.fields[field].value}
                fielddata={props.fields[field]}
                changed={props.businessAppEleChange}
              />
            ))
          }
          <MaskedInput
            disabled={props.preQualFormDisabled}
            name="phoneNumber"
            fielddata={props.fields.phoneNumber}
            changed={props.businessAppEleMaskChange}
          />
        </div>
      </Grid.Column>
      <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
        <div className="field-wrap">
          <Header as="h6">
            {props.currentApplicationType === 'business' ? 'Business Address' : 'Entity Address '}
            {props.currentApplicationType === 'commercial-real-estate' &&
            <Popup
              trigger={<Icon className="ns-help-circle" />}
              content="Enter address of investment location,
              not of owner or entity."
              position="top center"
              className="center-align"
              wide
            />
          }
          </Header>
          <AutoComplete
            disabled={props.preQualFormDisabled}
            name="street"
            fielddata={props.fields.street}
            onplaceselected={props.setAddressFields}
            changed={props.businessAppEleChange}
          />
          <Form.Group widths="equal">
            {
              ['city', 'state', 'zipCode'].map(field => (
                <FormInput
                  disabled={props.preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  fielddata={props.fields[field]}
                  changed={props.businessAppEleChange}
                />
              ))
            }
          </Form.Group>
        </div>
      </Grid.Column>
    </Grid>
  </FormElementWrap>
);

export default GeneralInformation;
