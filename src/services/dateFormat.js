export const getDateFormat = (date) => {
  let day = date.getDate().toString();
  if (day.length === 1) day = '0' + day;
  let month = (date.getMonth() + 1).toString();
  if (month.length === 1) month = '0' + month;
  const year = date.getFullYear();
  let hours = date.getHours().toString();
  if (hours.length === 1) hours = '0' + hours;
  let minutes = date.getMinutes().toString();
  if (minutes.length === 1) minutes = '0' + minutes;
  let secondes = date.getMilliseconds().toString()
  if (secondes.length === 1) secondes = '00' + secondes;
  if (secondes.length === 2) secondes = '0' + secondes;
  return { day, month, year, hours, minutes, secondes }
}