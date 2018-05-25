import React from 'react';
import { Form } from 'semantic-ui-react';

const ProfileDetails = (props) => {
  const { userData } = props;
  return (
    <div>
      <Form.Field label={`User ID : ${userData.username || userData.sub}`} />
      <Form.Group>
        <Form.Input
          type="text"
          label="First Name"
          placeholder="First Name"
          name="givenName"
          defaultValue={userData.givenName || userData.given_name}
          onChange={props.handleChange}
        />
        <Form.Input
          type="text"
          label="Last Name"
          placeholder="Last Name"
          name="familyName"
          defaultValue={userData.familyName || userData.family_name}
          onChange={props.handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Field label={`Email: ${userData.email}`} />
      </Form.Group>
    </div>
  );
};

export default ProfileDetails;
