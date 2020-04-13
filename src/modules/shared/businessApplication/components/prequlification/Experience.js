import React from 'react';
import { MaskedInput } from '../../../../../theme/form';

const Experience = (props) => {
  const label = props.currentApplicationType === 'commercial-real-estate' ? 'How many years of related industry experience does your team have?' : 'How many years of directly relevant industry experience does your team have?';

  return (
    <>
      {
        ['industryExperience', 'estimatedCreditScore'].map(field => (
          <MaskedInput
            maxlength={field === 'estimatedCreditScore' ? 3 : 2}
            containerclassname={props.preQualFormDisabled ? 'display-only' : ''}
            readOnly={props.preQualFormDisabled}
            key={field}
            name={field}
            number
            asterisk="true"
            label={field === 'industryExperience' ? label : props.fields[field].label}
            tooltip={props.fields[field].tooltip}
            value={props.fields[field].value}
            fielddata={props.fields[field]}
            changed={props.businessAppEleMaskChange}
          />
        ))
      }
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
};

export default Experience;
