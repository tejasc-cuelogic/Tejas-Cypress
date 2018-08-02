import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Button, Grid } from 'semantic-ui-react';
import { ACCREDITATION_METHODS_META } from './../../../../../../services/constants/investmentLimit';

@inject('uiStore', 'accreditationStore')
@observer
export default class VerifyAccreditation extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const accreditationMethods = ACCREDITATION_METHODS_META.slice();
    const { ACCREDITATION_FORM, accreditationMethodChange } = this.props.accreditationStore;
    return (
      <div>
        <Modal open closeIcon onClose={this.handleCloseModal} size="tiny" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h3">How are you accredited?</Header>
            <Divider />
            <p>
            To invest in Regulation D or 506(c) offerings, you will need to verify that
            you are an accredited investor.
              <br />
            Please confirm which of the following is applicable for you:
            </p>
          </Modal.Header>
          <Modal.Content>
            <Grid stackable textAlign="center">
              <Grid.Row columns={2}>
                <Grid.Column
                  onClick={e => accreditationMethodChange(e, { name: 'accreditationMethods', value: 'income' })}
                >
                  <div className={`user-type ${(ACCREDITATION_FORM.fields.accreditationMethods.value === 'income' ? 'active' : '')}`}>
                    <Header as="h4">Income</Header>
                    <p>
                      <b>Income of $200k, or $300k</b><br />
                      with spouse, in each of past 2 years and expecting same or more this year
                    </p>
                  </div>
                </Grid.Column>
                <Grid.Column
                  onClick={e => accreditationMethodChange(e, { name: 'accreditationMethods', value: 'assets' })}
                >
                  <div className={`user-type ${(ACCREDITATION_FORM.fields.accreditationMethods.value === 'assets' ? 'active' : '')}`}>
                    <Header as="h4">Assets</Header>
                    <p>
                      <b>Net worth of $1M</b><br />
                      individually or joint with spouse, excluding your primary residence
                    </p>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Button
              circular
              icon={{ className: 'ns-arrow-right' }}
              className="multistep__btn next active"
              as={Link}
              to={`${this.props.match.url}/${ACCREDITATION_FORM.fields.accreditationMethods.value}`}
            />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
