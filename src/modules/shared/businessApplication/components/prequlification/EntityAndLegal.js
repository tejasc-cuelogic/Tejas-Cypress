import React from 'react';
import Aux from 'react-aux';
import { FormRadioGroup, FormCheckbox } from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';

const EntityAndLegal = props => (
  <Aux>
    <FormElementWrap hideFields={props.hideFields} header="What is your company’s entity structure? *">
      <FormRadioGroup
        disabled={props.preQualFormDisabled}
        fielddata={props.fields.businessEntityStructure}
        name="businessEntityStructure"
        changed={props.businessAppEleChange}
        iconic
        containerclassname="iconic-radio"
      />
    </FormElementWrap>
    <FormElementWrap
      hideFields={props.hideFields}
      noDivider
      header="Legal Confirmation"
      subHeader={!props.hideFields ?
        'Please check all that apply. Note some of these items are not disqualifying conditions, but a NextSeed representative may follow up to verify any applicable details.'
        : ''}
    >
      <FormCheckbox
        disabled={props.preQualFormDisabled}
        fielddata={props.fields.legalConfirmation}
        name="legalConfirmation"
        changed={props.businessAppEleChange}
        defaults
        containerclassname="ui relaxed list"
      />
    </FormElementWrap>
  </Aux>
);

export default EntityAndLegal;
