import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { capitalize, get } from 'lodash';
import moment from 'moment';
import prettyHtml from 'json-pretty-html';
import { Modal, Header, Form, Button, Grid } from 'semantic-ui-react';
import { FormInput } from '../../../../../theme/form';
import { InlineLoader } from '../../../../../theme/shared';
import HtmlEditor from '../../../../../modules/shared/HtmlEditor';

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
  renderTitle = title => capitalize(title.replace('_', ' '));
  render() {
    const {
      ES_AUDIT_FRM, formChange, esAuditParaOutput, esAuditParaOutputLoading,
    } = this.props.elasticSearchStore;
    const { auditAlias } = this.props.match.params;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="large" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">{capitalize(auditAlias)} ES Audit</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {esAuditParaOutputLoading ?
            <InlineLoader /> :
            <Form error onSubmit={this.onSubmit}>
              <Form.Group className="bottom-aligned mb-40">
                <FormInput
                  containerwidth={10}
                  name="random"
                  fielddata={ES_AUDIT_FRM.fields.random}
                  changed={(e, result) => formChange(e, result, 'ES_AUDIT_FRM')}
                />
                <Form.Field width={4}>
                  <Button primary content="Submit" />
                </Form.Field>
              </Form.Group>
              <Grid>
                <Grid.Row columns={2} divided>
                  <Grid.Column>
                    <Header as="h6">
                      {this.renderTitle(get(esAuditParaOutput, 'index_a.indexName') || '')} : (Count: {get(esAuditParaOutput, 'index_a.count') || 0} <span className="ml-10">{get(esAuditParaOutput, 'index_a.created.date') ? moment(get(esAuditParaOutput, 'index_a.created.date')).startOf('hour').fromNow() : ''}</span>)
                    </Header>
                    {get(esAuditParaOutput, 'index_a.record') ?
                      <div className="scrollable">
                        <HtmlEditor readOnly content={prettyHtml(get(esAuditParaOutput, 'index_a.record'))} />
                      </div> :
                      <section className="bg-offwhite center-align">
                        <h3 className="grey-header">No data found</h3>
                      </section>
                    }
                  </Grid.Column>
                  <Grid.Column>
                    <Header as="h6">
                      {this.renderTitle(get(esAuditParaOutput, 'index_b.indexName') || '')} : (Count: {get(esAuditParaOutput, 'index_b.count') || 0} <span className="ml-10">{get(esAuditParaOutput, 'index_b.created.date') ? moment(get(esAuditParaOutput, 'index_b.created.date')).startOf('hour').fromNow() : ''}</span>)
                    </Header>
                    {get(esAuditParaOutput, 'index_b.record') ?
                      <div className="scrollable">
                        <HtmlEditor readOnly content={prettyHtml(get(esAuditParaOutput, 'index_b.record'))} />
                      </div> :
                      <section className="bg-offwhite center-align">
                        <h3 className="grey-header">No data found</h3>
                      </section>
                    }
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          }
        </Modal.Content>
      </Modal>
    );
  }
}
