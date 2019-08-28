import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

const Actions = observer((props) => {
  const {
    save, meta, isManager, isPublished, inProgress,
    id, cancelUpdate,
  } = props;
  return (
    <>
      <Button.Group compact floated="right">
        <Button
          inverted
          color="red"
          onClick={cancelUpdate}
          disabled={inProgress}
          content={!meta.isDirty ? 'Close' : 'Cancel'}
        />
        {!isManager && !isPublished
          && (
            <>
              {id
                ? (
                  <>
                    <Button
                      inverted
                      onClick={() => save(id, 'DRAFT')}
                      color="green"
                      content="Save"
                      disabled={!(meta.isValid && meta.isDirty) || inProgress}
                      loading={inProgress === 'DRAFT'}
                    />
                    <Button
                      primary
                      onClick={() => save(id, 'PENDING')}
                      content="Submit"
                      disabled={!(meta.isValid && meta.isDirty) || inProgress}
                      loading={inProgress === 'PENDING'}
                    />
                  </>
                )
                : (
                  <Button
                    inverted
                    onClick={() => save('new', 'DRAFT')}
                    color="green"
                    content="Create"
                    disabled={!meta.isValid || inProgress}
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
                        onClick={() => save(id, 'DRAFT')}
                        color="green"
                        content="Save"
                        disabled={!(meta.isValid && meta.isDirty) || inProgress}
                        loading={inProgress === 'DRAFT'}
                      />
                      {!isPublished
                        && (
                          <Button
                            primary
                            onClick={() => save(id, 'PUBLISHED')}
                            content="Publish"
                            disabled={!meta.isValid || inProgress}
                            loading={inProgress === 'PUBLISHED'}
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
                        disabled={!meta.isValid || inProgress}
                        loading={inProgress === 'DRAFT'}
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
