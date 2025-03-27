export function openModal(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscClose);
}

export function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}

// Добавляем функцию closeByOverlay
export function closeByOverlay(evt) {
    if (evt.target.classList.contains('popup_is-opened')) {
        closeModal(evt.target);
    }
}