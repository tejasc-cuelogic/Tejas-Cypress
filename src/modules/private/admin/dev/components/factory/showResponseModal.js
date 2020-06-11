import React from 'react';
import { isEmpty } from 'lodash';
import beautify from 'json-beautify';
import { Modal, Header } from 'semantic-ui-react';

function ShowResponseModal(props) {
  const { factoryResponse, handleCloseModel, open } = props;
  return (
    <Modal size="small" open={open} closeOnDimmerClick={false} closeIcon onClose={e => handleCloseModel(e, false)}>
      <Modal.Content>
        <Header as="h3">Response Payload</Header>
        {factoryResponse && !isEmpty(factoryResponse)
          ? (
            <pre className="no-updates bg-offwhite padded json-text">
              {beautify(factoryResponse, null, 2, 100)}
            </pre>
          )
          : (
            <section className="bg-offwhite mb-20 center-align">
              <Header as="h5">No Response Available.</Header>
            </section>
          )
        }
      </Modal.Content>
    </Modal>
  );
}

export default ShowResponseModal;
