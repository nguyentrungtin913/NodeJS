import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function store(token: string, userId: any, refereshToken: string, tokenCreateAt: string, tokenExpiredAt: string) {
    const result = await prisma.gd_token.create({
        data: {
          access_token: token,
          user_id: parseInt(userId),
          referesh_token: refereshToken,
          token_create_at: tokenCreateAt,
          token_expired_at: tokenExpiredAt
        },
      })
    return result
}
