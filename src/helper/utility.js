/**
 * Some generally used function definations being used at multiple places
 */
import { toast } from 'react-toastify';

export class Helper {
  /**
   * Default Values for the alert message
   */
  position = toast.POSITION.TOP_CENTER;
  autoClose = 12000;

  /**
   * @desc To show alert notifications to the user
   */
  notify = (msg, alertType) => {
    switch (alertType) {
      default:
        toast(msg);
        break;
      case 'success':
        toast.success(`${msg}`, {
          position: this.position,
          autoClose: this.autoClose,
        });
        break;
      case 'error':
        toast.error(`${msg}`, {
          position: this.position,
          autoClose: this.autoClose,
        });
        break;
      case 'info':
        toast.info(`${msg}`, {
          position: this.position,
          autoClose: this.autoClose,
        });
        break;
    }
  }
}

export default new Helper();
