import React from 'react';
import { Header, Form, Popup, Icon, Divider } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../theme/form';

const FinancialInfo = () => (
  <div>
    <Header as="h3" textAlign="center">How much would you like to invest?</Header>
    <Form error size="huge">
      <MaskedInput
        currency
        prefix="$ "
        fielddata={{ placeHolder: '$ 0', value: '500' }}
      />
    </Form>
    <Divider hidden />
    <p>
      <b>Total Investment Return: $450–$480</b>
      <Popup
        wide
        trigger={<Icon name="help circle" color="green" />}
        content="This calculates the total amount that the issuer agrees to pay you under the note purchase agrrement, based on what you enter above. Payment is not guaranteed or ensured and investors may lose some or all of the principal invested. "
        position="top center"
      />
    </p>
    <p>
      + 2 Private VIP Launch Party Invitations
    </p>
  </div>
);

export default FinancialInfo;
