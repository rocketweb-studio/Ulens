export function formatDateDDMMYYYY(dateInput: string | Date): string {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    console.warn("formatDateDDMMYYYY: Некорректная дата", dateInput);
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // месяцы начинаются с 0
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}