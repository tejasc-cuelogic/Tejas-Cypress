/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Button, Icon, Header } from 'semantic-ui-react';
// import { FieldError } from '../../shared';

const FormArrowButton = observer((props) => {
  const {
    content,
    description,
    name,
    // value,
    // error,
    // placeHolder,
  } = props.fielddata;
  return (
    <Button basic fluid labelPosition="left" className="arrow-button">
      <div className="details">
        {content && <Header as="h5">{content}</Header>}
        {name && <span>{name}</span>}
        {description && description}
      </div>
      <Icon className="ns-chevron-right" />
    </Button>
  );
});

export default FormArrowButton;
