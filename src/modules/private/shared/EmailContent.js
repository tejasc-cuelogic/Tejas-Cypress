import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Modal, Button, Header } from 'semantic-ui-react';
import { InlineLoader } from '../../../theme/shared';
import Helper from '../../../helper/utility';
import HtmlEditor from '../../shared/HtmlEditor';


function EmailContent(props) {
  const [emailContent, setEmailContent] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Helper.modalCssUpdate('show-top', 'show-top');
    const { commonStore, match } = props;
    const params = {
      id: match.params.id,
      requestDate: match.params.requestDate,
    };
    setLoading(true);
    commonStore.getEmail(params).then((res) => {
      setEmailContent(get(res, 'getEmail'));
      setLoading(false);
    }).catch((e) => {
      setLoading(false);
      setErrorMsg(get(e, 'message'));
    });
  }, []);

  function handleCloseModal(e) {
    e.preventDefault();
    props.history.push(props.refLink);
  }

  return (
    <Modal open closeOnDimmerClick size="large" className="show-top" closeIcon onClose={e => handleCloseModal(e)}>
      <Modal.Content className="center-align">
        <Header as="h3" textAlign="center">Email Content</Header>
        {loading ? <InlineLoader /> : ''}
        <HtmlEditor
          readOnly
          content={emailContent}
        />
        {errorMsg && <p>{errorMsg}</p>}
        <div className="center-align">
          <Button.Group widths="2" className="inline">
            <Button primary content="Back" onClick={handleCloseModal} />
          </Button.Group>
        </div>
      </Modal.Content>
    </Modal>
  );
}

export default inject('uiStore', 'commonStore')(observer(EmailContent));