import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { stockQuantity } = body

    if (stockQuantity === undefined || stockQuantity < 0) {
      return NextResponse.json(
        { error: 'Invalid stock quantity' },
        { status: 400 }
      )
    }

    const variant = await prisma.variant.update({
      where: { id: params.id },
      data: {
        stockQuantity: parseInt(stockQuantity),
      },
    })

    return NextResponse.json(variant)
  } catch (error) {
    console.error('Error updating variant:', error)
    return NextResponse.json(
      { error: 'Failed to update variant' },
      { status: 500 }
    )
  }
}
