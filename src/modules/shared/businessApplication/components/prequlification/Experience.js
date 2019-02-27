import React from 'react';
import Aux from 'react-aux';
import { MaskedInput } from '../../../../../theme/form';

const Experience = props => (
  <Aux>
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
  </Aux>
);

export default Experience;
