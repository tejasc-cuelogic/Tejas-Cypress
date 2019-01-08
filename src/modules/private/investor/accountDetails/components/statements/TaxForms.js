import Aux from 'react-aux';
import { includes } from 'lodash';
import React, { Component } from 'react';
import { Grid, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FillTable } from '../../../../../../theme/table/NSTable';
import Helper from '../../../../../../helper/utility';
import { NsPagination } from './../../../../../../theme/shared';

const result = {
  columns: [
    { title: 'Statement Date', field: 'year' },
    { title: 'Form Type', field: 'formType' },
    { title: 'Download as', field: 'file', textAlign: 'right' },
  ],
};

@inject('statementStore', 'educationStore', 'userDetailsStore')
@observer
export default class TaxForms extends Component {
  componentWillMount() {
    const { setFieldValue } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
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
    const totalRecords = taxFormCount() || 0;
    result.rows = taxForms;
    return (
      <Aux>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Card fluid>
                <FillTable
                  download={this.downloadhandler}
                  result={result}
                />
              </Card>
              {totalRecords > 0 &&
              <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Aux>
    );
  }
}
