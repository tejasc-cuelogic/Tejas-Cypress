class ClientSearch {
  search = (list, srch, what) => {
    const params = {
      subItems: `${what}Items`,
      item: what === 'faq' ? 'question' : 'title',
      body: what === 'faq' ? 'answer' : 'body',
    };
    let result = list.filter(f => f[params.item].toLowerCase().includes(srch) ||
      f[params.subItems].find(item => item[params.item].toLowerCase().includes(srch) ||
      item[params.body].toLowerCase().includes(srch)));
    result = result.map((i) => {
      const updated = i;
      updated[params.subItems] = i[params.item].toLowerCase().includes(srch) ?
        updated[params.subItems] : updated[params.subItems].filter(ui =>
          ui[params.item].toLowerCase().includes(srch) ||
          ui[params.body].toLowerCase().includes(srch));
      return updated;
    });
    return result;
  }
}

export default new ClientSearch();
