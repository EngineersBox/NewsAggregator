
function getDefaultTheme() {
    let hour = new Date().getHours();
    return hour < 6 || hour > 22;   
};

export default getDefaultTheme;