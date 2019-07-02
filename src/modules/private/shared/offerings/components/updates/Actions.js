import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

const Actions = observer((props) => {
  const {
    save, meta, isManager, isPublished,
    deleteUpdate, id, cancelUpdate, isDraft,
  } = props;
  return (
    <>
      <Button.Group compact floated="right">
        <Button
          inverted
          color="red"
          onClick={cancelUpdate}
          content="Cancel"
        />
        {!isManager && !isPublished
          && (
            <>
              {id
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
                      onClick={() => save(id, 'DRAFT')}
                      color="green"
                      content="Save"
                      disabled={!(meta.isValid && meta.isDirty)}
                    />
                    <Button
                      primary
                      onClick={() => save(id, 'PENDING')}
                      content="Submit"
                      disabled={!meta.isValid}
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
              {id
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
                        onClick={() => save(id, 'DRAFT')}
                        color="green"
                        content="Save"
                        disabled={!(meta.isValid && meta.isDirty)}
                      />
                      {!isPublished
                        && (
                          <Button
                            primary
                            onClick={() => save(id, 'PUBLISHED')}
                            content="Publish"
                            disabled={!meta.isValid}
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
    </>
  );
});

export default Actions;
