import CryptoJS from 'crypto-js';

export const generateRandomStringInRangeInclusive = (min: number, max: number): string => {
    const validCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-~';
    const length = Math.floor(Math.random() * (max - min + 1) + min);

    return Array(length)
        .fill(0)
        .map(() => validCharacters.charAt(Math.floor(Math.random() * validCharacters.length)))
        .join('');
};

export const generateCodeChallenge = (codeVerifier: string): string => {
    const hash = CryptoJS.SHA256(codeVerifier);
    return hash.toString(CryptoJS.enc.Base64url);
};

export const createUrl = (path: string, parameters: any): string => {
    const url = new URL(path);
    const searchParameters = new URLSearchParams(parameters);
    url.search = searchParameters.toString();
    return url.toString();
};

const snakeCaseToCamelCaseKey = (key: string) => {
    const capitalizedKey = key
        .split('_')
        .map((words) => words.charAt(0).toUpperCase() + words.slice(1))
        .join('');

    return capitalizedKey.charAt(0).toLowerCase() + capitalizedKey.slice(1);
};

export const snakeCaseToCamelCaseObject = (snakeCaseObject: any): any => {
    if (Array.isArray(snakeCaseObject)) {
        return snakeCaseObject.map((element) => snakeCaseToCamelCaseObject(element));
    }

    if (snakeCaseObject !== null && typeof snakeCaseObject === 'object') {
        return Object.entries(snakeCaseObject).reduce(
            (camelCasedObject, [key, value]) => ({
                ...camelCasedObject,
                [snakeCaseToCamelCaseKey(key)]: snakeCaseToCamelCaseObject(value),
            }),
            {}
        );
    }

    return snakeCaseObject;
};

export const setCodeVerifier = (codeVerifier: string): void => localStorage.setItem('codeVerifier', codeVerifier);
export const getCodeVerifier = (): string | null => localStorage.getItem('codeVerifier');

export const setRefreshToken = (refreshToken: string): void => localStorage.setItem('refreshToken', refreshToken);
export const getRefreshToken = (): string | null => localStorage.getItem('refreshToken');
