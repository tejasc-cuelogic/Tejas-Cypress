/**
 * Some generally used function definations being used at multiple places
 */
import { toast } from 'react-toastify';
import _ from 'lodash';

export class Utility {
  // Default options for the toast
  options = {
    autoClose: 3800,
    position: toast.POSITION.TOP_RIGHT,
    pauseOnHover: true,
    className: 'info',
  };

  /**
   * @desc To show alert notifications to the user
   * reference: https://fkhadra.github.io/react-toastify/
   */
  toast = (msg, alertType, optionsOverride) => {
    if (alertType && _.includes(['error', 'success', 'info', 'warning'], alertType)) {
      toast[alertType](`${msg}`, _.merge({}, this.options, optionsOverride, { className: alertType }));
    } else {
      toast(`${msg}`, _.merge({}, this.options, optionsOverride));
    }
  }
}

export default new Utility();
