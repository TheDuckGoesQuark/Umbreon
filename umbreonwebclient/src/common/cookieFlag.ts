export enum FlagKey {
    DARK_MODE= 'dm',
}

export const setCookieFlag = (flagKey: FlagKey, value: boolean) => {
    localStorage.setItem(flagKey, value.toString());
}

export const getCookieFlag = (flagKey: FlagKey, defaultValue: any) => {
    return localStorage.getItem(flagKey) || defaultValue;
}
