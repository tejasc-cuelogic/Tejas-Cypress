import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, Form, Divider, Message, List, Grid, Header } from 'semantic-ui-react';
import cipVerificationHOC from '../../containers/cipVerificationHOC';
import { DropZoneConfirm as DropZone } from '../../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;
const headerSiblingContent = (
  <>
    <p>
    To complete identity verification, please upload a copy of a valid photo ID and proof of residence.
    {!isMobile && <Divider hidden />}
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

  handleBack = () => {
    const { setFieldValue, cipBackUrl } = this.props.identityStore;
    setFieldValue('cipErrors', null);
    this.props.history.push(cipBackUrl.pop());
  }

  render() {
    const { commonMethods, NsModal, errors, ListErrors } = this.props;
    const { ID_VERIFICATION_DOCS_FRM } = this.props.identityStore;
    return (
      <NsModal
        onClose={() => commonMethods.closeModal()}
        back={this.handleBack}
        {...this.props}
      >
        <Grid centered stackable className={isMobile ? 'full-width' : ''}>
          <Grid.Column width="8" className="pt-0">
            <Header as="h4">We were unable to verify your identity.</Header>
            {headerSiblingContent}
            <Form error onSubmit={this.handleUploadDocuments} className="file-uploader-inline">
              <Form.Field className="mb-30">
                <p className="mb-10"><b>Upload a Photo ID (Drivers License or Passport)</b></p>
                <DropZone
                  name="photoId"
                  fielddata={ID_VERIFICATION_DOCS_FRM.fields.photoId}
                  ondrop={this.onPhotoIdDrop}
                  onremove={this.handleDelDoc}
                  containerclassname="fluid"
                  uploadtitle="Choose a File"
                />
              </Form.Field>
              <Form.Field>
                <p className="mb-10"><b>Proof of Residence - Provide one of the acceptable documents:</b></p>
                <div className="more-info">
                  <List bulleted>
                    <List.Item>Utility bill in your name</List.Item>
                    <List.Item>Completed USPS mail forward form</List.Item>
                    <List.Item>DMV registration form</List.Item>
                    <List.Item>Signed lease (including address and signature page)</List.Item>
                    <List.Item>Voided check with your name and address</List.Item>
                  </List>
                </div>
                <Divider hidden />
                <DropZone
                  name="proofOfResidence"
                  fielddata={ID_VERIFICATION_DOCS_FRM.fields.proofOfResidence}
                  ondrop={this.onProofOfResidenceDrop}
                  onremove={this.handleDelDoc}
                  containerclassname="fluid"
                  uploadtitle="Choose a File"
                />
              </Form.Field>
              {errors
                && (
                  <Message error textAlign="left" className="mt-30">
                    <ListErrors errors={errors.message ? [errors.message] : [errors]} />
                  </Message>
                )
              }
              <div className="mt-30 mb-20">
                <Button primary fluid={isMobile} content="Submit" disabled={!ID_VERIFICATION_DOCS_FRM.meta.isValid} />
              </div>
              <div className={isMobile && 'center-align'}>
                <Link to="/dashboard/setup">I’ll finish this later</Link>
              </div>
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}

export default cipVerificationHOC(CipHardFail);
