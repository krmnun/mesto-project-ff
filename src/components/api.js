const cohortId = 'wff-cohort-33';
const token = '5e79e09f-80b3-41bd-b7a0-19cddbb67ce1';

const baseUrl = `https://nomoreparties.co/v1/${cohortId}`;

const handleResponse = (res) => {
    if (res.ok) return res.json();
    return Promise.reject(`Ошибка: ${res.status}`);
};

export const getUserInfo = () => {
    return fetch(`${baseUrl}/users/me`, {
        method: 'GET',
        headers: {
            authorization: token,
            'Content-Type': 'application/json'
        }
    }).then(handleResponse);
};

export const getInitialCards = () => {
    return fetch(`${baseUrl}/cards`, {
        method: 'GET',
        headers: {
            authorization: token,
            'Content-Type': 'application/json'
        }
    }).then(handleResponse);
};

export const updateUserInfo = (name, about) => {
    return fetch(`${baseUrl}/users/me`, {
        method: 'PATCH',
        headers: {
            authorization: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, about })
    }).then(handleResponse);
};

export const createCard = (cardData) => {
    return fetch(`${baseUrl}/cards`, {
        method: 'POST',
        headers: {
            authorization: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
    }).then(handleResponse);
};

export const deleteCard = (cardId) => {
    return fetch(`${baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
            authorization: token,
            'Content-Type': 'application/json'
        }
    }).then(handleResponse);
};

export const updateAvatar = (avatarUrl) => {
    return fetch(`${baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: {
            authorization: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ avatar: avatarUrl })
    }).then(handleResponse);
};

export const likeCard = (cardId) => {
    return fetch(`${baseUrl}/cards/${cardId}/likes`, {
        method: 'PUT',
        headers: {
            authorization: token,
            'Content-Type': 'application/json'
        }
    }).then(handleResponse);
};

export const unlikeCard = (cardId) => {
    return fetch(`${baseUrl}/cards/${cardId}/likes`, {
        method: 'DELETE',
        headers: {
            authorization: token,
            'Content-Type': 'application/json'
        }
    }).then(handleResponse);
};