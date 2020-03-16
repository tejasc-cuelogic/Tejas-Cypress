import React from 'react';
import { Header, Grid, Form } from 'semantic-ui-react';
import { FormInput, MaskedInput, AutoComplete } from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';
import { PopUpModal } from '../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

const GeneralInformation = props => (
  <FormElementWrap hideFields={props.hideFields} header="General Information">
    <span className="cre-scroll" />
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
                asterisk="true"
                label={field === 'businessName' ? 'Entity Name' : 'Website'}
                fielddata={props.fields[field]}
                changed={props.businessAppEleChange}
              />
            ))
          }
          <MaskedInput
            containerclassname={props.preQualFormDisabled ? 'display-only' : ''}
            readOnly={props.preQualFormDisabled}
            name="phoneNumber"
            asterisk="true"
            fielddata={props.fields.phoneNumber}
            changed={props.businessAppEleMaskChange}
          />
        </div>
      </Grid.Column>
      <Grid.Column widescreen={8} largeScreen={8} computer={8} tablet={16} mobile={16}>
        <div className="field-wrap">
          <Header as="h6">
            {props.currentApplicationType === 'commercial-real-estate'
            ? (
            <PopUpModal
              customTrigger={<span className="popup-label">Entity Address</span>}
              content="Enter address of investment location,
                          not of owner or entity."
              position="top center"
              className="left-align"
              wide
              showOnlyPopup={!isMobile}
            />
            ) : (<span>Entity Address</span>)
          }
          </Header>
          <AutoComplete
            containerclassname={props.preQualFormDisabled ? 'display-only' : ''}
            readOnly={props.preQualFormDisabled}
            name="street"
            asterisk="true"
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
                  asterisk="true"
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
              asterisk="true"
              fielddata={props.fields.zipCode}
              changed={props.businessAppEleMaskChange}
              showerror
            />
          </Form.Group>
        </div>
      </Grid.Column>
    </Grid>
  </FormElementWrap>
);

export default GeneralInformation;
