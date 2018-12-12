import React, { Component } from 'react';
import { Grid, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FillTable } from '../../../../../../theme/table/NSTable';
import Helper from '../../../../../../helper/utility';

const result = {
  columns: [
    { title: 'Statement Date', field: 'taxFormDate' },
    { title: 'Form Type', field: 'types' },
    { title: 'Download as', field: 'file', textAlign: 'right' },
  ],
};

@inject('statementStore', 'educationStore')
@observer
export default class TaxForms extends Component {
  componentWillMount() {
    this.props.statementStore.initRequest('TaxForms');
  }
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
    const { taxForms, loading, error } = this.props.statementStore;
    result.rows = taxForms;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Card fluid>
              <FillTable
                download={this.downloadhandler}
                loading={loading}
                error={error}
                result={result}
              />
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
