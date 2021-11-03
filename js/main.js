const openForm = (evt, formName) => {
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tab-content")
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab")
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "")
    }

    document.getElementById(formName).style.display = "block";
    evt.currentTarget.className += " active";

}

window.addEventListener("load", (event) => {
    document.getElementById('login').style.display = "block";
    document.getElementById('signup').style.display = "none";

})