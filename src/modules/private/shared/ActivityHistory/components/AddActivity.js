import React from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Input, Icon } from 'semantic-ui-react';

const AddActivity = observer(props => (
  <Form onSubmit={props.submit} className="comment-input">
    <Input
      name="comment"
      onChange={props.change}
      value={props.form.fields.comment.value}
      type="text"
      placeholder="Enter comment here..."
      action
      fluid
    >
      <input />
      <div className="attachment">
        <Icon className="ns-attachment" color="grey" size="large" />
        <input type="file" />
      </div>
      <Button disabled={!props.form.meta.isValid} icon type="submit" basic>
        <Icon className="ns-send-right" color="blue" size="large" />
      </Button>
    </Input>
  </Form>
));

export default AddActivity;
