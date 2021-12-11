"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPassword = void 0;
const assert_1 = __importDefault(require("assert"));
/**
 * Asserts that `password` is a string that matches `confirmPassword`.
 * Will throw an Error otherwise.
 * @param password - Password to assert.
 * @param confirmPassword - Confirmation of password to match.
 */
function assertPassword(password, confirmPassword) {
    assert_1.default(typeof password === 'string' && password.length > 0, 'Please enter a password.');
    assert_1.default(typeof confirmPassword === 'string' && confirmPassword.length > 0, 'Please confirm your password.');
    assert_1.default(password === confirmPassword, 'Your password and confirmation did not match.');
}
exports.assertPassword = assertPassword;
//# sourceMappingURL=EmailPasswordUtil.js.map