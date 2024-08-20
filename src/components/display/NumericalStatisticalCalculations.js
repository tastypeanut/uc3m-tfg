//Numerical function
export const calculateStandardDeviation = (data) => {
    const mean = data.reduce((sum, point) => sum + point.valor, 0) / data.length;
    const variance = data.reduce((sum, point) => sum + Math.pow(point.valor - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
};

//Numerical function
export const calculateAutocorrelation = (data, lag) => {
    const n = data.length;
    const mean = data.reduce((sum, point) => sum + point.valor, 0) / n;
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n - lag; i++) {
        numerator += (data[i].valor - mean) * (data[i + lag].valor - mean);
        denominator += (data[i].valor - mean) * (data[i].valor - mean);
    }
    return numerator / denominator;
};

//Numerical function
export const calculateCumulativeSum = (data) => {
    const mean = data.reduce((sum, point) => sum + point.valor, 0) / data.length;
    return data.reduce((acc, value, index) => {
        const cusum = (index === 0 ? 0 : acc[acc.length - 1].valor) + (value.valor - mean);
        return [...acc, { ...value, valor: cusum }];
    }, []);
};

//Numerical function
export const calculateExponentialSmoothing = (data, alpha) => {
    return data.reduce((acc, value, index) => {
        if (index === 0) {
            return [{ ...value, valor: value.valor }];
        }
        const prevSmooth = acc[acc.length - 1].valor;
        const smooth = alpha * value.valor + (1 - alpha) * prevSmooth;
        return [...acc, { ...value, valor: smooth }];
    }, []);
};

//Numerical function
export const calculateCrossCorrelation = (data1, data2, lag) => {
    const n = Math.min(data1.length, data2.length);
    const mean1 = data1.reduce((sum, point) => sum + point.valor, 0) / n;
    const mean2 = data2.reduce((sum, point) => sum + point.valor, 0) / n;
    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;
    for (let i = 0; i < n - lag; i++) {
        numerator += (data1[i].valor - mean1) * (data2[i + lag].valor - mean2);
        denominator1 += (data1[i].valor - mean1) * (data1[i].valor - mean1);
        denominator2 += (data2[i].valor - mean2) * (data2[i].valor - mean2);
    }
    return numerator / Math.sqrt(denominator1 * denominator2);
};

