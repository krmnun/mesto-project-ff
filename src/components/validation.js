export function enableValidation(options) {
    const forms = Array.from(document.querySelectorAll(options.formSelector));

    forms.forEach((form) => {
        form.addEventListener('submit', (evt) => {
            evt.preventDefault(); // Предотвращаем отправку формы для отладки
            console.log('Форма отправлена через validation.js:', form); // Отладка
        });

        const inputs = Array.from(form.querySelectorAll(options.inputSelector));
        const submitButton = form.querySelector(options.submitButtonSelector);

        inputs.forEach((input) => {
            input.addEventListener('input', () => {
                checkInputValidity(form, input, options.inputErrorClass, options.errorClass);
                toggleButtonState(inputs, submitButton, options.inactiveButtonClass);
            });
        });

        toggleButtonState(inputs, submitButton, options.inactiveButtonClass);
    });
}

export function clearValidation(form, options) {
    if (!form) {
        console.error('Форма не найдена для очистки валидации');
        return;
    }

    const inputs = Array.from(form.querySelectorAll(options.inputSelector));
    const submitButton = form.querySelector(options.submitButtonSelector);

    inputs.forEach((input) => {
        hideInputError(form, input, options.inputErrorClass, options.errorClass);
        input.setCustomValidity(''); // Сбрасываем кастомные ошибки
    });

    toggleButtonState(inputs, submitButton, options.inactiveButtonClass);
}

function checkInputValidity(form, input, inputErrorClass, errorClass) {
    if (input.validity.patternMismatch) {
        input.setCustomValidity(input.dataset.errorMessage || '');
    } else {
        input.setCustomValidity('');
    }

    if (!input.validity.valid) {
        showInputError(form, input, input.dataset.errorMessage || input.validationMessage, inputErrorClass, errorClass);
    } else {
        hideInputError(form, input, inputErrorClass, errorClass);
    }
}

function showInputError(form, input, errorMessage, inputErrorClass, errorClass) {
    const errorElement = form.querySelector(`.${input.id}-error`);
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add(errorClass);
        input.classList.add(inputErrorClass);
    }
}

function hideInputError(form, input, inputErrorClass, errorClass) {
    const errorElement = form.querySelector(`.${input.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove(errorClass);
        input.classList.remove(inputErrorClass);
    }
}

function toggleButtonState(inputList, submitButton, inactiveButtonClass) {
    if (!submitButton) return;
    const hasInvalidInput = inputList.some((input) => !input.validity.valid);
    if (hasInvalidInput) {
        submitButton.classList.add(inactiveButtonClass);
        submitButton.disabled = true;
    } else {
        submitButton.classList.remove(inactiveButtonClass);
        submitButton.disabled = false;
    }
}