export function getDateFromLog(isoDate: string) {
  const date = new Date(isoDate);

  if (isToday(date)) {
    return getFormatedTime(date);
  }

  if (isYesterday(date)) {
    return "ontem";
  }

  return getFormatedDate(date);
}

export function getCurrentIsoDate() {
  return new Date().toISOString();
}

function isToday(date: Date) {
  const today = new Date().getDate();
  const dayOnGivenDate = date.getDate();

  return today === dayOnGivenDate;
}

function isYesterday(date: Date) {
  const yesterday = new Date().getDate() - 1;
  const dayOnGivenDate = date.getDate();

  return yesterday === dayOnGivenDate;
}

function getFormatedDate(date: Date) {
  const formatedDateWithYear = getDateAndTime(date).formatedDate;

  const formatedDateWithoutYear = removeLastSectionInCharSeparetedString(
    formatedDateWithYear,
    "/"
  );

  return formatedDateWithoutYear;
}

function getFormatedTime(date: Date) {
  const timeWithMilliseconds = getDateAndTime(date).time;

  const timeWithoutMilliseconds = removeLastSectionInCharSeparetedString(
    timeWithMilliseconds,
    ":"
  );

  return timeWithoutMilliseconds;
}

function getDateAndTime(date: Date) {
  const splitedDate = date.toLocaleString().split(" ");
  const [formatedDate, time] = splitedDate;

  return { formatedDate, time };
}

function removeLastSectionInCharSeparetedString(str: string, char: string) {
  const lastCharIndex = str.lastIndexOf(char);
  const result = str.slice(0, lastCharIndex);

  return result;
}
