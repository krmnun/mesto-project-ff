export function enableValidation(options) {
    const forms = Array.from(document.querySelectorAll(options.formSelector));
    forms.forEach((form) => {
        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
        });
        setEventListeners({ form, ...options });
    });
}

// Остальной код остаётся без изменений
function setEventListeners({ form, inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass }) {
    const inputList = Array.from(form.querySelectorAll(inputSelector));
    const submitButton = form.querySelector(submitButtonSelector);
    toggleButtonState({ inputList, submitButton, inactiveButtonClass });
    inputList.forEach((input) => {
        input.addEventListener('input', () => {
            checkInputValidity({ form, input, inputErrorClass, errorClass });
            toggleButtonState({ inputList, submitButton, inactiveButtonClass });
        });
    });
}

function checkInputValidity({ form, input, inputErrorClass, errorClass }) {
    if (input.validity.patternMismatch) {
        input.setCustomValidity(input.dataset.errorMessage || input.validationMessage);
    } else {
        input.setCustomValidity('');
    }

    if (!input.validity.valid) {
        showInputError({ form, input, errorMessage: input.validationMessage, inputErrorClass, errorClass });
    } else {
        hideInputError({ form, input, inputErrorClass, errorClass });
    }
}

function showInputError({ form, input, errorMessage, inputErrorClass, errorClass }) {
    const errorElement = form.querySelector(`.${input.id}-error`);
    input.classList.add(inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(errorClass);
}

function hideInputError({ form, input, inputErrorClass, errorClass }) {
    const errorElement = form.querySelector(`.${input.id}-error`);
    input.classList.remove(inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(errorClass);
}

function toggleButtonState({ inputList, submitButton, inactiveButtonClass }) {
    if (hasInvalidInput(inputList)) {
        submitButton.classList.add(inactiveButtonClass);
        submitButton.disabled = true;
    } else {
        submitButton.classList.remove(inactiveButtonClass);
        submitButton.disabled = false;
    }
}

const hasInvalidInput = (inputList) =>
    inputList.some((input) => !input.validity.valid);

export function clearValidation(form, options) {
    const inputList = Array.from(form.querySelectorAll(options.inputSelector));
    const submitButton = form.querySelector(options.submitButtonSelector);
    inputList.forEach((input) => {
        hideInputError({ form, input, ...options });
    });
    toggleButtonState({ inputList, submitButton, ...options });
}