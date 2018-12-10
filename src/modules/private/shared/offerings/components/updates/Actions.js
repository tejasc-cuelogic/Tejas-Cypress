import React from 'react';
import Aux from 'react-aux';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

const Actions = observer((props) => {
  const {
    save, meta, isManager, isPending, isPublished, edit, editForm, deleteUpdate, id, cancelUpdate,
  } = props;
  return (
    <Aux>
      {(isManager && !isPublished) || editForm ?
        <Button.Group compact floated="right">
          {id !== 'new' &&
          <Button
            inverted
            color="red"
            onClick={deleteUpdate}
            content="Delete"
            disabled={!meta.isValid}
          />
          }
          <Button
            inverted
            onClick={() => save('DRAFT')}
            color="green"
            content="Save as draft"
            disabled={!meta.isValid}
          />
          <Button
            primary
            onClick={() => save('PUBLISHED')}
            content="Publish"
            disabled={!meta.isValid}
          />
        </Button.Group> :
        <Button.Group compact floated="right">
          {!isPending && !isPublished &&
            <Button
              inverted
              onClick={() => save('DRAFT')}
              color="green"
              content="Save as draft"
              disabled={!meta.isValid}
            />
          }
          {!isPublished &&
          <Button
            primary
            onClick={() => save('PENDING')}
            content={isPending ? 'Awaiting Manager Approval' : 'Submit for Approval'}
            disabled={!meta.isValid || isPending}
          />
          }
        </Button.Group>
      }
      {isManager && isPublished && !editForm &&
        <Button.Group compact floated="right">
          {id !== 'new' &&
            <Button
              inverted
              color="red"
              onClick={deleteUpdate}
              content="Delete"
              disabled={!meta.isValid}
            />
          }
          <Button
            primary
            onClick={() => edit()}
            content="Edit"
          />
        </Button.Group>
      }
      {id === 'new' &&
        <Button
          inverted
          color="red"
          onClick={cancelUpdate}
          content="Cancel"
          disabled={!meta.isValid}
        />
      }
    </Aux>
  );
});

export default Actions;
