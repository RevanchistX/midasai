const {parentPort, workerData} = require('worker_threads');

const {v4} = require("uuid");

const sanitizeUUID = (uuid) => uuid.replace(/-/g, '');

const generateUniquePassword = (length) => {
    let uuid = '';
    while (uuid.length < length) {
        uuid += sanitizeUUID(v4()).substring(0, length - uuid.length);
    }
    return uuid;
};

const generatePasswords = (length, amount) => {
    const passwords = new Set();

    while (passwords.size < amount) {
        passwords.add(generateUniquePassword(length));
    }

    return Array.from(passwords);
};

const result = generatePasswords(workerData.length, workerData.amount);
parentPort.postMessage(result);