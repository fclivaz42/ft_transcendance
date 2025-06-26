import { i18nHandler } from "../../handlers/i18nHandler";
import { CustomPasswordInputContainer } from './createPasswordInput';
import {checkPasswordStrength } from '../input/createPasswordInput.js';

export const validateDisplayName = (value: string) => {
    let isValid = true;
    let errorMessage: string | null = null;
    if (value === '') {
        isValid = false;
        errorMessage = i18nHandler.getValue("panel.registerPanel.validation.usernameRequired");
    } else if (value.length < 3 || value.length > 14) {
        isValid = false;
        errorMessage = i18nHandler.getValue("panel.registerPanel.validation.lenghtError");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        isValid = false;
        errorMessage = i18nHandler.getValue("panel.registerPanel.validation.charactersError");
    }
    return { isValid, errorMessage };
};

export const validateEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid = true;
    let errorMessage: string | null = null;
    if (value === '') {
        isValid = false;
        errorMessage = i18nHandler.getValue("panel.registerPanel.validation.emailRequired");
    } else if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = i18nHandler.getValue("panel.registerPanel.validation.emailFormatError");
    }
    return { isValid, errorMessage };
};


export const validatePassword = (value: string) => {
    if (value === '') {
        return { isValid: false, errorMessage: null };
    } 
    const strength = checkPasswordStrength(value);

    const isValid = strength.minLength &&
                    strength.hasUppercase &&
                    strength.hasLowercase &&
                    strength.hasNumber &&
                    strength.hasSpecialChar;

    return { isValid, errorMessage: null };
};

export const validateConfirmPassword = (value: string, passwordValue: string) => {
    let isValid = true;
    let errorMessage: string | null = null;

    if (value.length === 0) {
        isValid = false;
        errorMessage = i18nHandler.getValue("panel.registerPanel.validation.confirmPasswordRequired");
    } else if (passwordValue.length === 0) {
        isValid = false;
        errorMessage = i18nHandler.getValue("panel.registerPanel.validation.passwordRequired");
    } else {
        const len = Math.min(value.length, passwordValue.length);

        for (let i = 0; i < len; i++) {
            if (value[i] !== passwordValue[i]) {
                isValid = false;
                errorMessage = i18nHandler.getValue("panel.registerPanel.validation.passwordMismatch");
                break;
            }
        }

        if (isValid && value.length < passwordValue.length) {
            isValid = false;
            errorMessage = null;
        } else if (isValid && value.length > passwordValue.length) {
            isValid = false;
            errorMessage = i18nHandler.getValue("panel.registerPanel.validation.passwordMismatch");
        } else if (isValid && value.length === passwordValue.length) {
            isValid = true;
            errorMessage = null;
        }
    }
    return { isValid, errorMessage };
};