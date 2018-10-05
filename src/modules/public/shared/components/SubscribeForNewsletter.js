import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject } from 'mobx-react';
import { Button, Form, Grid } from 'semantic-ui-react';
import { FormInput } from '../../../../theme/form';

const SubscribeFields = ({
  NEWSLETTER_FRM, newsLetterChange, modal, inProgress,
}) => (
  <Aux>
    {/* {
      Object.keys(NEWSLETTER_FRM.fields).map(field => (
        <FormInput
          key={field}
          type="text"
          name={field}
          fielddata={NEWSLETTER_FRM.fields[field]}
          changed={newsLetterChange}
          containerwidth={4}
          ishidelabel={!modal}
        />
      ))
    }
    <Form.Field>
      <Button primary compact loading={inProgress}>
        Submit
      </Button>
    </Form.Field> */}
    <Grid centered>
      <Grid.Row>
        {
          Object.keys(NEWSLETTER_FRM.fields).map(field => (
            <Grid.Column computer={4} tablet={5} mobile={16}>
              <FormInput
                key={field}
                type="text"
                name={field}
                fielddata={NEWSLETTER_FRM.fields[field]}
                changed={newsLetterChange}
                ishidelabel={!modal}
              />
            </Grid.Column>
          ))
        }
        <Grid.Column computer={2} tablet={3} mobile={16}>
          <Button primary loading={inProgress} fluid>
             Subscribe
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
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
          <SubscribeFields
            NEWSLETTER_FRM={NEWSLETTER_FRM}
            newsLetterChange={newsLetterChange}
            modal={this.props.modal}
            inProgress={inProgress}
          />
        )}
      </Form>
    );
  }
}
