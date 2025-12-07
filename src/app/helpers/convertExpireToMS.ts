

export const convertExpireToMS = (value: string): number => {
    if (!value || typeof value !== "string") return 0;

    const unit = value.slice(-1);
    const amount = parseInt(value.slice(0, -1));

    if (isNaN(amount)) return 0;

    const oneSecond = 1000;
    const oneMinute = oneSecond * 60;
    const oneHour = oneMinute * 60;
    const oneDay = oneHour * 24;
    const oneWeek = oneDay * 7;
    const oneMonth = oneDay * 30;
    const oneYear = oneDay * 365;

    switch (unit) {
        case "s": return amount * oneSecond;
        case "m": return amount * oneMinute;
        case "h": return amount * oneHour;
        case "d": return amount * oneDay;
        case "w": return amount * oneWeek;
        case "M": return amount * oneMonth;
        case "y": return amount * oneYear;
        default:
            console.warn(`Unknown time unit: ${unit}, using default 1h`);
            return oneHour;
    }
};
