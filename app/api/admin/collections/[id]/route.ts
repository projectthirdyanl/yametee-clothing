import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const sanitizeArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.map((item) => String(item)).filter((item) => item.trim().length > 0)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      title,
      slug,
      subtitle,
      description,
      status = 'DRAFT',
      heroImage,
      lookbookImages = [],
      launchDate,
      story,
      products = [],
      releaseWindows = [],
    } = body

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 })
    }

    const existing = await prisma.collection.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    if (slug !== existing.slug) {
      const slugConflict = await prisma.collection.findUnique({ where: { slug } })
      if (slugConflict) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        title,
        slug,
        subtitle: subtitle || null,
        description: description || null,
        status,
        heroImage: heroImage || null,
        lookbookImages: sanitizeArray(lookbookImages),
        launchDate: launchDate ? new Date(launchDate) : null,
        story: story || null,
        products: {
          deleteMany: { collectionId: id },
          create: Array.isArray(products)
            ? products
                .filter((item: any) => item?.productId)
                .map((item: any, index: number) => ({
                  productId: item.productId,
                  displayOrder: Number.isFinite(item.displayOrder) ? item.displayOrder : index,
                  featured: Boolean(item.featured),
                }))
            : [],
        },
        releaseWindows: {
          deleteMany: { collectionId: id },
          create: Array.isArray(releaseWindows)
            ? releaseWindows
                .filter((window: any) => window?.startsAt)
                .map((window: any) => ({
                  startsAt: new Date(window.startsAt),
                  endsAt: window.endsAt ? new Date(window.endsAt) : null,
                  status: window.status || 'DRAFT',
                  allowlistOnly: Boolean(window.allowlistOnly),
                  password: window.password || null,
                  notes: window.notes || null,
                  maxUnits:
                    typeof window.maxUnits === 'number'
                      ? window.maxUnits
                      : window.maxUnits
                      ? Number(window.maxUnits)
                      : null,
                }))
            : [],
        },
      },
    })

    return NextResponse.json({ collection })
  } catch (error: any) {
    console.error('Update collection error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update collection' },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.collection.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete collection error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete collection' },
      { status: 500 },
    )
  }
}
