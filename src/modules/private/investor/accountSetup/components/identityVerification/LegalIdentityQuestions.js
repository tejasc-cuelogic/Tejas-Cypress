import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { map } from 'lodash';
import { Modal, Button, Header, Form, Divider, Grid, Message, Dimmer, Loader } from 'semantic-ui-react';
import { FormSelect } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

const LegalIdentityQuestions = observer(({
  form,
  close,
  errors,
  inProgress,
  onSubmit,
  identityQuestionAnswerChange,
}) => (
  <Modal size="mini" open closeIcon onClose={() => close()} closeOnDimmerClick={false} >
    <Modal.Header className="center-align signup-header">
      <Header as="h3">We need to confirm your identity</Header>
      <Divider />
      <p>
        We were unable to match your information with the
        address you provided. (
        <i>Note: This may happen if you recently relocated or you entered your address incorrectly
        </i>)
      </p>
    </Modal.Header>

    <Dimmer active={inProgress} className={inProgress && 'fullscreen' ? 'fullscreen' : ''}>
      <Loader active={inProgress} />
    </Dimmer>
    <Modal.Content className="signup-content">
      <Form error onSubmit={onSubmit}>
        <Grid>
          {map(form.fields, field => (
            <FormSelect
              fluid
              fielddata={field}
              name={field.key}
              value={field.value}
              options={field.options}
              changed={identityQuestionAnswerChange}
              containerwidth={16}
            />
          ))}
        </Grid>
        {errors && errors.message &&
          <Message error className="mt-30">
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        {errors && !errors.message &&
          <Message error className="mt-30">
            <ListErrors errors={[errors]} />
          </Message>
        }
        <div className="center-align mt-30">
          <Button.Group vertical>
            <Button color="green" size="large" className="relaxed" disabled={!form.meta.isValid}>Verify my identity</Button>
            <Button className="cancel-link" onClick={() => close()}>I’ll finish this later</Button>
          </Button.Group> */}
        </div>
      </Form>
    </Modal.Content>
    <Modal.Actions className="signup-actions">
      <p><Link to="/app/summary" onClick={close}>I’ll finish this later</Link></p>
    </Modal.Actions>
  </Modal>
));

export default LegalIdentityQuestions;
