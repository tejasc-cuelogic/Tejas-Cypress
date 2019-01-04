import Aux from 'react-aux';
import React, { Component } from 'react';
import { Grid, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FillTable } from '../../../../../../theme/table/NSTable';
import Helper from '../../../../../../helper/utility';
import { InlineLoader, NsPagination } from './../../../../../../theme/shared';

const result = {
  columns: [
    { title: 'Statement Date', field: 'statementDate' },
    { title: 'Description', field: 'description' },
    { title: 'Download as', field: 'file', textAlign: 'right' },
  ],
};

@inject('statementStore', 'educationStore', 'transactionStore', 'userDetailsStore')
@observer
export default class MonthlyStatements extends Component {
  componentWillMount() {
    const { setFieldValue } = this.props.userDetailsStore;
    setFieldValue('currentActiveAccount', 'individual');
    this.props.transactionStore.initRequest({ order: 'ASC', limitData: 1, statement: true });
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
    const { loading, error } = this.props.transactionStore;
    if (loading) {
      return <InlineLoader />;
    }
    const {
      monthlyStatementcount, requestState,
      monthlyStatements,
    } = this.props.statementStore;
    const totalRecords = monthlyStatementcount || 0;
    result.rows = monthlyStatements;
    return (
      <Aux>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Card fluid>
                <FillTable
                  download={this.downloadhandler}
                  error={error}
                  result={result}
                />
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {totalRecords > 0 &&
          <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
        }
      </Aux>
    );
  }
}
