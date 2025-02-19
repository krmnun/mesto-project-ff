export function openModal(modal) {
    modal.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeByEsc);
}

export function closeModal(modal) {
    modal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeByEsc);
}

export function closeByOverlay(evt) {
    if (evt.target === evt.currentTarget) {
        closeModal(evt.target);
    }
}

function closeByEsc(evt) {
    if (evt.key === 'Escape') {
        const openedModal = document.querySelector('.popup_is-opened');
        if (openedModal) closeModal(openedModal);
    }
}
