import React, { Component } from 'react';
import { Modal, Header } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import { get } from 'lodash';
import { Image64, UserAvatar, InlineLoader } from '../../../../../../theme/shared';
import HtmlEditor from '../../../../../shared/HtmlEditor';

@inject('offeringsStore', 'uiStore', 'updateStore')
@observer
export default class PreviewUpdate extends Component {
  constructor(props) {
    super(props);
    this.props.updateStore.getOne(this.props.match.params.id);
  }

  handleBack = () => {
    this.props.history.push(`${this.props.refLink}`);
  }

  render() {
    const { offer } = this.props.offeringsStore;
    const companyAvatarUrl = get(offer, 'media.avatar.url') || '';
    const { PBUILDER_FRM, loadingCurrentUpdate } = this.props.updateStore;
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.handleBack} size="mini">
        <Modal.Content className="new-update-modal">
          <Header>
            <div className="ui image avatar-image">
              {companyAvatarUrl && companyAvatarUrl.length
                ? <Image64 srcUrl={companyAvatarUrl} circular className="large" />
                : <UserAvatar UserInfo={{ name: get(offer, 'keyTerms.shorthandBusinessName'), avatarUrl: '' }} className="large" />
              }
            </div>
            <Header.Content className="grey-header">
              {get(offer, 'keyTerms.shorthandBusinessName')}
              {!loadingCurrentUpdate && (
                <Header.Subheader>{PBUILDER_FRM.fields.updatedDate.value ? moment(PBUILDER_FRM.fields.updatedDate.value).format('LL') : '-'}</Header.Subheader>
              )
              }
              {/* <Header.Subheader>{moment().format('ll')}</Header.Subheader> */}
            </Header.Content>
          </Header>
          {loadingCurrentUpdate ? (<InlineLoader />) : (
            <>
            <Header as="h4">{PBUILDER_FRM.fields.title.value}</Header>
            <HtmlEditor readOnly content={(PBUILDER_FRM.fields.content.value || '')} />
            </>
          )
          }
        </Modal.Content>
      </Modal>
    );
  }
}
