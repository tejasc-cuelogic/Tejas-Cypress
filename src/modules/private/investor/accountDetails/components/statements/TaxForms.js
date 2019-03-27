import Aux from 'react-aux';
import { includes } from 'lodash';
import React, { Component } from 'react';
import { Grid, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FillTable } from '../../../../../../theme/table/NSTable';
import Helper from '../../../../../../helper/utility';
import { NsPagination, InlineLoader } from './../../../../../../theme/shared';

const result = {
  columns: [
    { title: 'Statement Date', field: 'year' },
    { title: 'Form Type', field: 'fileName' },
    {
      title: 'Download', field: 'file', textAlign: 'right', label: '1099',
    },
  ],
};

@inject('agreementsStore', 'statementStore', 'educationStore', 'userDetailsStore')
@observer
export default class TaxForms extends Component {
  componentWillMount() {
    const { setFieldValue } = this.props.userDetailsStore;
    this.props.statementStore.resetPagination();
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
    const {
      getLegalDocsFileIds, alreadySet,
    } = this.props.agreementsStore;
    if (!alreadySet) {
      getLegalDocsFileIds();
    }
  }

  paginate = params => this.props.statementStore.pageRequest(params);

  downloadhandler = (e, fileId) => {
    e.preventDefault();
    this.props.statementStore.handlePdfDownload(fileId).then((fileUrl) => {
      Helper.toast('File downloaded successfully!', 'success');
      window.open(fileUrl);
    }).catch(() => {
      Helper.toast('Something went wrong. Please try again in some time.', 'error');
    });
  }

  render() {
    const { taxFormCount, requestState, taxForms } = this.props.statementStore;
    const { getAgreementsList, docIdsLoading } = this.props.agreementsStore;
    const instructions = getAgreementsList.filter(i => i.key.includes('instruction'));
    const totalRecords = taxFormCount() || 0;
    result.rows = taxForms;

    if (docIdsLoading) {
      return <InlineLoader />;
    }

    return (
      <Aux>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Card fluid>
                <FillTable
                  download={this.downloadhandler}
                  result={result}
                  aRule={{ key: 'year', val: [2017, 2018] }}
                  additionalActions
                  instructions={instructions}
                />
              </Card>
              {totalRecords > 0 && totalRecords > requestState.perPage &&
              <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Aux>
    );
  }
}
