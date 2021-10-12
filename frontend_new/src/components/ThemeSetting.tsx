function getDefaultTheme() {
  // let hour = new Date().getHours();
  // return hour < 8 || hour > 18;

  let d = new Date();
  let offset = (new Date().getTimezoneOffset() / 60) * -1;
  let n = new Date(d.getTime() + offset);
  return n.getHours() < 8 || n.getHours() > 18;
}

export default getDefaultTheme;
