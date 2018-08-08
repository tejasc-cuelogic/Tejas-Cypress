import React from 'react';
import Aux from 'react-aux';
import { Modal, Header, Button, Grid, Form, Popup, Icon, List, Divider } from 'semantic-ui-react';
import { MaskedInput2, FormCheckbox } from '../../../../../../../theme/form';

export default class Agreement extends React.Component {
  handleCloseModal = () => {
    this.props.history.push('overview');
  }
  submit = () => {
    this.props.history.push('doc-sign');
  }
  render() {
    const checkboxesLeft = {
      checkboxes: {
        value: [],
        values: [
          {
            label: 'I understand that I may not be able to cancel my investment commitment or obtain a return of my investment.', value: 'test',
          },
          {
            label: 'I understand that I may not be able to sell the securities I am acquiring in this offering.', value: 'test',
          },
          {
            label: 'I understand that investing in securities sold in reliance on Regulation Crowdfunding involves risks and I should not invest any funds unless I can afford to lose the entire amount.', value: 'test',
          },
          {
            tooltip: (
              <Popup.Content>
                <p>
                  Regulation Crowdfunding limits the total amount you can invest in a
                  12-month period:
                </p>
                <List relaxed bulleted>
                  <List.Item>
                  If either your annual income or net worth is less than $107,000, you can invest
                  5% of the lower figure. But anyone can invest at least $2,200.
                  </List.Item>
                  <List.Item>
                  If both your annual income and net worth are greater than $107,000, you can
                  invest 10% of the lower figure. But no one can invest more than $107,000.
                  </List.Item>
                  <List.Item>
                  If you invest through an entity, the same rules apply based on the entity’s
                  revenue and net assets (as of its most recent fiscal year end).
                  </List.Item>
                </List>
              </Popup.Content>
            ),
            label: (
              <Aux>
                I confirm that I am complying with my <b>annual investment limit</b> (<a href="/">update</a>)
              </Aux>
            ),
            value: 'test',
          },
        ],
        error: undefined,
        rule: 'array',
      },
    };
    const checkboxesRight = {
      checkboxes: {
        value: [],
        values: [
          {
            label: (
              <Aux>
                I have reviewed and agree to the terms of the <a href="/">Note Purchase Agreement</a>.
              </Aux>
            ),
            value: 'test',
          },
          {
            label: (
              <Aux>
                I have reviewed NextSeed’s <a href="/">educational materials</a>, understand that
                the entire amount of my investment may be lost, and confirm that I am in a
                financial condiiton to bear the loss. I have read and agree to the terms of
                the <a href="/">CrowdPay Custodial Account Agreement</a>,
                the <a href="/">Substitute IRS Form W-9 Certificaiton</a>,
                and <a href="/">NextSeed Investor Membership Agreement</a>.
              </Aux>
            ),
            value: 'test',
          },
        ],
        error: undefined,
        rule: 'array',
      },
    };
    return (
      <Modal size="large" open closeIcon closeOnRo otNodeClick={false} onClose={() => this.handleCloseModal()}>
        <Modal.Content className="signup-header">
          <Header as="h3">
            Let{"'"}s confirm your investment.<br />You are investing
            <span className="positive-text"> $300</span> in Pour Behavior.
          </Header>
          <Form error size="huge">
            <Grid divided doubling columns={4} className="agreement-details">
              <Grid.Column>
                <MaskedInput2
                  hoverable
                  currency
                  prefix="$ "
                  fielddata={{
                    placeHolder: '$ 0', value: '500', label: 'Net Worth', tooltip: (<Aux>You can see how to calculate your net worth <a href="">here</a>.</Aux>),
                  }}
                />
              </Grid.Column>
              <Grid.Column>
                <MaskedInput2
                  currency
                  prefix="$ "
                  fielddata={{
                    placeHolder: '$ 0', value: '500', label: 'Annual Income', tooltip: (<Aux>You can include ancillary sources of income (including from side jobs, rental income and capital gains) and your spouse’s income.</Aux>),
                  }}
                />
              </Grid.Column>
              <Grid.Column>
                <MaskedInput2
                  hoverable
                  currency
                  prefix="$ "
                  fielddata={{
                    placeHolder: '$ 0', value: '500', label: 'Other Reg CF Investments', tooltip: (<Aux>Other Regulation Crowdfunding investments made in other platforms. Note: This does not include any donation/rewards crowdfunding platforms (e.g. Kickstarter) or investments made in offerings under other sets of regulations (e.g. Reg D, Reg A). If you have any questions about what constitutes other crowdfunding investments, please contact <a href="/">support@nextseed.com</a></Aux>),
                  }}
                />
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <p className="note"><i>Why do I need to provide this information?</i>
                  <Popup
                    trigger={<Icon color="green" name="help circle" />}
                    content="If you invest more than $2,200 in a 12-month period, we are required by law to ask for your net worth and annual income."
                    position="top center"
                  />
                </p>
              </Grid.Column>
            </Grid>
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={8}>
                  <FormCheckbox
                    defaults
                    fielddata={checkboxesLeft.checkboxes}
                    name="agreement"
                    containerclassname="ui very relaxed list"
                  />
                </Grid.Column>
                <Grid.Column width={8}>
                  <FormCheckbox
                    defaults
                    fielddata={checkboxesRight.checkboxes}
                    name="agreement"
                    containerclassname="ui very relaxed list"
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
          <Divider hidden />
          <div className="center-align">
            <Button primary onClick={this.submit}>Submit</Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}
