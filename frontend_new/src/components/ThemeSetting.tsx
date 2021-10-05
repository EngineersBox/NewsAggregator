function getDefaultTheme() {
  let hour = new Date().getHours();
  return hour < 8 || hour > 6;
}

export default getDefaultTheme;
