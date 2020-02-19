import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

const Actions = observer((props) => {
  const {
    save, meta, isManager, isPublished, inProgress,
    id, cancelUpdate, isPending, isDraft,
  } = props;
  return (
    <>
      <Button.Group compact floated="right">
        <Button
          inverted
          color="red"
          onClick={isManager && id !== null ? () => save(id, 'DRAFT', true) : cancelUpdate}
          disabled={inProgress}
          content={isManager && id !== null ? 'Decline' : 'Cancel'}
        />
        {!isManager && !isPublished
          && (
            <>
              {id
                ? (
                  <>
                    <Button
                      inverted
                      onClick={() => save(id, isPending ? 'PENDING' : 'DRAFT', false, true)}
                      color="green"
                      content="Save"
                      disabled={!(meta.isValid && meta.isDirty) || inProgress}
                      loading={inProgress === 'DRAFT'}
                    />
                    <Button
                      primary
                      onClick={() => save(id, 'PENDING', true)}
                      content="Submit"
                      disabled={!meta.isValid || inProgress}
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
                        onClick={() => save(id, isPublished ? 'PUBLISHED' : isPending ? 'PENDING' : 'DRAFT', false, true)}
                        color="green"
                        content="Save"
                        disabled={!(meta.isValid && meta.isDirty) || inProgress}
                        loading={inProgress === 'DRAFT'}
                      />
                      {!isPublished
                        && (
                          <Button
                            primary
                            onClick={() => save(id, isDraft ? 'PENDING' : 'PUBLISHED', !isDraft)}
                            content={isDraft ? 'Submit' : 'Publish'}
                            disabled={!meta.isValid || inProgress}
                            loading={inProgress === 'PUBLISHED' || inProgress === 'PENDING'}
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
