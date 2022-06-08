export const domain = window.location.hostname;

const heroku = 'https://vessels-be-assignment.herokuapp.com';
const local = 'http://localhost:8080';

export const endpoints = {
    baseURL: domain.includes('heroku') ? heroku : local,
    signIn: '/authenticate',
    users: '/users/',
    profile: '/profile',
    files: '/files'
};

