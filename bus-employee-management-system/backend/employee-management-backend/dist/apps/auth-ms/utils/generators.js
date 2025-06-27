"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPassword = generateRandomPassword;
exports.generateEmployeeId = generateEmployeeId;
function generateRandomPassword(length = 12) {
    if (length < 8 || length > 20) {
        throw new Error('Password length must be between 8 and 20 characters');
    }
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+[]{}|;:,.<>?';
    const charset = lowercase + uppercase + numbers + special;
    let password = [
        lowercase[Math.floor(Math.random() * lowercase.length)],
        uppercase[Math.floor(Math.random() * uppercase.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        special[Math.floor(Math.random() * special.length)],
    ].join('');
    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    password = password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
    return password;
}
function generateEmployeeId() {
    const prefix = 'EMP';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}${randomNum}`;
}
//# sourceMappingURL=generators.js.map