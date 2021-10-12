function getDefaultTheme() {
  let hour = new Date().getHours();

  return hour >= 8 && hour <= 18 ? "light" : "dark";
}

export default getDefaultTheme;
