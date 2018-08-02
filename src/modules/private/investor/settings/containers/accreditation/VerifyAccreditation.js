import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Button } from 'semantic-ui-react';
import { FormRadioGroup } from '../../../../../../theme/form';
import AssetsAccreditation from './assets/Accreditation';
import IncomeAccreditation from './income/Accreditation';

@inject('uiStore', 'accreditationStore')
@observer
export default class VerifyAccreditation extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const { ACCREDITATION_FORM, accreditationMethodChange } = this.props.accreditationStore;
    return (
      <div>
        <Route exact path={`${this.props.match.url}/income`} component={IncomeAccreditation} />
        <Route exact path={`${this.props.match.url}/assets`} component={AssetsAccreditation} />
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
            <FormRadioGroup
              fielddata={ACCREDITATION_FORM.fields.accreditationMethods}
              name="fundingType"
              changed={accreditationMethodChange}
              containerclassname="button-radio center-align"
            />
            {/* <Grid stackable textAlign="center">
              <Grid.Row columns={2}>
                <Grid.Column>
                  <div className="user-type">
                    <Header as="h4">Income</Header>
                    <p>
                      <b>Income of $200k, or $300k</b><br />
                      with spouse, in each of past 2 years and expecting same or more this year
                    </p>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div className="user-type">
                    <Header as="h4">Assets</Header>
                    <p>
                      <b>Net worth of $1M</b><br />
                      individually or joint with spouse, excluding your primary residence
                    </p>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid> */}
            {/* <Divider section hidden /> */}
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
