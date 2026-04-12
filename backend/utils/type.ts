export type JWTPayloadType = {
    sub: string,
    email: string,
    role: string,
    national_id: string
}

export type AccessTokenType = {
    accessToken: string
}