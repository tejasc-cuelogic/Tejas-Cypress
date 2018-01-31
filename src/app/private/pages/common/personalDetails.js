import React from 'react';
import { Form } from 'semantic-ui-react';

const PersonalDetails = (props) => {
  const { userData } = props;
  return (
    <div>
      <Form.Field label={`User ID : ${userData.username}`} />
      <Form.Group>
        <Form.Input
          type="text"
          label="First Name"
          placeholder="First Name"
          name="givenName"
          value={userData.givenName}
          onChange={props.handleChange}
        />
        <Form.Input
          type="text"
          label="Last Name"
          placeholder="Last Name"
          name="familyName"
          value={userData.familyName}
          onChange={props.handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Field label={`Email: ${userData.email}`} />
      </Form.Group>
    </div>
  );
};

export default PersonalDetails;
