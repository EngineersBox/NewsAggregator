
function getDefaultTheme() {
    //get the current date
    var date = new Date();
    
    //0 to 23
    var hour =  date.getHours();

    if (hour < 6 || hour >22) { 
        return false; 
    } else {
        return true; 
    }
};

export default getDefaultTheme;