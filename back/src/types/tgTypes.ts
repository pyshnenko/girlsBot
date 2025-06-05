export interface TGFrom {
    id: number,
    is_bot?: boolean,
    first_name?: string,
    last_name?: string,
    username?: string,
    language_code?: string,
    is_premium?: boolean
}

export type FullTGForm = TGFrom & {
    admin: 1|0,
    register: 1|0,
    name: string,
    Id: number
}

export interface TGCheck {
    register: boolean,
    admin: boolean
}

export interface DataForUserSearch {
    id?: number,
    register?: boolean,
    admin?: boolean,
    dataFields?: string
}

export enum daypart {morning, day, evening, night}