import FilesToExclude from '../../constants/FilesToExclude'

export const listDocs = (docs = [], newDoc = [], businesses = []) => {
  const docList = {}
  for (let i = 0; i < businesses.length; i += 1) {
    const affaire = businesses[i]
    const prep = docs.filter(d => (d.dossier1 && d.dossier1 === affaire.id && d.dossier2 === 'Preparation' && !FilesToExclude.includes(d.dossier3)))
    const rea = [...docs.filter(d => (d.dossier1 && d.dossier1 === affaire.id && d.dossier2 === 'Realisation')), ...newDoc.filter(d => (d.dossier1 && d.dossier1 === affaire.id))]
    docList[affaire.id] = {
      prep,
      rea
    }
  }
  return docList;
}

export const listNewDocs = (docs = [], businesses = []) => {
  const docList = {}
  for (let i = 0; i < businesses.length; i += 1) {
    const affaire = businesses[i]
    const newDocs = docs.filter(d => (d.dossier1 && d.dossier1 === affaire.id))
    docList[affaire.id] = newDocs;
  }
  return docList;
}