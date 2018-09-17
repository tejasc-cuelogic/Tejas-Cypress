import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class Issuer extends Component {
  render() {
    const { ISSUER_FRM, formChange } = this.props.offeringCreationStore;
    const formName = 'ISSUER_FRM';
    return (
      <div className="inner-content-spacer" style={{ fontSize: '24px', color: '#666', textAlign: 'center' }}>
        {
          ['issuerDiligence', 'certificateOfFormation'].map(field => (
            <div>
              <Header as="h4" textAlign="left">{ISSUER_FRM.fields[field].label}</Header>
              <FormTextarea
                hidelabel
                key={field}
                name={field}
                fielddata={ISSUER_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
                containerclassname="secondary"
              />
            </div>
          ))
        }
      </div>
    );
  }
}
