import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

const Actions = observer((props) => {
  const {
    save, meta, isManager, isPending, isPublished,
    edit, editForm, deleteUpdate, id, cancelUpdate, cancelChanges,
  } = props;
  return (
    <>
      {(isManager && !isPublished) || editForm
        ? (
<Button.Group compact floated="right">
          <Button
            inverted
            color="red"
            onClick={editForm ? cancelChanges : cancelUpdate}
            content="Cancel"
          />
          {id !== 'new'
            && (
            <Button
              inverted
              color="red"
              onClick={deleteUpdate}
              content="Delete"
            />
            )
          }
            <Button
              inverted
              onClick={() => save('DRAFT')}
              color="green"
              content={editForm ? 'Save and Unpublish' : 'Save as draft'}
              disabled={!meta.isValid}
            />
            {id !== 'new'
            && (
              <Button
                primary
                onClick={() => save('PUBLISHED')}
                content={editForm ? 'Save and Publish' : 'Publish'}
                disabled={!meta.isValid}
              />
            )
            }
          </Button.Group>
        )
        : (
<Button.Group compact floated="right">
            {!isManager
            && (
            <Button
              inverted
              color="red"
              onClick={cancelUpdate}
              content="Cancel"
            />
            )
          }
          {id !== 'new' && !isPublished
            && (
            <Button
              inverted
              color="red"
              onClick={deleteUpdate}
              content="Delete"
            />
            )
          }
          {!isPending && !isPublished
            && (
            <Button
              inverted
              onClick={() => save('DRAFT')}
              color="green"
              content="Save as draft"
              disabled={!meta.isValid}
            />
            )
          }
            {!isPublished && id !== 'new'
            && (
            <Button
              primary
              onClick={() => save('PENDING')}
              content={isPending ? 'Awaiting Manager Approval' : 'Submit for Approval'}
              disabled={!meta.isValid || isPending}
            />
            )
          }
        </Button.Group>
        )
      }
      {isManager && isPublished && !editForm
        && (
<Button.Group compact floated="right">
          <Button
            inverted
            color="red"
            onClick={cancelUpdate}
            content="Cancel"
          />
          {id !== 'new'
            && (
            <Button
              inverted
              color="red"
              onClick={deleteUpdate}
              content="Delete"
            />
            )
          }
          <Button
            primary
            onClick={() => edit()}
            content="Edit"
          />
        </Button.Group>
        )
      }
    </>
  );
});

export default Actions;
