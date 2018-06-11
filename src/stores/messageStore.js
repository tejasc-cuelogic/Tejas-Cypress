import { observable } from 'mobx';

import { MESSAGES } from './../constants/messages';

export class NewMessage {
    @observable MESSAGE_FRM = { fields: { ...MESSAGES }, meta: { isValid: false, error: '' } };
}

export default new NewMessage();
