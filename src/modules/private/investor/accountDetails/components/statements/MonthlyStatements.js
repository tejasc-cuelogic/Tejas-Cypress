import Aux from 'react-aux';
import React, { Component } from 'react';
import { includes } from 'lodash';
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
    this.props.statementStore.resetPagination();
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
    this.props.transactionStore.initRequest({ order: 'ASC', limitData: 1, statement: true });
  }

  paginate = params => this.props.statementStore.pageRequest(params);

  downloadhandler = (e, fileId) => {
    e.preventDefault();
    this.props.statementStore.generateMonthlyStatementsPdf(fileId).then((pdfUrl) => {
      Helper.toast('File downloaded successfully!', 'success');
      window.open(pdfUrl);
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
