import { NextRequest, NextResponse } from 'next/server';
import { getComments, addComment } from '@/lib/db';
import type { CreateCommentRequest } from '@/types';

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20', 10);

  if (!symbol) {
    return NextResponse.json({ error: '请提供股票代码' }, { status: 400 });
  }

  try {
    const result = getComments(symbol, page, limit);
    return NextResponse.json({
      comments: result.comments,
      total: result.total,
      page,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json({ comments: [], total: 0, error: '获取留言失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCommentRequest = await request.json();

    if (!body.symbol || !body.content) {
      return NextResponse.json({ error: '请提供股票代码和留言内容' }, { status: 400 });
    }

    if (body.content.trim().length < 2) {
      return NextResponse.json({ error: '留言内容至少需要2个字符' }, { status: 400 });
    }

    if (body.content.length > 1000) {
      return NextResponse.json({ error: '留言内容不能超过1000个字符' }, { status: 400 });
    }

    const comment = addComment({
      symbol: body.symbol,
      authorName: body.authorName?.trim(),
      content: body.content.trim(),
      parentId: body.parentId,
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: '发表留言失败' }, { status: 500 });
  }
}
