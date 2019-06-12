import React from 'react';
import { Header, Divider } from 'semantic-ui-react';
import Aux from 'react-aux';

const FormElementWrap = props => (
  <Aux>
    {props.header
      && (
      <Header as={props.hideFields ? 'h4' : props.as || 'h3'}>
        {props.header}
        {props.subHeader && !props.hideFields
          && <Header.Subheader>{props.subHeader}</Header.Subheader>
        }
      </Header>
      )
    }
    {props.children}
    {!props.noDivider
      && <Divider section className={!props.hideFields ? 'doubled' : ''} />
    }
  </Aux>
);

export default FormElementWrap;
