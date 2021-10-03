function getDefaultTheme() {
  let hour = new Date().getHours();
  return hour < 8 || hour > 20;
}

export default getDefaultTheme;
