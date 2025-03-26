import './pages/index.css';
import { initialCards } from './scripts/cards.js';
import { createCard, handleLikeClick } from './components/card.js';
import { openModal, closeModal, closeByOverlay } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { getInitialCards, createCard as APICreateCard, deleteCard as APIDeleteCard, getUserInfo, updateUserInfo, updateAvatar } from './components/api.js'; // eslint-disable-line no-unused-vars

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
    if (!newCardButton) console.error('Кнопка с классом "profile__add-button" не найдена');
    if (!newCardForm) console.error('Форма с классом "popup__form" в попапе "popup_type_new-card" не найдена');
    if (!newCardPopup) console.error('Popup с классом "popup_type_new-card" не найден');
    if (!placesList) console.error('Список мест с классом "places__list" не найден');
    if (!profileImageForm) console.error('Форма с именем "edit-avatar" не найдена');
    if (!profileImageInput) console.error('Поле ввода "avatar" в форме "edit-avatar" не найдено');
    if (!popupProfileImage) console.error('Попап с классом "popup_type_edit-avatar" не найден');
    if (!editProfilePopup) console.error('Попап с классом "popup_type_edit" не найден');
    if (!editProfileButton) console.error('Кнопка с классом "profile__edit-button" не найдена');
    if (!editProfileForm) console.error('Форма с классом "popup__form" в попапе "popup_type_edit" не найдена');
    if (!profileName) console.error('Элемент с классом "profile__title" не найден');
    if (!profileDescription) console.error('Элемент с классом "profile__description" не найден');
    if (!profileImage) console.error('Элемент с классом "profile__image" не найден');

    console.log('Все элементы найдены:', { editProfileButton, editProfileForm, profileName, profileDescription, profileImage });

    // Удаляем все существующие обработчики submit и определяем newCardFormUpdated сразу после определения newCardForm
    if (newCardForm) {
        newCardForm.replaceWith(newCardForm.cloneNode(true));
        // Заново получаем форму после клонирования
        const newCardFormUpdated = newCardPopup.querySelector('.popup__form');

        // Обработчик открытия формы добавления карточки
        newCardButton.addEventListener('click', () => {
            newCardFormUpdated.reset();
            clearValidation(newCardFormUpdated, validationConfig);
            openModal(newCardPopup);
        });

        // Обработчик открытия формы добавления карточки
        newCardButton.addEventListener('click', () => {
            if (!newCardPopup) {
                console.error('Попап new-card не найден');
                return;
            }
            if (!newCardFormUpdated) {
                console.error('Форма new-card не найдена');
                return;
            }
            newCardFormUpdated.reset();
            clearValidation(newCardFormUpdated, validationConfig);
            openModal(newCardPopup);
            setTimeout(() => {
                enableValidation(validationConfig, newCardFormUpdated);
            }, 0);
        });


        // Обработчик отправки формы добавления карточки
        newCardFormUpdated.addEventListener('submit', (event) => {
            event.preventDefault();

            const nameInput = newCardFormUpdated.querySelector('input[name="name"]');
            const linkInput = newCardFormUpdated.querySelector('input[name="link"]');

            if (!nameInput || !linkInput) {
                console.error('Поля формы не найдены:', { nameInput, linkInput });
                console.log('HTML формы:', newCardFormUpdated.innerHTML);
                alert('Ошибка: Поля формы не найдены.');
                return;
            }

            const placeNameValue = nameInput.value;
            const placeLinkValue = linkInput.value;

            console.log('Данные перед вызовом APICreateCard:', { name: placeNameValue, link: placeLinkValue });

            const submitButton = newCardFormUpdated.querySelector('.popup__button');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Сохранение...';

            APICreateCard({ name: placeNameValue, link: placeLinkValue })
                .then((cardData) => {
                    const newCard = createCard(cardData, handleLikeClick, openImagePopup, handleDeleteClick, userId);
                    placesList.prepend(newCard);
                    closeModal(newCardPopup);
                    newCardFormUpdated.reset();
                    clearValidation(newCardFormUpdated, validationConfig);
                })
                .catch((error) => {
                    console.error('Ошибка при создании карточки:', error);
                    alert('Ошибка: Проверьте данные и попробуйте снова.');
                })
                .finally(() => {
                    submitButton.textContent = originalButtonText;
                });
        });
    } else {
        console.error('newCardForm не определена, обработчики для формы добавления карточки не установлены');
    }


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
            const formData = {};
            Array.from(options.form.querySelectorAll('.popup__input')).forEach((input) => {
                formData[input.name] = input.value.trim();
            });

            const submitButton = options.form.querySelector('.popup__button');
            if (!submitButton) {
                console.error('Кнопка отправки формы не найдена');
                return;
            }
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Сохранение...';

            options.apiCall(formData)
                .then((data) => {
                    if (options.updateDOM) options.updateDOM(data);
                    closeModal(options.popup);
                })
                .catch((error) => {
                    console.error('Ошибка:', error);
                    alert(`Ошибка: ${error.message || 'Проверьте данные и попробуйте снова.'}`);
                })
                .finally(() => {
                    submitButton.textContent = originalButtonText;
                });
        };
    }

    function setupFormHandlers(options) {
        console.log('Добавляю обработчики для формы:', options.form);
        options.openButton.addEventListener('click', () => {
            console.log('Открываю попап:', options.popup);
            handleOpenPopup(options.popup, options.form, options.initialValues || {});
        });
        if (options.form) {
            options.form.addEventListener('submit', handleFormSubmit({
                form: options.form,
                popup: options.popup,
                apiCall: options.apiCall,
                updateDOM: options.updateDOM
            }));
            console.log('Обработчик submit добавлен для формы:', options.form);
        } else {
            console.error('Форма не найдена для обработчика:', options);
        }
    }

    // Настройка формы редактирования профиля
    if (editProfileButton && editProfileForm && editProfilePopup) {
        setupFormHandlers({
            openButton: editProfileButton,
            form: editProfileForm,
            popup: editProfilePopup,
            apiCall: (formData) => {
                console.log('Вызов updateUserInfo с данными:', formData);
                return updateUserInfo(formData.name, formData.description);
            },
            updateDOM: (data) => {
                const newName = data.name || 'Имя пользователя';
                const newAbout = data.about || 'Описание';
                setTextContent(profileName, newName);
                setTextContent(profileDescription, newAbout);
                console.log('Профиль обновлён:', newName, newAbout);
                // Принудительная перерисовка
                profileName.style.display = 'none';
                profileName.offsetHeight;
                profileName.style.display = '';
                profileDescription.style.display = 'none';
                profileDescription.offsetHeight;
                profileDescription.style.display = '';
            },
            initialValues: {
                name: profileName.textContent,
                description: profileDescription.textContent,
            },
        });
    }

    // Настройка формы редактирования аватара
    if (profileImage && profileImageForm && popupProfileImage) {
        setupFormHandlers({
            openButton: profileImage,
            form: profileImageForm,
            popup: popupProfileImage,
            apiCall: (formData) => updateAvatar(formData.avatar),
            updateDOM: (data) => {
                const avatarUrl = data.avatar || profileImage.style.backgroundImage.match(/url\("(.+)"\)/)?.[1] || '';
                profileImage.style.backgroundImage = `url(${avatarUrl})`;
            }
        });
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
                console.log('Закрываю попап через кнопку закрытия:', popup);
                closeModal(popup);
            });
        });
    }

    // Инициализация данных
    let userId = null;
    Promise.all([getUserInfo(), getInitialCards()])
        .then(([userData, cardsData]) => {
            userId = userData._id || 'default_user_id';
            console.log('Получен userId:', userId);
            setTextContent(profileName, userData.name || 'Имя пользователя');
            setTextContent(profileDescription, userData.about || 'Описание');
            profileImage.style.backgroundImage = `url(${userData.avatar || './images/avatar.jpg'})`;
            renderCards(cardsData, userId);
        })
        .catch((error) => {
            console.error('Ошибка загрузки данных:', error);
            setTextContent(profileName, 'Имя пользователя');
            setTextContent(profileDescription, 'Описание');
            profileImage.style.backgroundImage = `url('./images/avatar.jpg')`;
            renderCards(initialCards, 'default_user_id');
        });

    // Закрытие попапов по клику на оверлей
    const modals = document.querySelectorAll('.popup');
    modals.forEach((modal) => modal.addEventListener('mousedown', closeByOverlay));

    // Установка обработчиков для кнопок закрытия
    setupClosePopupButtons();

    // Инициализация валидации
    enableValidation(validationConfig);
});