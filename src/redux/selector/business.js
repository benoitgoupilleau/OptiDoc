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

export const getModeleHierarchy = (docs) => {
  const hierarchy = {};
  const modeleDocs = docs.filter(d => d.Dossier1 === 'Modele');
  const h1 = [];
  for (let i = 0; i < modeleDocs.length; i++) {
    const level1 = modeleDocs[i].Dossier2
    if (level1 !== '' && !h1.includes(level1)) {
      h1.push(level1);
      const h2 = [];
      const subDocs = modeleDocs.filter(d => d.Dossier2 === level1);
      for (let j = 0; j < subDocs.length; j++) {
        const level2 = subDocs[j].Dossier3;
        if (level2 !== '' && !h2.includes(level2)) {
          h2.push(level2);
          hierarchy[level1][level2] = subDocs[j].ID
        } else {
          hierarchy[level1] = modeleDocs[i].ID
        }
      }
    }
  }
  return hierarchy;
}