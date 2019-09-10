export const filterNews = news => {
  return news
    .sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1))
    .filter(n => n.oN_Visible === 'O');
};
