import React from 'react';
import { observer } from 'mobx-react';
import { map } from 'lodash';
import { Modal, Button, Header, Form, Divider, Grid, Message } from 'semantic-ui-react';
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
        <i>Note: This may happen if you
        recently relocated or you entered your address incorrectly
        </i>)
      </p>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <Divider hidden />
      {errors && errors.message &&
        <Message error>
          <ListErrors errors={[errors.message]} />
        </Message>
      }
      {errors && !errors.message &&
        <Message error>
          <ListErrors errors={[errors]} />
        </Message>
      }
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
        <Divider hidden />
        <div className="center-align">
          <Button loading={inProgress} color="green" size="large" className="relaxed" disabled={!form.meta.isValid}>Verify my identity</Button>
        </div>
        <div className="center-align">
          <Button className="cancel-link" onClick={() => close()}>I’ll finish this later</Button>
        </div>
      </Form>
    </Modal.Content>
  </Modal>
));

export default LegalIdentityQuestions;
