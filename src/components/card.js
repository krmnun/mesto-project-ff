export function createCard(cardData, handleLikeClick, handleImageClick, handleDeleteClick) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const likeButton = cardElement.querySelector('.card__like-button');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    cardImage.addEventListener('click', () => handleImageClick(cardData));
    likeButton.addEventListener('click', () => handleLikeClick(likeButton));

    // Обработчик удаления карточки
    deleteButton.addEventListener('click', () => handleDeleteClick(cardElement));

    return cardElement;
}

export function handleLikeClick(likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
}


