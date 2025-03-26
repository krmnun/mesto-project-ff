export function enableValidation(options, formElement = null) {
    const forms = formElement
        ? [formElement]
        : Array.from(document.querySelectorAll(options.formSelector));
    console.log('Найдено форм для валидации:', forms.length, forms);

    forms.forEach((form) => {
        if (form.dataset.validationInitialized) {
            console.log('Валидация для формы уже инициализирована:', form);
            return;
        }
        form.dataset.validationInitialized = 'true';

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            console.log('Форма отправлена через validation.js:', form);
        });

        const inputs = Array.from(form.querySelectorAll(options.inputSelector));
        const submitButton = form.querySelector(options.submitButtonSelector);
        console.log('Найдено полей ввода:', inputs.length, inputs);

        inputs.forEach((input) => {
            input.removeEventListener('input', input._validationHandler);
            input._validationHandler = () => {
                checkInputValidity(form, input, options.inputErrorClass, options.errorClass);
                toggleButtonState(inputs, submitButton, options.inactiveButtonClass);
            };
            input.addEventListener('input', input._validationHandler);
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
    console.log(`Проверка валидности для поля ${input.id}:`, { validity: input.validity });
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

export function showInputError(form, input, errorMessage, inputErrorClass, errorClass) {
    const errorElement = form.querySelector(`#${input.id}-error`);
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add(errorClass); // errorClass = 'popup__input__error_visible'
        input.classList.add(inputErrorClass);
        console.log(`Добавлен класс ${errorClass} для элемента ошибки ${input.id}`);
    } else {
        console.error(`Элемент ошибки не найден для input с id ${input.id}`);
    }
}

export function hideInputError(form, input, inputErrorClass, errorClass) {
    const errorElement = form.querySelector(`#${input.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove(errorClass); // errorClass = 'popup__input__error_visible'
        input.classList.remove(inputErrorClass);
    }
}

function toggleButtonState(inputList, submitButton, inactiveButtonClass) {
    if (!submitButton) {
        console.error('Кнопка сабмита не найдена. InputList:', inputList);
        return;
    }
    const hasInvalidInput = inputList.some((input) => {
        const isValid = input.validity.valid;
        console.log(`Проверка валидности поля ${input.id}:`, { isValid, value: input.value });
        return !isValid;
    });
    console.log('Проверка состояния кнопки:', { hasInvalidInput, submitButton });
    if (hasInvalidInput) {
        submitButton.classList.add(inactiveButtonClass);
        submitButton.disabled = true;
        console.log('Кнопка отключена, класс добавлен:', inactiveButtonClass);
    } else {
        submitButton.classList.remove(inactiveButtonClass);
        submitButton.disabled = false;
        console.log('Кнопка включена, класс убран:', inactiveButtonClass);
    }
}