import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const logs = await prisma.crawlerLog.findMany({
      orderBy: { runAt: 'desc' },
      take: 20
    });
    
    return Response.json({ logs });
  } catch (error) {
    console.error('Failed to fetch crawler logs:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
