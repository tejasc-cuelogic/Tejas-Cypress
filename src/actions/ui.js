import uiStore from '../stores/uiStore';

export class UserInterface {
  setOpenAccordion = (id) => {
    uiStore.setOpenAccordion(id);
  }
}

export default new UserInterface();
