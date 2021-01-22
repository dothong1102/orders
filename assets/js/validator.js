function Validator(formSelector) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    let formRules = {};

    /**
     * Quy ước tạo rule:
     * - Nếu có lỗi thì return `error message`
     * - Nếu không có lỗi return `undefined`
     */
    let validatorRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function(value) {
            let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : 'Trường này không hợp lệ';
        },
        phone: function(value) {
            let regex = /^\(?([0-9]{4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;
            return regex.test(value) ? undefined : 'Trường này không hợp lệ';
        },
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
            }

        },
        max: function(max) {
            return function(value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} ký tự`;
            }

        },
        money: function(value) {
            let regex = /^([0-9]*)([.]?[0-9]{3})*( ₫){1}$/;
            return regex.test(value) ? undefined : 'Trường này không hợp lệ';
        },
    };


    // Lấy ra form element trong DOM theo `formSelector`
    let formElement = document.querySelector(formSelector);

    if (formElement) {
        let inputs = formElement.querySelectorAll('[name][rules]');

        for (let input of inputs) {
            let rules = input.getAttribute('rules').split('|');
            for (let rule of rules) {
                let ruleFunction = validatorRules[rule];
                if (rule.includes(':')) {
                    let ruleInfo = rule.split(':');
                    ruleFunction = validatorRules[ruleInfo[0]](ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunction);
                } else {
                    formRules[input.name] = [ruleFunction];
                }
            }

            // Lắng nghe sự kiện để validate (blur, change, ...)
            input.onblur = handleValidate;
            input.oninput = handleClearError;

        }

        // Hàm thực hiện validate
        function handleValidate(event) {
            let rules = formRules[event.target.name];
            let errorMessage;
            for (let rule of rules) {
                errorMessage = rule(event.target.value);
                if (errorMessage) break;
            }

            // Nếu có lỗi thì hiển thị message lỗi ra UI
            if (errorMessage) {
                let formGroup = getParent(event.target, '.form-group');
                if (formGroup) {
                    formGroup.classList.add('invalid');
                    let formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerHTML = errorMessage;
                    }
                }
            }
            return !errorMessage;

        }

        // Hàm clear message lỗi
        function handleClearError(event) {
            let formGroup = getParent(event.target, '.form-group');
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
                let formMessage = formGroup.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerHTML = '';
                }
            }
        }

        // Xử lý hành vi submit form 
        formElement.querySelector('.btn-submit').onclick = function(event) {

            let inputs = formElement.querySelectorAll('[name][rules]');
            var isValid = true;

            for (let input of inputs) {
                if (!handleValidate({ target: input })) {
                    isValid = false;
                }
            }
            if (isValid) {
                let regexPrice = /^([0-9]*)([.]?[0-9]{3})*/;
                let enableInput = formElement.querySelectorAll('.form-input [name]');
                let formValues = Array.from(enableInput).reduce(function(values, input) {
                    if (input.name.includes('price')) {
                        let price = regexPrice.exec(input.value.trim())[0].replaceAll('.', '');
                        values[input.name] = price;

                    } else if (input.name.includes('phone')) {
                        values[input.name] = input.value.trim().replaceAll('.', '');
                    } else if (input.name.includes('discount')) {
                        if (input.value <= 100) {
                            values[input.name] = input.value.trim().replaceAll('.', '');
                        } else {
                            values[input.name] = regexPrice.exec(input.value.trim())[0].replaceAll('.', '');
                        }

                    } else {
                        values[input.name] = input.value.trim();
                    }

                    return values;
                }, {});

                if (formValues) {
                    let nameStorage = formElement.getAttribute('nameStorage');
                    let tabId = formElement.parentElement.getAttribute('data-tab');
                    handleSaveData(formValues, nameStorage, tabId);
                }

            }

        }
    }
}