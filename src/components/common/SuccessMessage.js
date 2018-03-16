import React from 'react';
import { Message } from 'semantic-ui-react';

class SuccessMessage extends React.Component {
  state = { visible: true }

  handleDismiss = () => {
    this.setState({ visible: false });

    setTimeout(() => {
      this.setState({ visible: true });
    }, 2000);
  }
  render() {
    const { success } = this.props;
    if (success) {
      return (
        <Message
          state={this.state.visible}
          onDismiss={this.handleDismiss}
          positive
          compact
          className="toast visible"
        >
          <Message.Header>Success!!</Message.Header>
          <p>{success}</p>
        </Message>
        // <ul className="">
        //   <li>
        //     {success}
        //   </li>
        // </ul>
      );
    }
    return null;
  }
}

export default SuccessMessage;
