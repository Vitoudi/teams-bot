const jsonTokenReference = "jsonToken";

export function setJsonToken(value: string): void {
  if (!localStorage) return;

  localStorage.setItem(jsonTokenReference, value);
}

export function getJsonToken(): string {
  if (!localStorage) return;

  const jsonToken = localStorage.getItem(jsonTokenReference);

  return JSON.parse(jsonToken);
}
