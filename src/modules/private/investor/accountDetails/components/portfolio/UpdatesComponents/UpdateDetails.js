import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import Parser from 'html-react-parser';
import { InlineLoader } from '../../../../../../../theme/shared';

@inject('updateStore')
@observer
class UpdateDetails extends Component {
  render() {
    const indexId = this.props.match.params.id ? this.props.match.params.id : 0;
    const { updates } = this.props.updateStore;
    const update = updates && updates.length ? updates[indexId] : null;
    return (
      updates ?
        <Aux>
          <Header as="h4">
            {update.title}
            <Header.Subheader className="mt-half">{update.updated.date}</Header.Subheader>
          </Header>
          <p>
            {Parser(update.content)}
          </p>
        </Aux>
        :
        <InlineLoader text="No data found." />
    );
  }
}

export default UpdateDetails;
