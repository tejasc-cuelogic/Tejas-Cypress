import React from 'react';
import { Header, Divider } from 'semantic-ui-react';
import Aux from 'react-aux';

const FormElementWrap = props => (
  <Aux>
    <Header as={props.as || 'h2'}>
      {props.header}
      {props.subHeader &&
        <Header.Subheader>{props.subHeader}</Header.Subheader>
      }
    </Header>
    {props.children}
    <Divider section className="doubled" />
  </Aux>
);

export default FormElementWrap;
