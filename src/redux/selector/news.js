export const filterNews = (news) => {
  return news.sort((a, b) => (a.CreatedOn > b.CreatedOn ? -1 : 1)).filter(n => n.ON_Visible === 'O');
}