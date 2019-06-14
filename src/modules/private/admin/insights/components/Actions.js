import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

const Actions = observer((props) => {
  const {
    save, meta, isReview, isPublished,
  } = props;
  return (
    <Button.Group compact floated="right">
      <Button
        inverted
        onClick={() => save('DRAFT', true)}
        color="green"
        content={isPublished ? 'Save and Unpublish' : 'Save as draft'}
        disabled={!meta.isValid}
      />
      { isReview
        ? (
          <Button
            inverted
            onClick={() => save('PUBLISHED')}
            color="green"
            content="Publish"
            disabled={!meta.isValid}
          />
        )
        : (isPublished
          ? (
            <>
              <Button
                inverted
                onClick={() => save('PUBLISHED')}
                color="green"
                content="Save and Publish"
                disabled={!meta.isValid}
              />
            </>
          )
          : (
            <Button
              primary
              onClick={() => save('IN_REVIEW')}
              content="Submit for Review"
              disabled={!meta.isValid}
            />
          ))
      }
    </Button.Group>
  );
});

export default Actions;
