import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { FormTextarea } from '../../../../theme/form/FormElements';

const Compose = props => (
  <div className="message-footer">
    <Form>
      <FormTextarea
        fielddata={props.form.fields.messages}
        name="messages"
      />
      <div>
        <Button primary content="Send" />
      </div>
    </Form>
  </div>
);

export default Compose;
