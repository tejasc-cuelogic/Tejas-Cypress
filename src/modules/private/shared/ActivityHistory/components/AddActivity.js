import React from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Icon } from 'semantic-ui-react';
// import { FormInput } from '../../../../../theme/form';

const AddActivity = observer(props => (
  <Form onSubmit={props.submit} className="comment-input history">
    {props.smartElement.Input('comment')}
    {/* <FormInput
      name="comment"
      fielddata={props.form.fields.comment}
      changed={(e, result) => props.change(e, result, 'ACTIVITY_FRM')}
    /> */}
    <div className="attachment">
      <Icon className="ns-attachment" color="grey" size="large" />
    </div>
    <Button disabled={!props.form.meta.isValid} icon type="submit" basic>
      <Icon className="ns-send-right" color="blue" size="large" />
    </Button>
  </Form>
));

export default AddActivity;
