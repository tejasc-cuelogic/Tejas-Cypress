import { observable } from 'mobx';

// phases: 1: CREATION, 2: LIVE, 3: SOFT CLOSE, 4: ENGAGEMENT
export class BusinesssStore {
  @observable businesses = [
    { id: 1, name: 'Bob Cycle', phase: 1 },
    { id: 2, name: 'Prasanna Wines', phase: 2 },
  ];
}
export default new BusinesssStore();
