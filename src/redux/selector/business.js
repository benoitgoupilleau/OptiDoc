export const listAffaires =  (rights, userId) => {
  return rights.filter(r => r.ID_Soudeur === userId).map(filtered => filtered.ID_Affaire);
}

export const listDocs = (docs, businesses) => {
  const docList = {}
  for (let i = 0; i < businesses.length; i += 1) {
    const affaire = businesses[i]
    const prep = docs.filter(d => (d.Dossier1 === affaire && d.Dossier2 === 'Preparation'))
    const rea = docs.filter(d => (d.Dossier1 === affaire && d.Dossier2 === 'Realisation'))
    docList[affaire] = {
      prep,
      rea
    }
  }
  return docList;
}