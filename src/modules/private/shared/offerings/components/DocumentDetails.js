import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../theme/shared';

@inject('campaignStore')
@observer
export default class KnowledgeBase extends Component {
  constructor(props) {
    super(props);
    this.props.campaignStore.setFieldValue('documentMeta', props.match.params.docId || props.boxFileId, 'closingBinder.selectedDoc');
    this.props.campaignStore.getBoxLink(props.match.params.docId || props.boxFileId).then((res) => {
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
