import React from 'react';
import { inject, observer } from 'mobx-react';

import LinkBankPlaid from './LinkBankPlaid';
import LinkBankForm from './LinkBankForm';

@inject('accountStore')
@observer
export default class LinkBankAccountPlaid extends React.Component {
  render() {
    return (
      <div>
        {this.props.accountStore.bankLinkInterface === 'list' &&
          <LinkBankPlaid />
        }
        {this.props.accountStore.bankLinkInterface === 'form' &&
          <LinkBankForm />
        }
      </div>
    );
  }
}
