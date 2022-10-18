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

export const shuffleArray = (array: any[]): any[] => {
    const shuffledArray = [...array];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }
    return shuffledArray;
};

export const reduceFrequencyDomainByHalf = (frequencyData: Uint8Array) => {
    const reducedFrequencyData = new Uint8Array(Math.floor(frequencyData.length / 2));

    for (let i = 0; i < frequencyData.length; i += 2) {
        const reducedIndex = Math.floor(i / 2);
        reducedFrequencyData[reducedIndex] = Math.floor((frequencyData[i] + frequencyData[i + 1]) / 2);
    }

    return reducedFrequencyData;
};

export const getRandomElementFromArray = (array: any[]): any => array[Math.floor(Math.random() * array.length)];

export const trimFrequencyDomainEnd = (frequencyData: Uint8Array) => {
    return frequencyData.slice(0, Math.ceil(frequencyData.length * 0.625));
};

export const setCodeVerifier = (codeVerifier: string): void => localStorage.setItem('codeVerifier', codeVerifier);
export const getCodeVerifier = (): string | null => localStorage.getItem('codeVerifier');

export const setRefreshTokenInStorage = (refreshToken: string): void =>
    localStorage.setItem('refreshToken', refreshToken);
export const getRefreshTokenFromStorage = (): string | null => localStorage.getItem('refreshToken');
