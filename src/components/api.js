const configApi = {
    baseUrl: "https://mesto.nomoreparties.co/v1/wff-cohort-33",
    headers: {
        authorization: "5e79e09f-80b3-41bd-b7a0-19cddbb67ce1",
        "Content-Type": "application/json",
    },
};

function getResponse(res) {
    if (res.ok) {
        return res.json();
    }
    // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка: ${res.status}`);
}

// Загрузка информации о пользователе с сервера
export const getInitialUser = () => {
    return fetch(`${configApi.baseUrl}/users/me`, {
        method: "GET",
        headers: configApi.headers,
    }).then(getResponse);
};

//Загрузка карточек с сервера
export const getCardList = () => {
    return fetch(`${configApi.baseUrl}/cards`, {
        method: "GET",
        headers: configApi.headers,
    }).then(getResponse);
};

//Редактирование профиля
export const editUserProfile = (userUpdateInfo) => {
    return fetch(`${configApi.baseUrl}/users/me`, {
        method: "PATCH",
        headers: configApi.headers,
        body: JSON.stringify({
            name: userUpdateInfo.name,
            about: userUpdateInfo.about,
        }),
    }).then(getResponse);
};

//Добавление новой карточки
export const addNewCard = (newCardObj) => {
    return fetch(`${configApi.baseUrl}/cards`, {
        method: "POST",
        headers: configApi.headers,
        body: JSON.stringify({
            name: newCardObj.name,
            link: newCardObj.link,
        }),
    }).then(getResponse);
};

//удаление карточки с сервера
export const deleteCardApi = (cardId) => {
    return fetch(`${configApi.baseUrl}/cards/${cardId}`, {
        method: "DELETE",
        headers: configApi.headers,
    }).then(getResponse);
};

//постановка лайка карточки
export const likedCardApi = (cardId) => {
    return fetch(`${configApi.baseUrl}/cards/likes/${cardId}`, {
        method: "PUT",
        headers: configApi.headers,
    }).then(getResponse);
};

//удаление лайка карточки
export const dislikedCardApi = (cardId) => {
    return fetch(`${configApi.baseUrl}/cards/likes/${cardId}`, {
        method: "DELETE",
        headers: configApi.headers,
    }).then(getResponse);
};

//обновление аватара
export const editUserAvatarApi = (avatarUser) => {
    return fetch(`${configApi.baseUrl}/users/me/avatar`, {
        method: "PATCH",
        headers: configApi.headers,
        body: JSON.stringify({
            avatar: avatarUser,
        }),
    }).then(getResponse);
};