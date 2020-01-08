import React from 'react';
import { toast } from 'react-toastify';

class SuccessMessage extends React.Component {
  toastId = null;

  notify = () => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.success(`${this.props.success}`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 12000,
      });
    }
  }

  render() {
    const { success } = this.props;
    if (success) {
      return (
        <div>
          {this.notify()}
        </div>
      );
    }
    return null;
  }
}

export default SuccessMessage;
