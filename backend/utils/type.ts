export type JWTPayloadType = {
    sub: string,
    email: string,
    role: string,
    national_id: string,
    is_password_set: boolean
}

export type AccessTokenType = {
    accessToken: string
}