class ClientSearch {
  search = (list, srch, what) => {
    const params = {
      subItems: `${what}ItemList`,
      item: 'categoryName',
      body: 'content',
    };
    let result = list.filter(f => f[params.item].toLowerCase().includes(srch.toLowerCase()) ||
      f[params.subItems].find(item => item[params.item].toLowerCase().includes(srch.toLowerCase())
      ||
      item[params.body].toLowerCase().includes(srch.toLowerCase())));
    result = result.map((i) => {
      const updated = i;
      updated[params.subItems] = i[params.item].toLowerCase().includes(srch.toLowerCase()) ?
        updated[params.subItems] : updated[params.subItems].filter(ui =>
          ui[params.item].toLowerCase().includes(srch.toLowerCase()) ||
          ui[params.body].toLowerCase().includes(srch.toLowerCase()));
      return updated;
    });
    return result;
  }
}

export default new ClientSearch();
