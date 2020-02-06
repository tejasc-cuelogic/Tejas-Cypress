import React, { Component } from 'react';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

@inject('campaignStore', 'offeringsStore')
@observer
export default class KnowledgeBase extends Component {
  constructor(props) {
    super(props);
    this.props.campaignStore.setFieldValue('documentMeta', props.match.params.docId || props.boxFileId, 'closingBinder.selectedDoc');
    const { offer } = this.props.offeringsStore;
    const accountType = Helper.getBoxAccountTypeByRegulation(get(offer, 'regulation'));
    this.props.campaignStore.getBoxLink(props.match.params.docId || props.boxFileId, accountType).then((res) => {
      this.setState({ embedUrl: res });
    });
  }

  state = {
    embedUrl: '',
  }

  render() {
    const { docLoading } = this.props.campaignStore;
    if (docLoading) {
      return <InlineLoader />;
    }
    return (
      <div className="pdf-viewer">
      {!this.state.embedUrl ? <InlineLoader text="No Data Found" />
        : (
          <iframe
            width="100%"
            height="100%"
            title="agreement"
            src={this.state.embedUrl}
            ref={(c) => { this.iframeComponent = c; }}
          />
        )
      }
    </div>
    );
  }
}
