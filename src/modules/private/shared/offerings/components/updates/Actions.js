import React from 'react';
import Aux from 'react-aux';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

const Actions = observer((props) => {
  const {
    save, meta, isManager, isPublished, newUpdateId,
    deleteUpdate, id, cancelUpdate, isDraft,
  } = props;
  return (
    <Aux>
      <Button.Group compact floated="right">
        <Button
          inverted
          color="red"
          onClick={cancelUpdate}
          content="Close"
        />
        {!isManager
          && (
            <>
              {newUpdateId || id
                ? (
                  <>
                    {isDraft
                      && (
                        <>
                          <Button
                            inverted
                            color="red"
                            onClick={deleteUpdate}
                            content="Delete"
                          />
                        </>
                      )
                    }
                    <Button
                      inverted
                      onClick={() => save(newUpdateId || id, 'DRAFT')}
                      color="green"
                      content="Save"
                      disabled={!(meta.isValid && meta.isDirty)}
                    />
                    <Button
                      primary
                      onClick={() => save(newUpdateId || id, 'PENDING')}
                      content="Submit"
                      disabled={!(meta.isValid && meta.isDirty)}
                    />
                  </>
                )
                : (
                  <Button
                    inverted
                    onClick={() => save('new', 'DRAFT')}
                    color="green"
                    content="Create"
                    disabled={!meta.isValid}
                  />
                )
              }
          </>
          )
        }
        {isManager
          && (
            <>
              {id || newUpdateId
                ? (
                    <>
                      <Button
                        inverted
                        color="red"
                        onClick={deleteUpdate}
                        content="Delete"
                      />
                      <Button
                        inverted
                        onClick={() => save(id || newUpdateId, 'DRAFT')}
                        color="green"
                        content="Save"
                        disabled={!(meta.isValid && meta.isDirty)}
                      />
                      {!isPublished
                        && (
                          <Button
                            primary
                            onClick={() => save(id || newUpdateId, 'PUBLISHED')}
                            content="Publish"
                            disabled={!(meta.isValid && meta.isDirty)}
                          />
                        )
                      }
                    </>
                ) : (
                    <>
                      <Button
                        inverted
                        onClick={() => save('new', 'DRAFT')}
                        color="green"
                        content="Create"
                        disabled={!meta.isValid}
                      />
                    </>
                )
                }
            </>
          )
        }
      </Button.Group>
    </Aux>
  );
});

export default Actions;
