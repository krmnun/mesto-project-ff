import { likeCard, unlikeCard } from './api.js';

export const createCard = (cardData, handleLikeClick, openImagePopup, handleDeleteClick, userId) => {
    console.log('Создание карточки:', { cardData, userId });
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCount = cardElement.querySelector('.card__like-count');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    if (!deleteButton) {
        console.error('Кнопка удаления не найдена в шаблоне карточки');
    }

    cardElement.dataset.cardId = cardData._id;
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
    likeCount.textContent = cardData.likes.length;

    console.log('Сравнение owner._id и userId:', cardData.owner._id, userId);
    // Временно убираем условие для теста
    // if (cardData.owner._id !== userId) {
    //     deleteButton.style.display = 'none';
    // } else {
    //     deleteButton.style.display = 'block';
    // }

    deleteButton.addEventListener('click', () => handleDeleteClick(cardElement));

    if (cardData.likes.some((like) => like._id === userId)) {
        likeButton.classList.add('card__like-button_active');
    }
    likeButton.addEventListener('click', () => handleLikeClick(cardData._id, likeButton, likeCount));

    cardImage.addEventListener('click', () => openImagePopup(cardData));

    return cardElement;
};

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