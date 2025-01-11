import {v4} from "uuid";

const sizeof = require('object-sizeof');
const fs = require('fs');
const sanitizeUUID = (uuid) => uuid.replace(/-/g, '');

const generateUniquePassword = (length) => {
    let uuid = '';
    while (uuid.length < length) {
        uuid += sanitizeUUID(v4()).substring(0, length - uuid.length);
    }
    return uuid;
};

export const generatePasswords = (length, amount) => {
    const passwords = new Set();
    while (passwords.size < amount) {
        passwords.add(generateUniquePassword(length));
    }
    return Array.from(passwords);
};
export const generateSetPasswords = (length, amount) => {
    const passwords = new Set();
    while (passwords.size < amount) {
        passwords.add(generateUniquePassword(length));
    }
    return passwords;
};


export const generateHashPasswords = (length, amount) => {
    const passwords = new Map();
    let i = 0;
    while (passwords.size < amount) {
        let uq = generateUniquePassword(length);
        passwords.set(i, uq);
        i++;
    }

    return passwords;
};

export const evaluateCallback = (callback, callbackParams) => {
    const {length, amount} = callbackParams;
    const start = new Date().getTime();
    callback(length, amount);
    const end = new Date().getTime();
    return end - start;
}