import i18next from "i18next";
import {initReactI18next} from "react-i18next";

const resources = {
    ru: {
        translation: {
            'Public Blog App': 'Паблик Блог Эпп',
            'Log out': 'Выйти',
            'Log in': 'Войти',
            'Post': 'Отправить',
            'Create new post:': 'Создать новый пост:',
            'Title': 'Заголовок',
            'Write your text here': 'Напишите свой текст здесь',
            'select image': 'выберете изображение',
            'discard image': 'убрать изображение',
            'Check new posts!': 'Проверьте свежие посты!',
            'Welcome there': 'Добро пожаловать сюда',
            'What\'s up': 'Хелоу',
            'Hi': 'Салам',
            'Welcome dear':'Уэлкам дорогуша',
            'For you w/ love':'Для тебя с любовью',
            'Welcome back':'Еще раз уэлкам',
            'My pleasure to see you here': 'Мне приятно видеть тебя здесь',
            'Recent posts:': 'Недавние:',
            'Password': 'Пароль',
            'Do not have account yet?': 'Еще не зарегистрированы?',
            'Sign up': 'Зарегистрироваться',
            'First name': 'Имя',
            'Last name': 'Фамилия',
            'Register': 'Регистрация',
            'Enter': 'Войти в аккаунт',
            'You registered, in order to log in, please press this button': 'Вы зарегистрировались, чтобы войти нажмите эту кнопку',
            'email should be in format example@mail.com': 'почта должна быть в формате example@example.com',
            'password should be at least 8 characters': 'пароль должен содержать минимум 8 символов',
            'first name should be filled': 'имя должно быть заполнено',
            'last name should be filled': 'фамилия должна быть заполнена',
            'show comments ': 'показать комментарии ',
            'No comments added yet...': 'Нет комментариев...',
            'Write your comment here...': 'Напишите комментарий здесь...',
            'edited': 'изменено',
            'No more posts...': 'Посты закончились(',
            'Reply to': 'Ответить',
            'Go to top': 'Наверх',
            'reply': 'ответить',
            'Reply cannot be empty!': 'Ответ не может быть пустым!',
            'Replied': 'Отправлено',
            'Comment cannot be empty!': 'Комментарий не может быть пустой!',
            'Commented!': 'Комментарий отправлен',
            'Edited': 'Изменено',
            'Cannot be empty!': 'Не может быть пустым',
            'Post deleted': 'Пост удален',
            'Disliked': 'Дизлайк',
            'Liked!': 'Понравилось!',
            'you': 'вы',
            'Edit': 'Редактировать',
            'Delete': 'Удалить',
            'Your recent posts:': 'Ваши недавние:',
            'Your recent liked posts:': 'Недавно понравилось вам:',
            'edit': 'изменить',
            'Description': 'Описание',
            'show your liked posts': 'показать что понравилось вам',
            'select photo': 'выбрать фото',
            'save image': 'сохранить изображение',
            'Posted!': 'Пост!',
            '\'s posts:': ' недавние:',
            'Liked by': 'Понравилось',
            'show liked posts by ': 'показать то что понравилось ',
            'Write here something about you...': 'Напишите о себе...',
            'show less': 'свернуть',
            'show more': 'показать ещё',
            'Title and text cannot be empty!': 'Заголовок и текст не может быть пустым!'
        }
    }
}

i18next.
    use(initReactI18next).
    init({
    resources, lng: localStorage.getItem('lang'), interpolation: {
        escapeValue: false
    }
})

export default i18next