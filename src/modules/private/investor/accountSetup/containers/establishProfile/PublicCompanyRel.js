import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message, Divider } from 'semantic-ui-react';
import { ListErrors } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'investorProfileStore',
  form: 'PUBLIC_COMPANY_REL_FRM',
};

@inject('investorProfileStore', 'uiStore')
@observer
class PublicCompanyRel extends Component {
  render() {
    const { errors } = this.props.uiStore;
    const { smartElement, investorProfileStore } = this.props;
    const { PUBLIC_COMPANY_REL_FRM } = investorProfileStore;

    return (
      <div className="center-align">
        <Header as="h3">Public Company Relations</Header>
        <p>Are you (or an immediate family member) a 10% shareholder,
          director or senior officer at a publicly traded U.S. company?
        </p>
        <Divider hidden />
        <p className="mb-40">If you do not know what this means, it likely does not apply to you</p>
        <Form error>
          {
            smartElement.RadioGroup('publicCompanyRel', {
              containerclassname: 'three wide button-radio center-align',
            })
          }
          {PUBLIC_COMPANY_REL_FRM.fields.publicCompanyRel.value === 'yes'
            && (
              <div className="field-wrap left-align">
                <Form.Group widths="equal">
                  {
                    smartElement.Input('publicCompanyTicker')
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
export default formHOC(PublicCompanyRel, metaInfo);
