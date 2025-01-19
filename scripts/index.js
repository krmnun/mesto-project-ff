//Карточка
const placesList = document.querySelector('.places__list');

//Функция создания карточки
function createCard(cardData, deleteCardCallback) {
    //получаем шаблон карточки из html
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    // Находим элементы внутри карточки: изображение и заголовок
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');

    // Заполняем карточку данными из объекта cardData
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    // Находим кнопку удаления карточки
    const deleteButton = cardElement.querySelector('.card__delete-button');
    // Добавляем обработчик события на кнопку удаления
    deleteButton.addEventListener('click', () => deleteCardCallback(cardElement));

    return cardElement;
}

// Функция удаления карточки
function deleteCard(cardElement) {
    cardElement.remove();
}

// Функция отрисовки всех карточек
function renderCards(cards) {
    cards.forEach((cardData) => {
        const cardElement = createCard(cardData, deleteCard);
        placesList.append(cardElement);
    });
}

// Отрисовываем начальные карточки из массива initialCards
renderCards(initialCards);

// Получаем элементы попапа добавления карточки
const newCardPopup = document.querySelector('.popup_type_new-card');
const newCardForm = newCardPopup.querySelector('.popup__form');
const newCardButton = document.querySelector('.profile__add-button');

// Получаем элементы формы добавления карточки
const placeNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput = newCardForm.querySelector('.popup__input_type_url');

// Функция открытия попапа
function openPopup(popup) {
    popup.classList.add('popup_opened');
}

// Функция закрытия попапа
function closePopup(popup) {
    popup.classList.remove('popup_opened');
}

// Обработчик открытия попапа добавления карточки
newCardButton.addEventListener('click', () => {
    openPopup(newCardPopup);
    });

// Обработчик закрытия попапа
newCardPopup.querySelector('.popup__close').addEventListener('click', () => {
    closePopup(newCardPopup);
});

// Обработчик отправки формы добавления карточки
newCardForm.addEventListener('submit', (event) => {
    // Отменяем стандартное поведение формы (перезагрузку страницы)
    event.preventDefault();

    // Создаем объект с данными новой карточки
    const newCardData = {
        name: placeNameInput.value,
        link: placeLinkInput.value,
    };

    // Создаем новую карточку с помощью функции createCard
    const newCardElement = createCard(newCardData,deleteCard);
    placesList.prepend(newCardElement);

    // Закрываем попап после добавления карточки
    closePopup(newCardPopup);

    // Очищаем поля формы
    newCardForm.reset();
})

console.log('WErytewr!');