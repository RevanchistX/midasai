import {v4} from "uuid";


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