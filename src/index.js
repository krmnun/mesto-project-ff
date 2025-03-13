import './pages/index.css';
import { initialCards } from './scripts/cards.js';
import { createCard, handleLikeClick } from './components/card.js';
import { openModal, closeModal, closeByOverlay } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { getInitialCards, createCard as APICreateCard, deleteCard as APIDeleteCard, getUserInfo, updateUserInfo, updateAvatar } from './components/api.js';

// Утилиты для работы с DOM
const getElement = (selector, parent) => (parent || document).querySelector(selector);
const setImageData = (element, src, alt) => {
    if (element) {
        element.src = src;
        element.alt = alt;
    }
};
const setTextContent = (element, text) => {
    if (element) element.textContent = text;
};
const appendCard = (cardElement, container) => {
    if (cardElement && container) container.append(cardElement);
};

// Утилита для работы с попапами
const setupPopupContent = (popup, selectors, data) => {
    const imageElement = getElement(selectors.image, popup);
    const captionElement = getElement(selectors.caption, popup);
    setImageData(imageElement, data.link, data.name);
    setTextContent(captionElement, data.name);
    openModal(popup);
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM полностью загружен, начинаю инициализацию');

    const imagePopup = getElement('.popup_type_image');
    const editProfilePopup = getElement('.popup_type_edit');
    const editProfileForm = editProfilePopup ? getElement('.popup__form', editProfilePopup) : null;
    const editProfileButton = getElement('.profile__edit-button');

    const profileName = getElement('.profile__title');
    const profileDescription = getElement('.profile__description');
    const profileImage = getElement('.profile__image');

    const placesList = getElement('.places__list');

    const profileImageForm = getElement('form[name="edit-avatar"]');
    const profileImageInput = profileImageForm ? profileImageForm.querySelector('input[name="avatar"]') : null;
    const popupProfileImage = getElement('.popup_type_edit-avatar');

    const newCardButton = getElement('.profile__add-button');
    const newCardPopup = getElement('.popup_type_new-card');
    const newCardForm = newCardPopup ? getElement('.popup__form', newCardPopup) : null;

    const validationConfig = {
        formSelector: '.popup__form',
        inputSelector: '.popup__input',
        submitButtonSelector: '.popup__button',
        inactiveButtonClass: 'popup__button_disabled',
        inputErrorClass: 'popup__input_type_error',
        errorClass: 'popup__error_visible'
    };

    // Проверки на наличие элементов
    if (!newCardButton) {
        console.error('Кнопка с классом "profile__add-button" не найдена');
    }
    if (!newCardForm) {
        console.error('Форма с классом "popup__form" в попапе "popup_type_new-card" не найдена');
    }
    if (!newCardPopup) {
        console.error('Popup с классом "popup_type_new-card" не найден');
    }
    if (!placesList) {
        console.error('Список мест с классом "places__list" не найден');
    }
    if (!profileImageForm) {
        console.error('Форма с именем "edit-avatar" не найдена');
    }
    if (!profileImageInput) {
        console.error('Поле ввода "avatar" в форме "edit-avatar" не найдено');
    }
    if (!popupProfileImage) {
        console.error('Попап с классом "popup_type_edit-avatar" не найден');
    }
    if (!editProfilePopup) {
        console.error('Попап с классом "popup_type_edit" не найден');
    }
    if (!editProfileButton) {
        console.error('Кнопка с классом "profile__edit-button" не найдена');
    }
    if (!editProfileForm) {
        console.error('Форма с классом "popup__form" в попапе "popup_type_edit" не найдена');
    }
    if (!profileName) {
        console.error('Элемент с классом "profile__title" не найден');
    }
    if (!profileDescription) {
        console.error('Элемент с классом "profile__description" не найден');
    }
    if (!profileImage) {
        console.error('Элемент с классом "profile__image" не найден');
    }

    console.log('Все элементы найдены:', {
        editProfileButton,
        editProfileForm,
        profileName,
        profileDescription,
        profileImage
    });

    // Функции
    function openImagePopup(cardData) {
        const popupSelectors = { image: '.popup__image', caption: '.popup__caption' };
        setupPopupContent(imagePopup, popupSelectors, cardData);
    }

    function renderCards(cards, userId) {
        if (!cards || !Array.isArray(cards)) {
            console.error('Данные карточек некорректны:', cards);
            return;
        }
        cards.forEach((cardData) => {
            if (!cardData) {
                console.warn('Пропущена карточка с некорректными данными:', cardData);
                return;
            }
            const cardElement = createCard(cardData, handleLikeClick, openImagePopup, handleDeleteClick, userId);
            if (cardElement) {
                appendCard(cardElement, placesList);
            } else {
                console.warn('Не удалось создать карточку:', cardData);
            }
        });
    }

    function handleDeleteClick(cardElement) {
        const cardId = cardElement.dataset.cardId;
        if (cardId) {
            APIDeleteCard(cardId)
                .then(() => cardElement.remove())
                .catch((error) => console.error('Ошибка удаления карточки:', error));
        } else {
            cardElement.remove();
        }
    }

    function handleOpenPopup(popup, form, values = {}) {
        if (!popup || !form) {
            console.error('Попап или форма не найдены:', { popup, form });
            return;
        }
        form.reset();
        clearValidation(form, validationConfig);
        Object.keys(values).forEach((key) => {
            const input = form.querySelector(`.popup__input_type_${key}`);
            if (input) input.value = values[key];
        });
        openModal(popup);
    }

    function handleFormSubmit(options) {
        return (event) => {
            event.preventDefault();
            console.log('Форма отправлена:', options.form); // Отладка
            const formData = {};
            Array.from(options.form.querySelectorAll('.popup__input')).forEach((input) => {
                formData[input.name] = input.value;
            });
            console.log('Данные формы:', formData); // Отладка

            const submitButton = options.form.querySelector(validationConfig.submitButtonSelector);
            if (!submitButton) {
                console.error('Кнопка отправки формы не найдена:', validationConfig.submitButtonSelector);
                return;
            }
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Сохранение...';

            options.apiCall(formData)
                .then((data) => {
                    console.log('Успешный ответ от API:', data); // Отладка
                    options.updateDOM(data);
                    closeModal(options.popup);
                })
                .catch((error) => console.error('Ошибка:', error))
                .finally(() => {
                    submitButton.textContent = originalButtonText;
                });
        };
    }

    function setupFormHandlers(options) {
        console.log('Добавляю обработчики для формы:', options.form); // Отладка
        options.openButton.addEventListener('click', () => {
            console.log('Открываю попап:', options.popup); // Отладка
            handleOpenPopup(options.popup, options.form, options.initialValues || {});
        });
        if (options.form) {
            options.form.addEventListener('submit', handleFormSubmit({
                form: options.form,
                popup: options.popup,
                apiCall: options.apiCall,
                updateDOM: options.updateDOM
            }));
            console.log('Обработчик submit добавлен для формы:', options.form); // Отладка
        } else {
            console.error('Форма не найдена для обработчика:', options);
        }
    }

    // Добавление обработчика для кнопок закрытия попапов
    function setupClosePopupButtons() {
        document.querySelectorAll('.popup__close').forEach((closeButton) => {
            const popup = closeButton.closest('.popup');
            if (!popup) {
                console.error('Попап не найден для кнопки закрытия:', closeButton);
                return;
            }
            closeButton.addEventListener('click', () => {
                console.log('Закрываю попап через кнопку закрытия:', popup); // Отладка
                closeModal(popup);

                // Очищаем форму, если она есть
                const form = popup.querySelector('.popup__form');
                if (form) {
                    form.reset();
                    clearValidation(form, validationConfig);
                }
            });
        });
    }

    // Настройка обработчиков форм
    if (newCardButton && newCardForm && newCardPopup) {
        setupFormHandlers({
            openButton: newCardButton,
            form: newCardForm,
            popup: newCardPopup,
            apiCall: (formData) => APICreateCard({ name: formData['place-name'], link: formData['link'] }),
            updateDOM: (cardData) => {
                const newCard = createCard(cardData, handleLikeClick, openImagePopup, handleDeleteClick, userId);
                if (newCard) {
                    placesList.prepend(newCard);
                }
                if (newCardForm) newCardForm.reset();
            }
        });
    }

    if (editProfileButton && editProfileForm && editProfilePopup) {
        setupFormHandlers({
            openButton: editProfileButton,
            form: editProfileForm,
            popup: editProfilePopup,
            apiCall: (formData) => updateUserInfo(formData['name'], formData['description']),
            updateDOM: (data) => {
                setTextContent(profileName, data.name || profileName.textContent);
                setTextContent(profileDescription, data.about || profileDescription.textContent);
            },
            initialValues: {
                name: profileName.textContent,
                description: profileDescription.textContent
            }
        });
    }

    if (profileImage && profileImageForm && popupProfileImage) {
        setupFormHandlers({
            openButton: profileImage,
            form: profileImageForm,
            popup: popupProfileImage,
            apiCall: (formData) => updateAvatar(formData['avatar']),
            updateDOM: (data) => {
                const avatarUrl = data.avatar || profileImage.style.backgroundImage.match(/url\("(.+)"\)/)?.[1] || '';
                profileImage.style.backgroundImage = `url(${avatarUrl})`;
            }
        });
    }

    // Инициализация данных
    let userId = null;
    Promise.all([getUserInfo(), getInitialCards()])
        /**
         * @typedef {Object} UserData
         * @property {string} _id - Идентификатор пользователя
         * @property {string} name - Имя пользователя
         * @property {string} about - Описание пользователя
         * @property {string} avatar - URL аватара
         */
        .then(([/** @type {UserData} */ userData, cardsData]) => {
            console.log('Данные пользователя:', userData); // Отладка
            console.log('Данные карточек:', cardsData); // Отладка
            userId = userData._id || 'default_user_id';
            setTextContent(profileName, userData.name || 'Имя пользователя');
            setTextContent(profileDescription, userData.about || 'Описание');
            profileImage.style.backgroundImage = `url(${userData.avatar || './images/avatar.jpg'})`;
            renderCards(cardsData, userId);
        })
        .catch((error) => {
            console.error('Ошибка загрузки данных:', error);
            renderCards(initialCards, 'ваш_id_пользователя');
            setTextContent(profileName, 'Имя пользователя');
            setTextContent(profileDescription, 'Описание');
            profileImage.style.backgroundImage = `url('./images/avatar.jpg')`;
        });

    // Закрытие попапов по клику на оверлей
    const modals = document.querySelectorAll('.popup');
    modals.forEach((modal) => modal.addEventListener('mousedown', closeByOverlay));

    // Установка обработчиков для кнопок закрытия
    setupClosePopupButtons();

    // Инициализация валидации
    enableValidation(validationConfig);
});