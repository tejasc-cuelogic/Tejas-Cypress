// import Fuse from 'fuse.js';

class ClientSearch {
  options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: [
      'title', 'knowledgeBaseItems.title',
    ],
  };

  search = (list, params) => {
    // const fuse = new Fuse(list, this.options);
    // (params && params !== '') ? fuse.search(params || '') :
    console.log(params);
    return list;
  }
}

export default new ClientSearch();
