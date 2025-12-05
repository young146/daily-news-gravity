import { PrismaClient } from '@prisma/client';
import { getSeoulWeather, getExchangeRates } from '@/lib/external-data';
import CardNewsSimple from './CardNewsSimple';

const prisma = new PrismaClient();

async function getData() {
    const topNews = await prisma.newsItem.findFirst({
        where: { isTopNews: true },
        orderBy: { publishedAt: 'desc' }
    }) || await prisma.newsItem.findFirst({ orderBy: { createdAt: 'desc' } });

    const weather = await getSeoulWeather();
    const rates = await getExchangeRates();

    return { topNews, weather, rates };
}

export default async function CardNewsPreviewPage() {
    const data = await getData();
    return <CardNewsSimple data={data} />;
}
