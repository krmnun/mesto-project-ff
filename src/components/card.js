import { likeCard, unlikeCard } from './api.js';

export function createCard(cardData, handleLikeClick, openImagePopup, handleDeleteClick, userId) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const likeButton = cardElement.querySelector('.card__like-button');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeCount = cardElement.querySelector('.card__like-count');

    // Проверки на наличие элементов
    if (!cardImage || !cardTitle || !likeButton || !deleteButton || !likeCount) {
        console.error('Не удалось найти один из элементов карточки:', {
            cardImage, cardTitle, likeButton, deleteButton, likeCount
        });
        return null;
    }

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
    likeCount.textContent = cardData.likes ? cardData.likes.length : 0;

    const isLiked = cardData.likes && cardData.likes.some(user => user._id === userId);
    if (isLiked) {
        likeButton.classList.add('card__like-button_is-active');
    }

    cardElement.dataset.cardId = cardData._id;

    if (cardData.owner && cardData.owner._id === userId) {
        deleteButton.style.display = 'block';
    } else {
        deleteButton.style.display = 'none';
    }

    cardImage.addEventListener('click', () => openImagePopup(cardData));
    likeButton.addEventListener('click', () => handleLikeClick(cardElement, likeButton, likeCount));
    deleteButton.addEventListener('click', () => handleDeleteClick(cardElement));

    return cardElement;
}

export function handleLikeClick(cardElement, likeButton, likeCount) {
    const cardId = cardElement.dataset.cardId;
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const apiCall = isLiked ? unlikeCard : likeCard;

    apiCall(cardId)
        .then((updatedCard) => {
            likeButton.classList.toggle('card__like-button_is-active');
            likeCount.textContent = updatedCard.likes.length;
        })
        .catch((error) => console.error('Ошибка при изменении лайка:', error));
}