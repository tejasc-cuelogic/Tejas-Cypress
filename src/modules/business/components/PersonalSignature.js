import React from 'react';
import { Form } from 'semantic-ui-react';

const PersonalSignature = props => (
  <div>
    <div>
      {props.signaturePerson.map(personData => (
        <div>
          <div>
            <Form.Input
              dataId={personData.id}
              label={personData.personSignature.label}
              placeholder={personData.personSignature.label}
              name={personData.personSignature.key}
              defaultValue={personData.personSignature.value}
              onChange={props.handleChange}
            />
          </div>
          <div>
            <Form.Input
              dataId={personData.id}
              label={personData.personTitle.label}
              placeholder={personData.personTitle.label}
              name={personData.personTitle.key}
              defaultValue={personData.personTitle.value}
              onChange={props.handleChange}
            />
          </div>
          <div>
            <Form.Input
              dataId={personData.id}
              label={personData.signatureDate.label}
              placeholder={personData.signatureDate.label}
              name={personData.signatureDate.key}
              defaultValue={personData.signatureDate.value}
              onChange={props.handleChange}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PersonalSignature;
