import React from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';

const PersonalSignature = observer(props => (
  <div>
    <div>
      {props.signaturePersons.map(personData => (
        <div key={personData.id}>
          <Button icon dataId={personData.id} onClick={props.handleDeleteClick}>
            <Icon name="remove" size="mini" />
          </Button>
          <Form.Group widths="3">
            <Form.Input
              dataId={personData.id}
              label={personData.personSignature.label}
              placeholder={personData.personSignature.label}
              name={personData.personSignature.key}
              value={personData.personSignature.value}
              onChange={props.handleChange}
            />
            <Form.Input
              dataId={personData.id}
              label={personData.personTitle.label}
              placeholder={personData.personTitle.label}
              name={personData.personTitle.key}
              value={personData.personTitle.value}
              onChange={props.handleChange}
            />
            <Form.Input
              dataId={personData.id}
              label={personData.signatureDate.label}
              placeholder={personData.signatureDate.label}
              name={personData.signatureDate.key}
              value={personData.signatureDate.value}
              onChange={props.handleAddChange}
            />
          </Form.Group>
        </div>
      ))}
    </div>
  </div>
));

export default PersonalSignature;
