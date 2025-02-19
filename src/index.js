import './pages/index.css';
import { initialCards } from './scripts/cards.js';
import { createCard, handleLikeClick } from './components/card.js';
import { openModal, closeModal, closeByOverlay } from './components/modal.js';

const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const editProfilePopup = document.querySelector('.popup_type_edit');

const newCardForm = newCardPopup.querySelector('.popup__form');
const newCardButton = document.querySelector('.profile__add-button');

const editProfileForm = editProfilePopup.querySelector('.popup__form');
const editProfileButton = document.querySelector('.profile__edit-button');

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const placesList = document.querySelector('.places__list');

// Функция открытия попапа с изображением
function openImagePopup(cardData) {
    const imageElement = imagePopup.querySelector('.popup__image');
    const captionElement = imagePopup.querySelector('.popup__caption');

    imageElement.src = cardData.link;
    imageElement.alt = cardData.name;
    captionElement.textContent = cardData.name;

    openModal(imagePopup);
}

// Функция отрисовки карточек
function renderCards(cards) {
    cards.forEach((cardData) => {
        const cardElement = createCard(cardData, handleLikeClick, openImagePopup, handleDeleteClick);
        placesList.append(cardElement);
    });
}

// Функция обработки удаления карточки
function handleDeleteClick(cardData, cardElement) {
    cardElement.remove();
}

// Обработчик отправки формы добавления карточки
newCardButton.addEventListener('click', () => openModal(newCardPopup));

newCardForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const placeNameValue = newCardForm.querySelector('.popup__input_type_card-name').value;
    const placeLinkValue = newCardForm.querySelector('.popup__input_type_url').value;

    const newCard = createCard({ name: placeNameValue, link: placeLinkValue }, handleLikeClick, openImagePopup, handleDeleteClick);

    placesList.prepend(newCard);

    closeModal(newCardPopup);
    newCardForm.reset();
});

// Функция редактирования профиля
editProfileButton.addEventListener('click', () => {
    const nameInput = editProfileForm.querySelector('.popup__input_type_name');
    const jobInput = editProfileForm.querySelector('.popup__input_type_description');

    nameInput.value = profileName.textContent;
    jobInput.value = profileDescription.textContent;
    openModal(editProfilePopup);
});

editProfileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameValue = editProfileForm.querySelector('.popup__input_type_name').value;
    const descriptionValue = editProfileForm.querySelector('.popup__input_type_description').value;

    profileName.textContent = nameValue;
    profileDescription.textContent = descriptionValue;

    closeModal(editProfilePopup);
});

// Рендерим начальные карточки при загрузке страницы
renderCards(initialCards);

// Добавляем обработчики закрытия на все попапы
const modals = document.querySelectorAll('.popup');
modals.forEach((modal) => {
    modal.addEventListener('mousedown', closeByOverlay);
});

