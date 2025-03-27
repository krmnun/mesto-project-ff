// Показать ошибку
function showInputError(formElement, inputElement, errorMessage, config) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    if (!errorElement) {
        console.error(`Элемент ошибки с id ${inputElement.id}-error не найден`);
        return;
    }
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
    console.log(`Показываю ошибку для ${inputElement.id}: ${errorMessage}`);
}

// Скрыть ошибку
function hideInputError(formElement, inputElement, config) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    if (!errorElement) {
        console.error(`Элемент ошибки с id ${inputElement.id}-error не найден`);
        return;
    }
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
    console.log(`Скрываю ошибку для ${inputElement.id}`);
}

// Проверка валидности поля
function checkInputValidity(formElement, inputElement, config) {
    const isValid = inputElement.validity.valid;
    console.log(`Проверка валидации поля ${inputElement.id}:`, { isValid, value: inputElement.value });
    if (!isValid) {
        const errorMessage = inputElement.dataset.errorMessage || inputElement.validationMessage;
        showInputError(formElement, inputElement, errorMessage, config);
    } else {
        hideInputError(formElement, inputElement, config);
    }
}

// Проверка состояния кнопки
function toggleButtonState(inputList, buttonElement, config) {
    const hasInvalidInput = inputList.some((inputElement) => !inputElement.validity.valid);
    console.log('Проверка состояния кнопки:', { hasInvalidInput, class: buttonElement.classList });
    if (hasInvalidInput) {
        buttonElement.classList.add(config.inactiveButtonClass);
        buttonElement.disabled = true;
    } else {
        buttonElement.classList.remove(config.inactiveButtonClass);
        buttonElement.disabled = false;
    }
}

// Установка обработчиков валидации
function setEventListeners(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(formElement, inputElement, config);
            toggleButtonState(inputList, buttonElement, config);
        });
    });

    toggleButtonState(inputList, buttonElement, config);
}

// Включение валидации
export function enableValidation(config, formElement) {
    const forms = formElement ? [formElement] : document.querySelectorAll(config.formSelector);
    forms.forEach((form) => {
        form.addEventListener('submit', (evt) => evt.preventDefault());
        setEventListeners(form, config);
    });
}

// Очистка валидации
export function clearValidation(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, config);
    });

    toggleButtonState(inputList, buttonElement, config);
}