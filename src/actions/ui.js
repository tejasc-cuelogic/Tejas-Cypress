import uiStore from '../stores/uiStore';

export class UserInterface {
  setOpenAccordion = (id) => {
    const currentOpen = uiStore.openAccordion;
    uiStore.setOpenAccordion(currentOpen === id ? '' : id);
  }
}

export default new UserInterface();
