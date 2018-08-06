import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject } from 'mobx-react';
import { Button, Form } from 'semantic-ui-react';
import { FormInput } from '../../../../theme/form';

const SubscribeFields = ({
  NEWSLETTER_FRM, newsLetterChange, modal, inProgress,
}) => (
  <Aux>
    {
      Object.keys(NEWSLETTER_FRM.fields).map(field => (
        <FormInput
          key={field}
          type="text"
          name={field}
          autoFocus={field === 'name'}
          fielddata={NEWSLETTER_FRM.fields[field]}
          changed={newsLetterChange}
          containerwidth={!modal ? 4 : false}
          ishidelabel={!modal}
        />
      ))
    }
    <Form.Field className={modal ? 'center-align' : ''}>
      <Button primary className={modal ? 'very relaxed' : 'fluid'} loading={inProgress}>
        Submit
      </Button>
    </Form.Field>
  </Aux>
);

@inject('authStore', 'uiStore')
export default class SubscribeForNewsletter extends Component {
  render() {
    const { NEWSLETTER_FRM, newsLetterChange } = this.props.authStore;
    const { inProgress } = this.props.uiStore;
    return (
      <Form className={this.props.className}>
        {this.props.modal ? (
          <SubscribeFields
            NEWSLETTER_FRM={NEWSLETTER_FRM}
            newsLetterChange={newsLetterChange}
            modal={this.props.modal}
            inProgress={inProgress}
          />
        ) : (
          <Form.Group>
            <SubscribeFields
              NEWSLETTER_FRM={NEWSLETTER_FRM}
              newsLetterChange={newsLetterChange}
              modal={this.props.modal}
              inProgress={inProgress}
            />
          </Form.Group>
        )}
      </Form>
    );
  }
}
