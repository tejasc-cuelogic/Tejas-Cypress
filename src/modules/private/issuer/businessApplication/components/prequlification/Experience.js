import React from 'react';
import Aux from 'react-aux';
import { MaskedInput } from '../../../../../../theme/form';

const Experience = props => (
  <Aux>
    {
      ['industryExperience', 'estimatedCreditScore'].map(field => (
        <MaskedInput
          disabled={props.preQualFormDisabled}
          key={field}
          name={field}
          number
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
          disabled={props.preQualFormDisabled}
          key={field}
          prefix="$ "
          name={field}
          currency
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
