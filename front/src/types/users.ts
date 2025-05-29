export interface TGFrom {
    id: number,
    is_bot?: boolean,
    first_name?: string,
    last_name?: string,
    username?: string,
    language_code?: string,
    is_premium?: boolean,
    is_admin: boolean,
    register: boolean
}