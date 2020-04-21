import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Modal, Divider, Grid, Form, Header, Button } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'partnerStore',
  form: 'PARTNER_FRM',
};

function EditPartner(props) {
  const { smartElement } = props;
  const history = useHistory();

  const { inProgress } = props.uiStore;
  if (inProgress) {
    return <InlineLoader />;
  }
  return (
    <Modal closeOnDimmerClick={false} closeOnEscape={false} dimmer="inverted" open onClose={() => history.push(props.refLink)} size="large" closeIcon>
      <Modal.Content className="transaction-details">
        <div>
          <Header as="h3">
            Create Partner
            <Button.Group compact floated="right">
              <Button
                inverted
                color="green"
                content="Save"
              />
            </Button.Group>
          </Header>
        </div>
        <Divider hidden />
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <small>Partner name</small>
              <Form>
                {smartElement.Input('title')}
                {smartElement.HtmlEditor('content')}
                <Divider />
                {smartElement.HtmlEditor('altContent')}
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
    </Modal>
  );
}
export default inject('uiStore')(formHOC(observer(EditPartner), metaInfo));
