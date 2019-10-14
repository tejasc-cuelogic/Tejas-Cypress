import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { InlineLoader } from '../../../../../../../theme/shared';
import HtmlEditor from '../../../../../../shared/HtmlEditor';


@inject('updateStore')
@observer
class UpdateDetails extends Component {
  render() {
    const indexId = this.props.match.params.id ? this.props.match.params.id : 0;
    const { updates } = this.props.updateStore;
    const filteredUpdates = (updates && updates.length) ? updates.filter(d => d.isVisible) : [];
    const update = filteredUpdates.length ? filteredUpdates[indexId] : null;
    const calculatedDate = update && update.updatedDate
      ? moment(update.updatedDate).format('LL') : null;
    return (
      update
        ? (
          <>
            <Header as="h4">
              {update.title}
              <Header.Subheader className="mt-half">{calculatedDate}</Header.Subheader>
            </Header>
            <HtmlEditor readOnly content={(update.content || '')} />
          </>
        )
        : <InlineLoader text="No data found." />
    );
  }
}

export default UpdateDetails;
