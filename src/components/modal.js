export function openModal(modal) {
    if (!modal) {
        console.error('Модальное окно не найдено');
        return;
    }
    modal.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscClose);
}

export function closeModal(modal) {
    if (!modal) {
        console.error('Модальное окно не найдено');
        return;
    }
    modal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscClose);
}

export function closeByOverlay(event) {
    if (event.target === event.currentTarget) {
        closeModal(event.target);
    }
}

function handleEscClose(event) {
    if (event.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}