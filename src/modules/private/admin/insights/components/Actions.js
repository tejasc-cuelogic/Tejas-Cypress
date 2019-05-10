import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

const Actions = observer((props) => {
  const {
    save, meta,
  } = props;
  return (
    <Button.Group compact floated="right">
      <Button
        inverted
        onClick={() => save('DRAFT')}
        color="green"
        content="Save"
        disabled={!meta.isValid}
      />
      <Button
        primary
        onClick={() => save('PENDING')}
        content="Submit for Approval"
        disabled={!meta.isValid}
      />
    </Button.Group>
  );
});

export default Actions;
