import "./pages/index.css";
import { createCard, deleteCard, likedCard } from "./components/card.js";
import { openPopup, closePopup, listenerPopupOverlay, keydownListener, smoothAnimationPopup,} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { getInitialUser, getCardList, editUserProfile, addNewCard, deleteCardApi, editUserAvatarApi,} from "./components/api.js";

const validationConfig = {
    formSelector: ".popup__form",
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
};

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

// кнопки
const buttonEditProfile = document.querySelector(".profile__edit-button");
const buttonAddPlace = document.querySelector(".profile__add-button");
const buttonClosePopupList = document.querySelectorAll(".popup__close");
// - расположение выводимых карточек
const placeList = document.querySelector(".places__list");
//объявление модальных окон
const popupList = document.querySelectorAll(".popup");
const popupProfile = document.querySelector(".popup_type_edit");
const popupPlaceAdd = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const popupAvatarEdit = document.querySelector(".popup_type_avatar");
//переменные к ф-ии handleSubmitEditProfile
const formEditProfileElement = document.forms["edit-profile"];
const nameInput = formEditProfileElement.elements.name;
const jobInput = formEditProfileElement.elements.description;
const nameProfile = document.querySelector(".profile__title");
const descProfile = document.querySelector(".profile__description");
//переменные к ф-ии handleCardSubmit
const formCard = document.forms["new-place"];
const namePlaceInput = formCard.elements["place-name"];
const linkPlaceInput = formCard.elements.link;
//переменные к функции editProfileDataDefault
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileNamePopupDefault = document.forms["edit-profile"].elements.name;
const profileDescriptionPopupDefault =
    document.forms["edit-profile"].elements.description;
//аватар
const avatarUser = document.querySelector(".profile__image");
const formAvatarEdit = document.forms["new-avatar"];
const linkAvatarInput = formAvatarEdit.elements["link-avatar"];
//кнопки модальных окон
const buttonSubmitProfile = popupProfile.querySelector(".popup__button");
const buttonSubmitCard = popupPlaceAdd.querySelector(".popup__button");
const buttonSubmitAvatar = popupAvatarEdit.querySelector(".popup__button");

let userId = null;

//для загрузки данных пользователя и карточек
Promise.all([getInitialUser(), getCardList()])
    .then(([data, cardData]) => {
        //получение данных пользователя
        profileName.textContent = data.name;
        profileDescription.textContent = data.about;
        avatarUser.style.backgroundImage = `url(${data.avatar})`;
        userId = data["_id"];
        //вывод карточек с сервера
        cardData.forEach(function (cardItem) {
            //вывод списка карточек
            placeList.append(
                createCard(cardItem, deleteCardItem, openPopupImage, likedCard, userId)
            );
        });
    })
    .catch((err) => {
        console.error("Ошибка добавления карточки:", err);
    });

//УДАЛЕНИЕ КАРТОЧКИ
function deleteCardItem(cardUser, cardId) {
    deleteCardApi(cardId)
        .then(() => {
            deleteCard(cardUser);
        })
        .catch((err) => {
            console.error("Ошибка удаления карточки:", err);
        });
}


function editProfileDataDefault() {
    //очищаем ошибки валидации перед открытием
    clearValidation(popupProfile, validationConfig);
    profileNamePopupDefault.value = profileName.textContent;
    profileDescriptionPopupDefault.value = profileDescription.textContent;
}

//изменение текста кнопки при загрузке
function renderLoading({ button, loading }) {
    if (loading) {
        button.textContent = "Сохранение...";
    } else {
        button.textContent = "Сохранить";
    }
}

function handleSubmitEditProfile(evt) {
    evt.preventDefault();

    renderLoading({
        button: buttonSubmitProfile,
        loading: true,
    });

    //создаем объект с новыми данными пользователя
    const dataUserProfile = {
        name: nameInput.value,
        about: jobInput.value,
    };
    //отправляем данные на сервер
    editUserProfile(dataUserProfile)
        .then((userData) => {
            nameProfile.textContent = userData.name;
            descProfile.textContent = userData.about;
            avatarUser.style.backgroundImage = `url(${userData.avatar})`;
            closePopup(popupProfile);
        })
        .catch((err) => {
            console.error("Ошибка обновления информации профиля:", err);
        })
        .finally(() => {
            renderLoading({
                button: buttonSubmitProfile,
                loading: false,
            });
        });
}

//TODO: Дайте пользователю возможность добавлять карточки
function handleCardSubmit(evt) {
    evt.preventDefault();

    renderLoading({
        button: buttonSubmitCard,
        loading: true,
    });

    const placeName = namePlaceInput.value;
    const placeAlt = placeName;
    const placeLink = linkPlaceInput.value;
    //получаем данные (имя, описание и ссылку) новой карточки
    const newPlaceCard = { name: placeName, alt: placeAlt, link: placeLink };
    //добавление карточки
    addNewCard(newPlaceCard)
        .then((newPlaceCard) => {
            //выводим первой новую карточку
            placeList.prepend(
                createCard(
                    newPlaceCard,
                    deleteCardItem,
                    openPopupImage,
                    likedCard,
                    userId
                )
            );
            //закрываем модалку
            closePopup(popupPlaceAdd);
        })
        .catch((err) => {
            console.error("Ошибка добавления карточки:", err);
        })
        .finally(() => {
            renderLoading({
                button: buttonSubmitCard,
                loading: false,
            });
        });
}

//Открытие попапа с картинкой
function openPopupImage(imageLink, imageAlt) {
    popupImage.querySelector(".popup__image").src = imageLink;
    popupImage.querySelector(".popup__image").alt = imageAlt;
    popupImage.querySelector(".popup__caption").textContent = imageAlt;
    openPopup(popupImage);
}

//вызов функции добавляющей класс для плавного открытия и закрытия попапов
popupList.forEach((popup) => {
    smoothAnimationPopup(popup);
});

//открытие модального окна редактирования профиля по клику на кнопку
buttonEditProfile.addEventListener("click", () => {
    //попап редактирования профила
    openPopup(popupProfile);
    //выводим по умолчанию имя и занятие из профиля
    editProfileDataDefault();
});
//открытие модального окна добавления карточки по клику на кнопку
buttonAddPlace.addEventListener("click", () => {
    //попап добавления карточки
    clearValidation(formCard, validationConfig);
    openPopup(popupPlaceAdd);
    formCard.reset();
});

//закрытие модального окна по клику на крестик
buttonClosePopupList.forEach((buttonClose) => {
    buttonClose.addEventListener("click", () => {
        const popupParentContainer = buttonClose.closest(".popup");
        closePopup(popupParentContainer);
    });
});

//слушатель клика по оверлэю для каждого модального окна
popupProfile.addEventListener("click", listenerPopupOverlay);
popupPlaceAdd.addEventListener("click", listenerPopupOverlay);
popupImage.addEventListener("click", listenerPopupOverlay);
popupAvatarEdit.addEventListener("click", listenerPopupOverlay);

//слушатель отправки формы при редактировании профиля
formEditProfileElement.addEventListener("submit", handleSubmitEditProfile);
//слушатель отправки формы при добавлении новой карточки
formCard.addEventListener("submit", handleCardSubmit);

//слушатель отправки формы при изменении аватара
formAvatarEdit.addEventListener("submit", (evt) => {
    evt.preventDefault();

    renderLoading({
        button: buttonSubmitAvatar,
        loading: true,
    });

    editUserAvatarApi(linkAvatarInput.value)
        .then((res) => {
            avatarUser.style.backgroundImage = `url(${res.avatar})`;
            closePopup(popupAvatarEdit);
        })
        .catch((err) => {
            console.error("Ошибка изменения аватара:", err);
        })
        .finally(() => {
            renderLoading({
                button: buttonSubmitAvatar,
                loading: false,
            });
        });
});

avatarUser.addEventListener("click", () => {
    clearValidation(formAvatarEdit, validationConfig);
    openPopup(popupAvatarEdit);
    formAvatarEdit.reset();
});

// включение валидации вызовом enableValidation все настройки передаются при вызове
enableValidation(validationConfig);