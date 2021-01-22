let formOrderElement = document.querySelector('.form-action .tab .tab-wrapper .form-order');

let inputName = formOrderElement.querySelector('#fullName');
let inputProduct = formOrderElement.querySelector('#product');

let idsWithCustomer = ['fullName', 'phone', 'address'];
let idsWithProduct = ['product'];

var orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
var products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
var customers = localStorage.getItem('customers') ? JSON.parse(localStorage.getItem('customers')) : [];


// Lấy dữ liệu sản phẩm truyền vào select box
function getProductsForSelectBox() {
    let contentProduct = `<option value="" >Chọn sản phẩm</option>`;
    if (products.length > 0) {
        products.forEach((value, index) => {
            contentProduct += `<option value="${value.product_name} x ${formatter.format(value.product_price)}" id-product="${index}">${value.product_name} x ${formatter.format(value.product_price)}</option>`;
        })
    }
    inputProduct.innerHTML = contentProduct;
}
getProductsForSelectBox();

// Gợi ý khi điền tên khách hàng
inputName.addEventListener('keyup', function(e) {
    handleDropdown(e, customers);
});

function handleDropdown(e, data) {
    let key = [];
    let valueInput = e.target.value.toLowerCase();
    let result = [];
    let dropdownElement = e.target.parentElement.querySelector('.dropdown-list');
    let contentDropdown = ``;

    if (valueInput) {
        if (data.length > 0) {
            for (let i in data[0]) {
                key.push(i);
            }

            result = getInfoWhenCheckAccess(valueInput, data, key[0], 5);

            if (result.length > 0) {
                result.forEach((value, index) => {
                    contentDropdown += `<li class="dropdown-item" data-id="${index}">
                            ${value[key[0]]}
                        </li>`;
                })
                dropdownElement.innerHTML = contentDropdown;
                dropdownElement.classList.add("show");


                let elementFormGroup = getParent(e.target, '.form-group');
                window.addEventListener('click', function(e) {
                    if (!elementFormGroup.contains(e.target)) {
                        dropdownElement.innerHTML = '';
                        dropdownElement.classList.remove("show");
                    }
                });

                // Xử lý khi chọn item
                let dropdownItems = dropdownElement.querySelectorAll('.dropdown-item');

                dropdownItems.forEach((value, index) => {
                    value.addEventListener('click', function(e) {
                        handleSelectItem(e.target, e.target.parentElement.getAttribute('data-name'), result);
                    });
                })


                function handleSelectItem(element, dataName, result) {
                    dropdownElement.innerHTML = '';
                    dropdownElement.classList.remove("show");
                    let inputs = [],
                        inputsOfOrder = formOrderElement.querySelectorAll('.form-input input[name]');
                    switch (dataName) {
                        case 'fullName':
                            {
                                idsWithCustomer.forEach((value, index) => {
                                    for (let input of inputsOfOrder) {
                                        if (input.id == value) {
                                            inputs.push(input);
                                            break;
                                        }
                                    }

                                })
                                break;
                            }
                    }

                    if (inputs) {
                        result = result[element.getAttribute('data-id')];
                        for (let index in result) {
                            for (let input of inputs) {

                                if (index.includes(input.id)) {
                                    if (index.includes('phone')) {
                                        input.value = '0' + parseInt(result[index]).toLocaleString();
                                        break;
                                    } else {
                                        input.value = result[index];
                                        break;
                                    }

                                }
                            }
                        }
                    }
                }
            } else {
                dropdownElement.innerHTML = '';
                dropdownElement.classList.remove("show");
            }
        }
    } else {
        dropdownElement.innerHTML = '';
        dropdownElement.classList.remove("show");
    }
}

function getInfoWhenCheckAccess(str, data, name, amount) {
    let result = [];
    if (checkAccents(str)) {
        for (let i = 0; i < data.length; i++) {
            if (data[i][name].toLowerCase().includes(str.toLowerCase())) {
                result[i] = data[i];
                if (amount) {
                    if (result.length >= amount) {
                        break;
                    }
                }

            }
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            if (removeAccents(data[i][name]).toLowerCase().includes(str.toLowerCase())) {
                result[i] = data[i];
                if (result.length >= amount) {
                    break;
                }
            }
        }
    }
    return result;
}

function getParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement;
        }
        element = element.parentElement;
    }
}

function checkAccents(str) {
    var AccentsMap = [
        "à|ả|ã|á|ạ|ă|ằ|ẳ|ẵ|ắ|ặ|â|ầ|ẩ|ẫ|ấ|ậ",
        "À|Ả|Ã|Á|Ạ|Ă|Ằ|Ẳ|Ẵ|Ắ|Ặ|Â|Ầ|Ẩ|Ẫ|Ấ|Ậ",
        "đ",
        "Đ",
        "è|ẻ|ẽ|é|ẹ|ê|ề|ể|ễ|ế|ệ",
        "È|Ẻ|Ẽ|É|Ẹ|Ê|Ề|Ể|Ễ|Ế|Ệ",
        "ì|ỉ|ĩ|í|ị",
        "Ì|Ỉ|Ĩ|Í|Ị",
        "ò|ỏ|õ|ó|ọ|ô|ồ|ổ|ỗ|ố|ộ|ơ|ờ|ở|ỡ|ớ|ợ",
        "Ò|Ỏ|Õ|Ó|Ọ|Ô|Ồ|Ổ|Ỗ|Ố|Ộ|Ơ|Ờ|Ở|Ỡ|Ớ|Ợ",
        "ù|ủ|ũ|ú|ụ|ư|ừ|ử|ữ|ứ|ự",
        "Ù|Ủ|Ũ|Ú|Ụ|Ư|Ừ|Ử|Ữ|Ứ|Ự",
        "ỳ|ỷ|ỹ|ý|ỵ",
        "Ỳ|Ỷ|Ỹ|Ý|Ỵ"
    ];


    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i] + ']', 'g');
        if (re.test(str)) {
            return true;
        }
    }
    return false;
}

function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}