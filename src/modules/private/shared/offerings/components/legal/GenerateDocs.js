import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Divider } from 'semantic-ui-react';
import EdgarFilingList from './EdgarFilingList';

@inject('offeringCreationStore', 'uiStore', 'userStore')
@observer
export default class GenerateDocs extends Component {
  componentWillMount() {
    const { currentOfferingId, getOfferingFilingList } = this.props.offeringCreationStore;
    getOfferingFilingList(currentOfferingId);
  }

  createBusinessFiling = (e) => {
    e.stopPropagation();
    this.props.offeringCreationStore.generateBusinessFiling();
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const { offeringFilingList } = this.props.offeringCreationStore;
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid form-card'}>
        <Form>
          <Header as="h4">Generate Docs from Templates</Header>
          <Button
            primary
            className="relaxed"
            content="Generate Docs"
            onClick={this.createBusinessFiling}
            loading={inProgress}
          />
          <Divider section />
          <EdgarFilingList offeringFilings={offeringFilingList} />
        </Form>
      </div>
    );
  }
}
