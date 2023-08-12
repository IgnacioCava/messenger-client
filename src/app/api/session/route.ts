import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
	try {
		const session = await getServerSession(authOptions)
		const { id, name, email } = await prisma.user.findUniqueOrThrow({ where: { id: session?.user.id } })

		return NextResponse.json({
			session,
			user: {
				id,
				name,
				email
			}
		})
	} catch (error) {
		return NextResponse.json({
			error
		})
	}
}
