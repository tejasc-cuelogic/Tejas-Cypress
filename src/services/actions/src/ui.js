import { uiStore } from '../../stores';

export class UserInterface {
  setOpenAccordion = (id) => {
    uiStore.setOpenAccordion(id);
  }
}

export default new UserInterface();
