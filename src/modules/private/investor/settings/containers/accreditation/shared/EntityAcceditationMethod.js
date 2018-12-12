import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Grid, Popup, Icon } from 'semantic-ui-react';
import { ENTITY_ACCREDITATION_METHODS_META } from './../../../../../../../services/constants/investmentLimit';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class VerifyEntityAccreditation extends Component {
  componentWillMount() {
    const { accountType } = this.props.match.params;
    this.props.accreditationStore.setFormData('ACCREDITATION_FORM', 'accreditation', accountType);
    this.props.accreditationStore.setFormData('NET_WORTH_FORM', 'accreditation', accountType);
  }
  render() {
    const accreditationMethods = ENTITY_ACCREDITATION_METHODS_META.slice();
    const {
      NET_WORTH_FORM,
      accreditationMethodChange,
      ACCREDITATION_FORM,
    } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" className="center-align">How are you accredited?</Header>
        <p className="center-align">
        To invest in Regulation D 506(c) offerings via an entity, the entity itself must be
        verified as an accredited investor.
        </p>
        <p className="center-align">Please confirm which of the following is applicable for your entity.</p>
        <Grid stackable textAlign="center" columns={2}>
          {accreditationMethods.map(method => (
            <Grid.Column
              onClick={(e) => { accreditationMethodChange(e, 'NET_WORTH_FORM', { name: 'netWorth', value: (method.value === 'FIVE_MILLION' || method.value === 'TWENTY_FIVE_MILLION') ? method.value : 'NONE' }); accreditationMethodChange(e, 'ACCREDITATION_FORM', { name: 'method', value: (method.value === 'FIVE_MILLION' || method.value === 'TWENTY_FIVE_MILLION') ? 'ASSETS' : method.value }); }}
            >
              <div className={`user-type ${((NET_WORTH_FORM.fields.netWorth.value === method.value || ACCREDITATION_FORM.fields.method.value === method.value) ? 'active' : '')}`}>
                {method.header &&
                  <Header as="h4">{method.header}</Header>
                }
                <p>
                  {method.desc}
                  {method.tooltip &&
                    <Popup
                      hoverable
                      trigger={<Icon color="green" name="help circle" />}
                      content={method.tooltip}
                      position="top center"
                      className="center-align"
                      wide
                    />
                  }
                </p>
              </div>
            </Grid.Column>
          ))}
        </Grid>
      </div>
    );
  }
}
