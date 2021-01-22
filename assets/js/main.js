var regex1 = /^([0-9]*)([.]?[0-9]*)*( ₫){1}$/;
var regex2 = /^([0-9]*)([.]?[0-9]{3})*( ₫){1}$/;
var regex3 = /^([0-9]*)([.]?[0-9]*)*/;
var regex4 = /^([0-9]*)([.]?[0-9]{3})*/;
var regex5 = /([0-9]*)([.]?[0-9]{3})*( ₫){1}$/;

// Lấy ngày hiện tại của input date
document.getElementById("dateCreated").valueAsDate = new Date();

// Tab action
window.addEventListener("load", function() {
    renderDataTable();
    const tabs = document.querySelectorAll(".tab-item");
    const tabsContent = document.querySelectorAll(".tab-content");

    function handleChangeTab(e) {
        const tabId = e.target.dataset.tab;
        tabs.forEach((el) => el.classList.remove("active"));
        e.target.classList.add("active");
        tabsContent.forEach((el) => {
            el.classList.remove("active");
            if (el.getAttribute("data-tab") === tabId) {
                el.classList.add("active");
            }
        });

        ordersData = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
        products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
        customers = localStorage.getItem('customers') ? JSON.parse(localStorage.getItem('customers')) : [];
        if (tabId == '1') {
            getProductsForSelectBox();
        }
        hiddenInputDate();
    }

    tabs.forEach((el) => el.addEventListener("click", handleChangeTab));
});


// Lưu dữ liệu
function handleSaveData(data, nameStorage, tabId) {
    let dataStorage = localStorage.getItem(nameStorage) ? JSON.parse(localStorage.getItem(nameStorage)) : [];
    dataStorage.unshift(data);
    localStorage.setItem(nameStorage, JSON.stringify(dataStorage));
    clearInputs();
    renderDataTable(tabId);
}

// Render lại dữ liệu ra bảng khi chuyển tab
let tabItems = document.querySelectorAll('.form-action .tab .tab-list .tab-item');
for (let tabItem of tabItems) {
    tabItem.addEventListener('click', function(e) {
        renderDataTable(e.target.dataset.tab);
        getIndexOfSearch(e.target.dataset.tab);
    });
}

// Render dữ liệu ra bảng
function renderDataTable(tabId, contentData) {
    let tblListInfo = document.getElementById('tblListInfo');
    let tableContent = ``;
    let tabContent = Array.from(document.querySelectorAll('.form-action > .tab > .tab-wrapper .tab-content'));
    if (tabId) {
        for (let element of tabContent) {
            if (element.getAttribute('data-tab') == tabId) {
                if (contentData) {
                    tableContent = render(element, tabId, contentData);

                } else {
                    tableContent = render(element, tabId);
                }
                break;
            }
        }
    } else {
        for (let element of tabContent) {
            if (element.classList.contains('active')) {
                tabId = element.getAttribute('data-tab');
                tableContent = render(element, tabId);
                break;
            }
        }
    }


    tblListInfo.innerHTML = tableContent;
    getIndexOfSearch(tabId);
}

function render(element, tabId, contentData) {
    let tableContent = ``;
    // Lấy tên các cột của table
    let fieldLabel = Array.from(element.querySelectorAll('.form-input .form-group label'));
    fieldLabel.forEach((label, index) => {
        if (label.innerText.includes('(%)')) {
            fieldLabel[index] = label.innerText.replace('(%)', '');
        } else {
            fieldLabel[index] = label.innerText;
        }
    })
    fieldLabel.unshift('No');

    // Thêm tên cột
    for (let i = 0; i < fieldLabel.length; i++) {
        if (i == 0) {
            tableContent += `<thead><tr><th>${fieldLabel[i]}</th>`;
        } else if (i == fieldLabel.length - 1) {
            tableContent += `<th>${fieldLabel[i]}</th><th>Thao tác</th></tr></thead>`;
        } else {
            tableContent += `<th>${fieldLabel[i]}</th>`;
        }
    }

    // Lấy name của các input
    let nameInputs = [],
        inputs;
    if (tabId == '1') {
        let inputsCol = Array.from(element.querySelectorAll('.form-input .column-input:first-child input[name]'));
        inputsCol.push(element.querySelector('.form-input .column-input:last-child select'));
        inputs = inputsCol.concat(Array.from(element.querySelectorAll('.form-input .column-input:last-child input[name]')));
    } else {
        inputs = element.querySelectorAll('.form-input input[name]');
    }

    inputs.forEach((input, index) => {
        nameInputs.push(input.name);
    });

    // Hiển thị dữ liệu ra bảng
    let nameStorage = element.querySelector('div').getAttribute('nameStorage');
    if (contentData) {
        var dataStorage = contentData;
    } else {
        var dataStorage = localStorage.getItem(nameStorage) ? JSON.parse(localStorage.getItem(nameStorage)) : [];
    }

    if (dataStorage.length > 0) {
        tableContent += `<tbody>`;
        for (let i = 0; i < dataStorage.length; i++) {
            tableContent += `<tr><td><b class="hidden-row">Số thứ tự</b>${i + 1}</td>`;
            nameInputs.forEach((value, index) => {

                switch (value) {
                    case 'dateCreated':
                        {
                            let dateCreated = dataStorage[i][value].split('-').reverse().join('-');
                            tableContent += `<td><b class="hidden-row">${fieldLabel[index + 1]}</b>${dateCreated}</td>`;
                            break;
                        }
                    case 'phone':
                        {
                            tableContent += `<td><b class="hidden-row">${fieldLabel[index + 1]}</b>0${parseInt(dataStorage[i][value]).toLocaleString()}</td>`;
                            break;
                        }
                    case 'discount':
                        {
                            if (dataStorage[i][value] <= 100) {
                                tableContent += `<td><b class="hidden-row">${fieldLabel[index + 1]}</b>${dataStorage[i][value]}%</td>`;
                            } else {
                                tableContent += `<td><b class="hidden-row">${fieldLabel[index + 1]}</b>${formatter.format(dataStorage[i][value])}</td>`;
                            }
                            break;
                        }
                    default:
                        {
                            if (value.includes('price')) {
                                tableContent += `<td><b class="hidden-row">${fieldLabel[index + 1]}</b>${formatter.format(dataStorage[i][value])}</td>`;
                            } else {
                                tableContent += `<td><b class="hidden-row">${fieldLabel[index + 1]}</b>${dataStorage[i][value]}</td>`;
                            }
                        }
                }
            })

            tableContent += `
            <td><b class="hidden-row">Thao tác</b><div><a href="#" onclick="handleCopyInfo(${i}, ${tabId}, true)">Sửa</a> | 
            <a href="#" onclick="handleDeleteInfo(${i}, ${tabId})">Xóa</a> | 
            <a href="#" onclick="handleCopyInfo(${i}, ${tabId})">Sao chép</a>
            </div></td>
            </tr>`;
        }
        tableContent += `</tbody>`;
    } else {
        tableContent += `<tbody><tr><td colspan="10" style="color: blue;">Không tìm thấy dữ liệu.</td></tr></tbody>`;

    }
    return tableContent;
}

function handleDeleteInfo(id, tabId) {
    let tabElements = document.querySelectorAll('.form-action .tab .tab-wrapper .tab-content');
    for (let tabElement of tabElements) {
        if (tabElement.getAttribute('data-tab') == tabId) {
            var nameStorage = tabElement.querySelector('.form').getAttribute('nameStorage');
            break;
        }
    }
    let dataStorage = localStorage.getItem(nameStorage) ? JSON.parse(localStorage.getItem(nameStorage)) : [];
    dataStorage.splice(id, 1);
    localStorage.setItem(nameStorage, JSON.stringify(dataStorage));
    clearInputs();
    renderDataTable(tabId);
}

// Copy dữ liệu
function handleCopyInfo(id, tabId, changeBtn) {
    let tabElements = document.querySelectorAll('.form-action .tab .tab-wrapper .tab-content');
    for (let tabElement of tabElements) {
        if (tabElement.getAttribute('data-tab') == tabId) {
            var nameStorage = tabElement.querySelector('.form').getAttribute('nameStorage');
            var inputElements = tabElement.querySelectorAll('.form .form-input .form-group input[name]');
            break;
        }
    }

    let dataStorage = localStorage.getItem(nameStorage) ? JSON.parse(localStorage.getItem(nameStorage)) : [];
    inputElements.forEach((inputElement, index) => {
        if (inputElement.name.includes('price')) {
            inputElement.value = formatter.format(dataStorage[id][inputElement.name]);
        } else {
            inputElement.value = dataStorage[id][inputElement.name];
        }

    });

    if (changeBtn) {
        for (let tabElement of tabElements) {
            if (tabElement.getAttribute('data-tab') == tabId) {
                tabElement.querySelector('.form .btn-submit').outerHTML = `<button class="btn-update btn-customer" onclick="handleUpdateInfo(${id}, ${tabId});">Cập nhật</button>`;
                break;
            }
        }
    }

}

// Cập nhật
function handleUpdateInfo(id, tabId) {
    let tabElements = document.querySelectorAll('.form-action .tab .tab-wrapper .tab-content');
    let data = {};
    for (let tabElement of tabElements) {
        if (tabElement.getAttribute('data-tab') == tabId) {
            var nameStorage = tabElement.querySelector('.form').getAttribute('nameStorage');
            var inputElements = tabElement.querySelectorAll('.form .form-input .form-group input[name]');
            break;
        }
    }

    for (let inputElement of inputElements) {
        if (inputElement.name.includes('price')) {
            let inputValue = regex4.exec(inputElement.value)[0];
            inputValue = inputValue.replaceAll('.', '');
            data[inputElement.name] = inputValue;
        } else {
            data[inputElement.name] = inputElement.value;
        }

    }

    let dataStorage = localStorage.getItem(nameStorage) ? JSON.parse(localStorage.getItem(nameStorage)) : [];

    if (dataStorage.length > 0) {
        dataStorage[id] = data;
        localStorage.setItem(nameStorage, JSON.stringify(dataStorage));
        clearInputs();
        renderDataTable(tabId);
    }
}
// Tính tổng tiền khi giá, số lượng, chiết khấu thay đổi
var selectProduct = document.querySelector('.form-action .form-order .form-input #product');
var inputAmount = document.querySelector('.form-action .form-order .form-input #amount');
var inputDiscount = document.querySelector('.form-action .form-order .form-input #discount');
var inputTotal = document.querySelector('.form-action .form-order .form-input #total');

function getPrice(value) {
    let price = regex5.exec(value)[0].replaceAll('.', '');
    price = price.replace(' ₫', '');
    return price;
}

selectProduct.onchange = function(e) {
    calculateTotal(e);
}

inputAmount.addEventListener('input', function(e) {
    calculateTotal(e);
})
inputDiscount.addEventListener('input', function(e) {
    calculateTotal(e);
})


function calculateTotal(e) {
    let price = selectProduct.value != '' ? getPrice(selectProduct.value) : '';
    let amount = inputAmount.value;
    let discount = inputDiscount.value;

    if (price && amount > 0 && discount) {
        if (discount <= 100) {
            inputTotal.value = formatter.format((price * amount) - (price * amount * discount) / 100);
        } else {
            if (regex2.test(discount)) {
                discount = regex4.exec(discount)[0].replaceAll('.', '');
            }

            inputDiscount.addEventListener('blur', function() {
                discount = inputDiscount.value;
                inputTotal.value = formatter.format((price * amount) - getPrice(discount));
            })
            inputTotal.value = formatter.format((price * amount) - discount);
        }
    }


}

// Xóa dữ liệu trong input
function clearInputs() {
    let inputs = document.querySelectorAll('.form-action .form input[name]');


    inputs.forEach((input) => {
        switch (input.name) {
            case 'dateCreated':
                {
                    input.valueAsDate = new Date();
                    break;
                }
            case 'amount':
                {
                    input.value = '1';
                    break;
                }
            case 'discount':
                {
                    input.value = '0';
                    break;
                }
            case 'total':
                {
                    input.value = '0';
                    break;
                }
            default:
                {
                    input.value = '';
                }
        }
    })
    searchInput.value = '';
}

// Chọn tất cả trong input khi click vào
let inputs = document.querySelectorAll('.form-action .form input[name]');

inputs.forEach((input) => {
    if (input.name != 'dateCreated') {
        input.addEventListener('click', (event) => {
            var copyText = event.target;
            copyText.select();
        })
    }
})

//// Chuyển đổi định dạng trong input
let allInputs = document.querySelectorAll('.form-action .form input[name]');

// Input điện thoại
let phoneInputs = [];
for (let input of allInputs) {
    if (input.name.includes('phone')) {
        phoneInputs.push(input);
    }
}

for (let input of phoneInputs) {
    input.addEventListener('input', (event) => {
        if (!(event.data * 1) && event.data != '0') {
            event.target.value = event.target.value.toString().slice(0, -1);
        }

        let regexPhone = /^\(?([0-9]{4})\)?([0-9]{3})([0-9]{3})$/;
        if (regexPhone.test(event.target.value)) {
            event.target.value = '0' + parseInt(event.target.value).toLocaleString();
        }
    })
}

// Input tiền tệ
const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
})

let priceInputs = []
allInputs.forEach((input, index) => {
    if (input.name.includes('price')) {
        priceInputs.push(input);
    }
})

for (let input of priceInputs) {
    input.addEventListener('blur', (event) => {
        if (event.target.value * 1) {
            event.target.value = formatter.format(event.target.value);
        } else if (regex3.test(event.target.value.trim())) {
            let price = regex3.exec(event.target.value.trim())[0].replaceAll('.', '');
            event.target.value = formatter.format(price);
        }
    });
    input.addEventListener('input', (event) => {
        if (!(event.data * 1) && event.data != '0') {
            event.target.value = event.target.value.toString().slice(0, -1);
        }
    })
}

// Input chiết khấu
inputDiscount.addEventListener('input', (event) => {
    if (event.target.value <= 100) {
        inputDiscount.parentElement.querySelector('label').innerText = 'Chiết khấu (%)';
    } else if (event.target.value > 100) {
        inputDiscount.parentElement.querySelector('label').innerText = 'Chiết khấu (₫)';
    }
});

inputDiscount.addEventListener('blur', (event) => {
    if (event.target.value > 100 || regex1.test(event.target.value.trim()) || regex3.test(event.target.value.trim())) {
        let price = regex3.exec(event.target.value.trim())[0].replaceAll('.', '');
        if (price > 100) {
            event.target.value = formatter.format(price);
        }
    }
});

// 
document.getElementById('icon-reset').onclick = function() {
    renderDataTable();
    hiddenInputDate();
}