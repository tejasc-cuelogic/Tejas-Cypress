import React from 'react';
import { MaskedInput } from '../../../../../theme/form';

const Experience = props => (
  <>
    <MaskedInput
      maxlength="2"
      containerclassname={props.preQualFormDisabled ? 'display-only' : ''}
      readOnly={props.preQualFormDisabled}
      key="industryExperience"
      name="industryExperience"
      number
      asterisk="true"
      tooltip={props.fields.industryExperience.tooltip}
      value={props.fields.industryExperience.value}
      label={props.currentApplicationType === 'commercial-real-estate' ? 'How many years of related industry experience does your team have?' : 'How many years of directly relevant industry experience does your team have?'}
      fielddata={props.fields.industryExperience}
      changed={props.businessAppEleMaskChange}
    />
    <MaskedInput
      maxlength="3"
      containerclassname={props.preQualFormDisabled ? 'display-only' : ''}
      readOnly={props.preQualFormDisabled}
      key="estimatedCreditScore"
      name="estimatedCreditScore"
      number
      asterisk="true"
      tooltip={props.fields.estimatedCreditScore.tooltip}
      value={props.fields.estimatedCreditScore.value}
      fielddata={props.fields.estimatedCreditScore}
      changed={props.businessAppEleMaskChange}
    />
    {
      ['totalProjectCost', 'amountNeeded'].map(field => (
        <MaskedInput
          hoverable
          containerclassname={props.preQualFormDisabled ? 'display-only' : ''}
          readOnly={props.preQualFormDisabled}
          key={field}
          prefix="$ "
          name={field}
          currency
          asterisk="true"
          tooltip={props.fields[field].tooltip}
          value={props.fields[field].value}
          fielddata={props.fields[field]}
          changed={props.businessAppEleMaskChange}
        />
      ))
    }
  </>
);

export default Experience;
