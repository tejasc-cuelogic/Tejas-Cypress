import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';
import Aux from 'react-aux';

const Actions = observer((props) => {
  const {
    save, meta, isReview, isPublished,
  } = props;
  return (
    <Button.Group compact floated="right">
      <Button
        inverted
        onClick={() => save('DRAFT')}
        color="green"
        content={isPublished ? 'Save and Unpublish' : 'Save as draft'}
        disabled={!meta.isValid}
      />
      { isReview ?
        <Button
          inverted
          onClick={() => save('PUBLISHED')}
          color="green"
          content="Publish"
          disabled={!meta.isValid}
        /> :
        (isPublished ?
          <Aux>
            <Button
              inverted
              onClick={() => save('PUBLISHED')}
              color="green"
              content="Save and Publish"
              disabled={!meta.isValid}
            />
          </Aux>
          :
          <Button
            primary
            onClick={() => save('IN_REVIEW')}
            content="Submit for Review"
            disabled={!meta.isValid}
          />)
      }
    </Button.Group>
  );
});

export default Actions;
