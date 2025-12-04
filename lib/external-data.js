
/**
 * Fetches current weather for Seoul using Open-Meteo API (Free, No Key)
 */
export async function getSeoulWeather() {
    try {
        // Seoul coordinates: 37.5665, 126.9780
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current_weather=true', { next: { revalidate: 3600 } });
        const data = await res.json();

        if (!data.current_weather) return null;

        const { temperature, weathercode } = data.current_weather;

        // Simple weather code mapping
        let condition = 'Clear';
        if (weathercode > 0 && weathercode < 3) condition = 'Cloudy';
        if (weathercode >= 3 && weathercode < 50) condition = 'Overcast';
        if (weathercode >= 50 && weathercode < 80) condition = 'Rain';
        if (weathercode >= 80) condition = 'Rain/Snow';

        return {
            temp: temperature,
            condition: condition,
            code: weathercode
        };
    } catch (e) {
        console.error('Failed to fetch weather:', e);
        return { temp: 20, condition: 'Clear (Mock)', code: 0 }; // Fallback
    }
}

/**
 * Fetches exchange rates (USD->VND, KRW->VND)
 */
export async function getExchangeRates() {
    try {
        // Fetch base USD
        const resUsd = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 3600 } });
        const dataUsd = await resUsd.json();

        // Fetch base KRW
        const resKrw = await fetch('https://open.er-api.com/v6/latest/KRW', { next: { revalidate: 3600 } });
        const dataKrw = await resKrw.json();

        return {
            usdVnd: dataUsd.rates ? Math.round(dataUsd.rates.VND) : 24000,
            krwVnd: dataKrw.rates ? parseFloat(dataKrw.rates.VND.toFixed(2)) : 18.5,
            krwUsd: dataUsd.rates ? Math.round(dataUsd.rates.KRW) : 1300 // Optional: USD to KRW
        };
    } catch (e) {
        console.error('Failed to fetch rates:', e);
        return { usdVnd: 25450, krwVnd: 17.85, krwUsd: 1420 }; // Fallback
    }
}
