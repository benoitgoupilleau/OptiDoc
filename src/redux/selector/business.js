export const listAffaires =  (rights, userId) => {
  return rights.filter(r => r.ID_User === userId).map(filtered => filtered.ID_Affaire);
}

export const listDocs = (docs, newDoc, businesses) => {
  const docList = {}
  for (let i = 0; i < businesses.length; i += 1) {
    const affaire = businesses[i]
    const prep = docs.filter(d => (d.Dossier1 === affaire && d.Dossier2 === 'Preparation'))
    const rea = [...docs.filter(d => (d.Dossier1 === affaire && d.Dossier2 === 'Realisation')), ...newDoc.filter(d => d.Dossier1 === affaire)]
    docList[affaire] = {
      prep,
      rea
    }
  }
  return docList;
}

export const listNewDocs = (docs, businesses) => {
  const docList = {}
  for (let i = 0; i < businesses.length; i += 1) {
    const affaire = businesses[i]
    const newDocs = docs.filter(d => (d.Dossier1 === affaire))
    docList[affaire] = newDocs;
  }
  return docList;
}