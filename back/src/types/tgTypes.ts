export interface TGFrom {
    id: number,
    is_bot?: boolean,
    first_name?: string,
    last_name?: string,
    username?: string,
    language_code?: string,
    is_premium?: boolean,
    register: boolean
}

export interface TGCheck {
    register: boolean,
    is_admin: boolean
}

export interface DataForUserSearch {
    id?: number,
    register?: boolean,
    admin?: boolean,
    dataFields?: string
}

export enum daypart {morning, day, evening, night}