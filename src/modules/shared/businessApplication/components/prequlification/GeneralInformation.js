import React from 'react';
import { Header, Grid, Form, Popup, Icon } from 'semantic-ui-react';
import { FormInput, MaskedInput, AutoComplete } from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';

const GeneralInformation = props => (
  <FormElementWrap hideFields={props.hideFields} header="General Information">
    <div className="application-scroll" />
    <Grid>
      <Grid.Column widescreen={8} largeScreen={8} computer={8} tablet={16} mobile={16}>
        <div className="field-wrap">
          {
            ['businessName', 'website'].map(field => (
              <FormInput
                containerclassname={props.preQualFormDisabled ? 'display-only' : ''}
                readOnly={props.preQualFormDisabled}
                key={field}
                type="text"
                name={field}
                label={field === 'businessName' ? props.currentApplicationType === 'business' ? 'Business Name' : 'Entity Name' : 'Website'}
                fielddata={props.fields[field]}
                changed={props.businessAppEleChange}
              />
            ))
          }
          <MaskedInput
            containerclassname={props.preQualFormDisabled ? 'display-only' : 'cre-scroll'}
            readOnly={props.preQualFormDisabled}
            name="phoneNumber"
            fielddata={props.fields.phoneNumber}
            changed={props.businessAppEleMaskChange}
          />
        </div>
      </Grid.Column>
      <Grid.Column widescreen={8} largeScreen={8} computer={8} tablet={16} mobile={16}>
        <div className="field-wrap">
          <Header as="h6">
            {props.currentApplicationType === 'business' ? 'Business Address' : 'Entity Address '}
            {props.currentApplicationType === 'commercial-real-estate' &&
            <Popup
              trigger={<Icon className="ns-help-circle" />}
              content="Enter address of investment location,
              not of owner or entity."
              position="top center"
              className="left-align"
              wide
            />
          }
          </Header>
          <AutoComplete
            containerclassname={props.preQualFormDisabled ? 'display-only' : ''}
            readOnly={props.preQualFormDisabled}
            name="street"
            fielddata={props.fields.street}
            onplaceselected={props.setAddressFields}
            changed={props.businessAppEleChange}
          />
          <Form.Group widths="equal">
            {
              ['city', 'state'].map(field => (
                <FormInput
                  containerclassname={props.preQualFormDisabled ? 'display-only' : ''}
                  readOnly={props.preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  fielddata={props.fields[field]}
                  changed={props.businessAppEleChange}
                />
                ))
              }
            <MaskedInput
              zipCode
              containerclassname={props.preQualFormDisabled ? 'display-only' : ''}
              readOnly={props.preQualFormDisabled}
              name="zipCode"
              fielddata={props.fields.zipCode}
              changed={props.businessAppEleMaskChange}
            />
          </Form.Group>
        </div>
      </Grid.Column>
    </Grid>
  </FormElementWrap>
);

export default GeneralInformation;
