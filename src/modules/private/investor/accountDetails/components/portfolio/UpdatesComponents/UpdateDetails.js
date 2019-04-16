import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import Aux from 'react-aux';
import { InlineLoader } from '../../../../../../../theme/shared';
import HtmlEditor from '../../../../../../shared/HtmlEditor';

@inject('updateStore')
@observer
class UpdateDetails extends Component {
  render() {
    const indexId = this.props.match.params.id ? this.props.match.params.id : 0;
    const { updates } = this.props.updateStore;
    const update = updates && updates.length ? updates[indexId] : null;
    const calculatedDate = update && update.updated.date ?
      moment(update.updated.date).format('ll') : null;
    return (
      update ?
        <Aux>
          <Header as="h4">
            {update.title}
            <Header.Subheader className="mt-half">{calculatedDate}</Header.Subheader>
          </Header>
          <HtmlEditor readOnly content={(update.content || '')} />
        </Aux>
        :
        <InlineLoader text="No data found." />
    );
  }
}

export default UpdateDetails;
