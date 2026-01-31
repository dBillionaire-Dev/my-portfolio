import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getSession } from '@/lib/auth';
import { updateBlogPostSchema } from '@shared/schema';
import { z } from 'zod';

// GET /api/blog/[idOrSlug] - Get blog post by ID or slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    
    // Check if it's a numeric ID or a slug
    const isNumeric = /^\d+$/.test(idOrSlug);
    let post;

    if (isNumeric) {
      post = await storage.getBlogPostById(Number(idOrSlug));
    } else {
      post = await storage.getBlogPostBySlug(idOrSlug);
    }
    
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Get blog post error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/blog/[idOrSlug] - Update blog post (admin only, by ID)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { idOrSlug } = await params;
    
    // Only allow numeric IDs for updates
    const isNumeric = /^\d+$/.test(idOrSlug);
    if (!isNumeric) {
      return NextResponse.json(
        { message: 'Invalid blog post ID' },
        { status: 400 }
      );
    }

    const id = Number(idOrSlug);
    const body = await request.json();
    const validatedData = updateBlogPostSchema.parse(body);
    
    const post = await storage.updateBlogPost(id, validatedData);
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Update blog post error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[idOrSlug] - Delete blog post (admin only, by ID)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { idOrSlug } = await params;
    
    // Only allow numeric IDs for deletes
    const isNumeric = /^\d+$/.test(idOrSlug);
    if (!isNumeric) {
      return NextResponse.json(
        { message: 'Invalid blog post ID' },
        { status: 400 }
      );
    }

    await storage.deleteBlogPost(Number(idOrSlug));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete blog post error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

