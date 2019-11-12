import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message, Divider, Responsive } from 'semantic-ui-react';
import { ListErrors } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'investorProfileStore',
  form: 'BROKERAGE_EMPLOYMENT_FRM',
};

@inject('investorProfileStore', 'uiStore')
@observer
class BrokerageEmployment extends Component {
  render() {
    const { smartElement, uiStore, investorProfileStore } = this.props;
    const { BROKERAGE_EMPLOYMENT_FRM } = investorProfileStore;
    const { errors } = uiStore;
    return (
      <div className="center-align">
        <Header as="h3">Brokerage employment</Header>
        <Divider hidden />
        <p>
          Do you (or an immediate family member) work for a US-based{' '}
          <Responsive as={React.Fragment} minWidth={1200}><br /></Responsive>securities brokerage firm?
        </p>
        <Divider hidden />
        <p className="mb-40">
          If you do not know what this means, it likely does not apply to you.
        </p>
        <Form error>
          {
            smartElement.RadioGroup('brokerageEmployment', {
              containerclassname: 'three wide button-radio center-align',
            })
          }
          {BROKERAGE_EMPLOYMENT_FRM.fields.brokerageEmployment.value === 'yes'
            && (
              <div className="field-wrap left-align">
                <Form.Group widths="equal">
                  {
                    smartElement.Input('brokerageFirmName')
                  }
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
export default formHOC(BrokerageEmployment, metaInfo);
