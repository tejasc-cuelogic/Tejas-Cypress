/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Button, Icon, Header } from 'semantic-ui-react';
// import { FieldError } from '../../shared';

const FormArrowButton = observer((props) => {
  const {
    label,
    labelDescription,
    value,
    values,
    // error,
    // placeHolder,
  } = props.fielddata;
  const { name, changed, action, ctaErrors } = props;
  if (values && Array.isArray(toJS(values))) {
    return (
<Button.Group fluid vertical>{values.map(field => (
  <>
    <Button
      onClick={(e) => {
        changed(e, { name, value: field.value });
        if (action) {
          action();
        }
      }}
      basic
      fluid
      labelPosition="left"
      className={`arrow-button ${value === field.value ? 'active' : ''} ${ctaErrors && ctaErrors.for === field.value ? 'error' : ''}`}
    >
    <div className="details">
      {field.label && field.labelDescription
        ? (
        <>
      {field.label && <Header as="h5">{field.label}</Header>}
      {field.labelDescription && field.labelDescription}
        </>
        ) : (field.label && <span>{field.label}</span>)
      }
    </div>
    <Icon className="ns-chevron-right" />
  </Button>
  {(ctaErrors && ctaErrors.for === field.value) ? (
    <p className="negative-text mb-20">
      {ctaErrors.errorMsg}
      </p>
  ) : ''
  }
  </>
))}</Button.Group>
    );
  }
  return (
    <Button onClick={e => changed(e, { name, value })} basic fluid labelPosition="left" className="arrow-button">
      <div className="details">
        {label && labelDescription
          ? (
          <>
        {label && <Header as="h5">{label}</Header>}
        {labelDescription && labelDescription}
          </>
          ) : (label && <span>{label}</span>)
        }
      </div>
      <Icon className="ns-chevron-right" />
    </Button>
  );
});

export default FormArrowButton;
