export const listAffaires =  (rights, userId) => {
  return rights.filter(r => r.ID_Soudeur === userId).map(filtered => filtered.ID_Affaire);
}