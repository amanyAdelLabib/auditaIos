export const sortAnswers = (a, b) => {
  if (Object.keys(a) < Object.keys(b)) {
    return -1;
  }
  if (Object.keys(a) > Object.keys(b)) {
    return 1;
  }
  return 0;
};
