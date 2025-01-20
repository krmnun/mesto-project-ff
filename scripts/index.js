// Получаем контейнер для списка карточек
const placesList = document.querySelector('.places__list');

// Получаем элементы попапов
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Получаем элементы формы добавления карточки
const newCardForm = newCardPopup.querySelector('.popup__form');
const newCardButton = document.querySelector('.profile__add-button');
const closeNewCardPopupButton = newCardPopup.querySelector('.popup__close');
const closeImagePopupButton = imagePopup.querySelector('.popup__close');

// Функция открытия попапа
function openPopup(popup) {
    popup.classList.add('popup_is-opened'); // Используем popup_is-opened
}

// Функция закрытия попапа
function closePopup(popup) {
    popup.classList.remove('popup_is-opened'); // Используем popup_is-opened
}

// Обработчик для кнопки добавления новой карточки
newCardButton.addEventListener('click', () => {
    openPopup(newCardPopup);
});

// Обработчик закрытия попапа добавления карточки
closeNewCardPopupButton.addEventListener('click', () => {
    closePopup(newCardPopup);
});

// Обработчик закрытия попапа изображения
closeImagePopupButton.addEventListener('click', () => {
    closePopup(imagePopup);
});

// Функция создания карточки
function createCard(cardData, deleteCardCallback) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    // Заполняем карточку данными
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    // Обработчик открытия попапа с изображением при клике на карточку
    cardImage.addEventListener('click', () => {
        openImagePopup(cardData);
    });

    // Обработчик удаления карточки
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => {
        deleteCardCallback(cardElement);
    });

    return cardElement;
}

// Функция открытия попапа с изображением
function openImagePopup(cardData) {
    const imageElement = imagePopup.querySelector('.popup__image');
    const captionElement = imagePopup.querySelector('.popup__caption');
    imageElement.src = cardData.link;
    imageElement.alt = cardData.name;
    captionElement.textContent = cardData.name;
    openPopup(imagePopup);
}

// Функция удаления карточки
function deleteCard(cardElement) {
    cardElement.remove();
}

// Обработчик отправки формы добавления карточки
newCardForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Получаем данные из формы
    const placeName = newCardForm.querySelector('.popup__input_type_card-name').value;
    const placeLink = newCardForm.querySelector('.popup__input_type_url').value;

    // Создаем новую карточку
    const newCard = createCard({ name: placeName, link: placeLink }, deleteCard);
    placesList.prepend(newCard);

    // Закрываем попап и очищаем форму
    closePopup(newCardPopup);
    newCardForm.reset();
});

// Функция отрисовки всех карточек
function renderCards(cards) {
    cards.forEach((cardData) => {
        const cardElement = createCard(cardData, deleteCard);
        placesList.append(cardElement);
    });
}

// Отрисовываем начальные карточки из массива initialCards
renderCards(initialCards);
