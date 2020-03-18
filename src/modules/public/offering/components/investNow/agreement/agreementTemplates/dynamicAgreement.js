import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Form, Message } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../../theme/form';

function DynamicAgreement(props) {
  const { inProgress, showError, submit, setCheckbox, isAgreementFormValid, investmentFlowErrorMessage, index } = props;
  const { AGREEMENT_DETAILS_FORM } = props.agreementsStore;
  return (
    <Form
      error={(showError
        && !isAgreementFormValid)
        || investmentFlowErrorMessage}
    >
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <FormCheckbox
              defaults
              fielddata={AGREEMENT_DETAILS_FORM.fields.page[index].toc}
              name="toc"
              containerclassname={`ui list agreement-list very relaxed ${showError && !isAgreementFormValid ? 'error' : ''}`}
              changed={(e, res) => setCheckbox(e, res, 'page', index)}
              disabled={inProgress}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div className="mt-30">
        <Button primary content="Invest" disabled={inProgress || !isAgreementFormValid} loading={inProgress} onClick={submit} />
      </div>
      {!showError && investmentFlowErrorMessage
        && (
          <Message error className="mt-30 bottom-error">
            {investmentFlowErrorMessage}
          </Message>
        )
      }
      {showError
        && !isAgreementFormValid
        && <Message error className="bottom-error">All boxes must be checked to confirm your investment.</Message>
      }
    </Form>
  );
}

export default (withRouter(observer(DynamicAgreement)));
