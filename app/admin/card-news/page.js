import { PrismaClient } from '@prisma/client';
import { getSeoulWeather, getExchangeRates } from '@/lib/external-data';
import CardNewsPreview from './CardNewsPreview';

const prisma = new PrismaClient();

async function getData() {
    const topNews = await prisma.newsItem.findFirst({
        where: { isTopNews: true },
        orderBy: { publishedAt: 'desc' }
    }) || await prisma.newsItem.findFirst({ orderBy: { createdAt: 'desc' } });

    const cardNewsItems = await prisma.newsItem.findMany({
        where: { isCardNews: true },
        orderBy: { publishedAt: 'desc' },
        take: 4
    });

    const weather = await getSeoulWeather();
    const rates = await getExchangeRates();

    return { topNews, cardNewsItems, weather, rates };
}

export default async function CardNewsPreviewPage() {
    const data = await getData();
    return <CardNewsPreview data={data} />;
}
