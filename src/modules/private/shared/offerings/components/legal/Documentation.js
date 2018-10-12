import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { DropZoneConfirm as DropZone } from '../../../../../../theme/form';

@inject('offeringCreationStore', 'userStore')
@observer
export default class Documentation extends Component {
  onCorporateFormationDocDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadData('DOCUMENTATION_FRM', '', 'corporateFormationDocs', files);
  }
  render() {
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
    const { DOCUMENTATION_FRM } = this.props.offeringCreationStore;
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid form-card'}>
        <Header as="h4" textAlign="center">In Documentation page!</Header>
        <DropZone
          containerclassname="fluid"
          name="corporateFormationDocs"
          fielddata={DOCUMENTATION_FRM.fields.corporateFormationDocs}
          ondrop={this.onCorporateFormationDocDrop}
          onremove={this.handleDelDoc}
          uploadtitle="Upload"
        />
      </div>
    );
  }
}
