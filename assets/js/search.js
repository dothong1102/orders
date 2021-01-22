var selectOption = document.querySelector('.main .handle-form .search-container .search-list');
var btnSearch = document.querySelector('.main .handle-form .search-container .search-form .search-button');
var searchInput = document.querySelector('.main .handle-form .search-container .search-form .search-input');
var dateBlock = document.querySelector('.main .handle-form .search-container .date-input');

btnSearch.onclick = function(e) {
    renderIndexOfSelectSearch(e)
};

function renderIndexOfSelectSearch(e) {
    let option = selectOption.value;
    let keyword = searchInput.value.trim();

    for (let tabItem of tabItems) {
        if (tabItem.matches('.active')) {
            var tabId = tabItem.dataset.tab;

        }
    }

    switch (tabId) {
        case '1':
            {
                var data = orders;
                if (option == 'dateCreated') {
                    var checkOption = true;
                }
                break;
            }
        case '2':
            {
                var data = customers;
                break;
            }
        case '3':
            {
                var data = products;
                break;
            }
        default:
            {
                var data = '';
            }
    }

    if (checkOption) {
        let dateFrom = dateBlock.querySelector('#dateFrom').value;
        let dateTo = dateBlock.querySelector('#dateTo').value;
        let result = getInfoWithDate(dateFrom, dateTo, data);
        renderDataTable(tabId, result);
    } else {
        if (keyword) {
            let result = getInfoWhenCheckAccess(keyword, data, option);

            result = result.filter((el) => {
                return el != null;
            })

            renderDataTable(tabId, result);
        } else {
            renderDataTable(tabId);
        }
    }
    selectOption.value = option;
}

function getInfoWithDate(dateFrom, dateTo, data) {
    let result = data.filter((value) => {
        if (value.dateCreated >= dateFrom && value.dateCreated <= dateTo) {
            return value;
        }

    })
    return result;
}

// Get Index của Search
function getIndexOfSearch(tabId) {
    let tabContents = document.querySelectorAll('.form-action .tab-wrapper .tab-content');
    let contentSelect = ``;
    for (let tabContent of tabContents) {
        if (tabContent.dataset.tab == tabId) {
            var inputElements = Array.from(tabContent.querySelectorAll('.form .form-input .column-input:first-child input'));
            if (tabId == 3) {
                inputElements.pop();
            }
            break;
        }
    }

    for (let input of inputElements) {
        if (Array.isArray(nameInputs)) {
            nameInputs.push(input.name)
        } else {
            var nameInputs = [input.name];
        }

        if (Array.isArray(labelInputs)) {
            labelInputs.push(input.parentElement.querySelector('label').innerText)
        } else {
            var labelInputs = [input.parentElement.querySelector('label').innerText];
        }

    }

    for (let i = 0; i < nameInputs.length; i++) {
        contentSelect += `<option value="${nameInputs[i]}">${labelInputs[i]}</option>`;
    }
    selectOption.innerHTML = contentSelect;

    if (tabId == 1) {
        selectOption.onchange = function() {

            if (selectOption.value == 'dateCreated') {
                showInputDate();
            } else {
                hiddenInputDate();
            }
        }
    }
}

function hiddenInputDate() {
    dateBlock.style.animation = 'hiddenDate linear .5s';
    dateBlock.style.transform = 'translate(200%, -225%)';
    setTimeout(hiddenDate, 500);

}

function hiddenDate() {
    dateBlock.style.display = 'none';
    handleForm.style.marginTop = '30px';
}

function showInputDate() {
    handleForm.style.marginTop = '70px';
    dateBlock.style.animation = 'moveDate linear .5s';
    dateBlock.style.transform = 'translate(0%, -225%)';
    dateBlock.querySelector('#dateFrom').valueAsDate = new Date();
    dateBlock.querySelector('#dateTo').valueAsDate = new Date();
    dateBlock.style.display = 'flex';
}