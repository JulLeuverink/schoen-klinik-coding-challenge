type fullNameOptions = {
  reversed: boolean;
  seperator: ' ' | ', ' | '; ';
};

export const getFullName = (
  firstName?: string,
  lastName?: string,
  options: fullNameOptions = { reversed: false, seperator: ' ' },
): string => {
  if (!firstName && !lastName) return '';
  if (!firstName && lastName) return lastName;
  if (!lastName && firstName) return firstName;
  return options.reversed
    ? lastName + options.seperator + firstName
    : firstName + options.seperator + lastName;
};
