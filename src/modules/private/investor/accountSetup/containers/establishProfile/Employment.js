import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message } from 'semantic-ui-react';
import { ListErrors } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'investorProfileStore',
  form: 'EMPLOYMENT_STATUS_FRM',
};

@inject('investorProfileStore', 'uiStore')
@observer
class Employment extends Component {
  render() {
    const { smartElement, investorProfileStore, uiStore } = this.props;
    const { EMPLOYMENT_STATUS_FRM } = investorProfileStore;
    const { errors } = uiStore;
    return (
      <div className="center-align">
        <Header as="h3">What is your employment status?</Header>
        <p className="mb-40">Please indicate your current employment status</p>
        <Form error>
          {
            smartElement.RadioGroup('status', {
              containerclassname: 'three wide button-radio center-align',
            })
          }
          {EMPLOYMENT_STATUS_FRM.fields.status.value === 'EMPLOYED'
          && (
          <div className="field-wrap left-align">
            <Form.Group widths="equal">{
              ['employer', 'position'].map(field => (
                smartElement.Input(field)
              ))}
            </Form.Group>
          </div>
          )
          }
          {errors
            && (
              <Message error className="mt-30">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            )
          }
        </Form>
      </div>
    );
  }
}

export default formHOC(Employment, metaInfo);
