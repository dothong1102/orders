var tabElement = document.querySelector('.main .form-action .tab');
var minimizeIcon = tabElement.querySelector('.icon-minimize');
var handleForm = document.querySelector('.main .handle-form');
var tableElement = document.querySelector('.main .table');
var maximizeIcon = document.getElementById('icon-maximize');

minimizeIcon.onclick = function() {
    handleForm.style.marginTop = '600px';
    tabElement.style.transform = 'translateX(200%)';
    setTimeout(() => {
        tabElement.style.display = 'none';
        handleForm.style.marginTop = '30px';
        maximizeIcon.style.display = 'block';
        maximizeIcon.onclick = maximize;
    }, 500);
}

function maximize() {
    handleForm.style.opacity = '0';
    tableElement.style.opacity = '0';
    setTimeout(() => {
        handleForm.style.display = 'none';
        tableElement.style.display = 'none';
        tabElement.style.display = 'block';

    }, 500)
    setTimeout(() => {
        tabElement.style.transform = 'translateX(0%)';
        handleForm.style.display = 'flex';
        tableElement.style.display = 'block';
    }, 550)
    setTimeout(() => {
        handleForm.style.opacity = '1';
        tableElement.style.opacity = '1';
        maximizeIcon.style.display = 'none';
    }, 600)

    // handleForm.style.top = '600px';

    // setTimeout(() => {
    //     handleForm.style.top = '30px';

    //     maximizeIcon.style.display = 'none';
    // }, 500);

}