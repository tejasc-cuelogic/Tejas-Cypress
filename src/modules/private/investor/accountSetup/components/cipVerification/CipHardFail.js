import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, Form, Divider, Message, List, Grid } from 'semantic-ui-react';
import cipVerificationHOC from '../../containers/cipVerificationHOC';
import { DropZoneConfirm as DropZone } from '../../../../../../theme/form';

const headerSiblingContent = (
  <>
    <Divider section />
    <p>
      Unfortunately, we were still unable to verify your identity based on the information entered.
      To complete identity verification,
      we’ll need a copy of a valid photo ID and proof of residence.
    </p>
  </>
);
@observer
class CipHardFail extends React.Component {
  onPhotoIdDrop = (files) => {
    this.props.identityStore.setFileUploadData('photoId', files);
  }

  onProofOfResidenceDrop = (files) => {
    this.props.identityStore.setFileUploadData('proofOfResidence', files);
  }

  handleDelDoc = (field) => {
    this.props.identityStore.removeUploadedData(field);
    this.props.uiStore.setConfirmBox('');
  }

  handleUploadDocuments = async (e) => {
    e.preventDefault();
    const { handleCipExpiration, redirectTo } = this.props.commonMethods;
    this.props.identityStore.setSubmitVerificationDocs(true);
    this.props.identityStore.setFieldValue('signUpLoading', true);
    let { url } = await this.props.identityStore.verifyCipHardFail();
    const { accountForWhichCipExpired, userDetails } = this.props.userDetailsStore;
    if (userDetails.legalDetails.status === 'OFFLINE' || accountForWhichCipExpired) {
      url = await handleCipExpiration();
    }
    redirectTo(url);
  }

  render() {
    const { commonMethods, NsModal, isLoading, errors, ListErrors } = this.props;
    const { ID_VERIFICATION_DOCS_FRM, cipBackUrl } = this.props.identityStore;
    return (
      <NsModal
        onClose={() => commonMethods.closeModal()}
        header="Verify your identity"
        headerSiblingContent={headerSiblingContent}
        backUrl={cipBackUrl}
        actions={<p><Link to="/dashboard/setup">I’ll finish this later</Link></p>}
        isLoading={isLoading}
      >
        <Form error onSubmit={this.handleUploadDocuments} className="file-uploader-inline">
          <Form.Field className="mb-30">
            <label className="mb-half">Upload a Photo ID (Drivers License or Passport)</label>
            <DropZone
              name="photoId"
              fielddata={ID_VERIFICATION_DOCS_FRM.fields.photoId}
              ondrop={this.onPhotoIdDrop}
              onremove={this.handleDelDoc}
              containerclassname="fluid"
            />
          </Form.Field>
          <Form.Field>
            <label className="mb-20">Proof of Residence</label>
            <div className="more-info">
              <p>Provide one of the acceptable documents:</p>
              <Grid>
                <Grid.Column width={8}>
                  <List bulleted>
                    <List.Item>Utility bill in your name</List.Item>
                    <List.Item>Completed USPS mail forward form</List.Item>
                    <List.Item>DMV registration form</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={8}>
                  <List bulleted>
                    <List.Item>Signed lease (including address and signature page)</List.Item>
                    <List.Item>Voided check with your name and address</List.Item>
                  </List>
                </Grid.Column>
              </Grid>
            </div>
            <Divider hidden />
            <DropZone
              name="proofOfResidence"
              fielddata={ID_VERIFICATION_DOCS_FRM.fields.proofOfResidence}
              ondrop={this.onProofOfResidenceDrop}
              onremove={this.handleDelDoc}
              containerclassname="fluid"
            />
          </Form.Field>
          {errors
            && (
              <Message error textAlign="left" className="mt-30">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            )
          }
          <div className="center-align mt-30">
            <Button primary size="large" className="very relaxed" content="Verify my identity" disabled={!ID_VERIFICATION_DOCS_FRM.meta.isValid} />
          </div>
        </Form>
      </NsModal>
    );
  }
}

export default cipVerificationHOC(CipHardFail);
