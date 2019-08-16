import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { capitalize, get } from 'lodash';
import moment from 'moment';
import beautify from 'json-beautify';
import ReactDiffViewer from 'react-diff-viewer';
import { Modal, Header, Form, Button, Grid } from 'semantic-ui-react';
import { FormInput } from '../../../../../theme/form';
import { InlineLoader } from '../../../../../theme/shared';

@inject('elasticSearchStore')
@observer
export default class EsAudit extends Component {
  componentWillMount() {
    const { auditAlias } = this.props.match.params;
    this.props.elasticSearchStore.getESAuditPara(auditAlias);
    this.props.elasticSearchStore.resetESForm();
  }

  onSubmit = () => {
    const { auditAlias } = this.props.match.params;
    this.props.elasticSearchStore.getESAuditPara(auditAlias);
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }

  handleSync = (params) => {
    this.props.elasticSearchStore.syncEsDocument(params);
  }

  renderTitle = title => capitalize(title.replace('_', ' '));

  render() {
    const {
      ES_AUDIT_FRM, formChange, esAuditParaOutput, esAuditParaOutputLoading, inProgress,
    } = this.props.elasticSearchStore;
    const { auditAlias } = this.props.match.params;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="large" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">{capitalize(auditAlias)} ES Audit</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {esAuditParaOutputLoading
            ? <InlineLoader />
            : (
<Form error>
              <Form.Group className="bottom-aligned mb-40">
                <FormInput
                  containerwidth={10}
                  name="random"
                  fielddata={ES_AUDIT_FRM.fields.random}
                  changed={(e, result) => formChange(e, result, 'ES_AUDIT_FRM')}
                />
                <Form.Field width={6}>
                  <Button type="button" primary onClick={this.onSubmit} content="Submit" />
                  <Button type="button" primary loading={inProgress === get(esAuditParaOutput, 'index_a.indexName')} onClick={() => this.handleSync({ documentId: ES_AUDIT_FRM.fields.random.value || '', targetIndex: get(esAuditParaOutput, 'index_a.indexName') || '', indexAliasName: get(esAuditParaOutput, 'alias') || '', userId: get(esAuditParaOutput, 'index_a.record.userId') || '', accountType: get(esAuditParaOutput, 'index_a.record.accountType') || '' })} content="Sync a" />
                  <Button type="button" primary loading={inProgress === get(esAuditParaOutput, 'index_b.indexName')} onClick={() => this.handleSync({ documentId: ES_AUDIT_FRM.fields.random.value || '', targetIndex: get(esAuditParaOutput, 'index_b.indexName') || '', indexAliasName: get(esAuditParaOutput, 'alias') || '', userId: get(esAuditParaOutput, 'index_b.record.userId') || '', accountType: get(esAuditParaOutput, 'index_b.record.accountType') || '' })} content="Sync b" />
                </Form.Field>
              </Form.Group>
              <Grid>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <Header as="h6">
                      {this.renderTitle(get(esAuditParaOutput, 'index_a.indexName') || '')} : (Count: {get(esAuditParaOutput, 'index_a.count') || 0} <span className="ml-10">{get(esAuditParaOutput, 'index_a.created.date') ? moment(get(esAuditParaOutput, 'index_a.created.date')).fromNow() : ''}</span>)
                    </Header>
                    {!get(esAuditParaOutput, 'index_a.record') && !get(esAuditParaOutput, 'index_b.record')
                    && <InlineLoader text="No Data Found" />
                    }
                  </Grid.Column>
                  <Grid.Column>
                    <Header as="h6">
                      {this.renderTitle(get(esAuditParaOutput, 'index_b.indexName') || '')} : (Count: {get(esAuditParaOutput, 'index_b.count') || 0} <span className="ml-10">{get(esAuditParaOutput, 'index_b.created.date') ? moment(get(esAuditParaOutput, 'index_b.created.date')).fromNow() : ''}</span>)
                    </Header>
                    {!get(esAuditParaOutput, 'index_a.record') && !get(esAuditParaOutput, 'index_b.record')
                    && <InlineLoader text="No Data Found" />
                    }
                  </Grid.Column>
                </Grid.Row>
                {(get(esAuditParaOutput, 'index_a.record') || get(esAuditParaOutput, 'index_b.record'))
                && (
<ReactDiffViewer
  oldValue={beautify(get(esAuditParaOutput, 'index_a.record') || '', null, 2)}
  newValue={beautify(get(esAuditParaOutput, 'index_b.record') || '', null, 2)}
  splitView
/>
                )}
              </Grid>
            </Form>
            )
          }
        </Modal.Content>
      </Modal>
    );
  }
}
