import { NextRequest, NextResponse } from 'next/server';
import { deleteComment, commentExists } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = parseInt(id, 10);

  if (isNaN(commentId)) {
    return NextResponse.json({ error: '无效的留言ID' }, { status: 400 });
  }

  try {
    if (!commentExists(commentId)) {
      return NextResponse.json({ error: '留言不存在' }, { status: 404 });
    }

    deleteComment(commentId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ error: '删除留言失败' }, { status: 500 });
  }
}
