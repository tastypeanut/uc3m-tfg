//Graphical function
import {calculateStandardDeviation} from "./NumericalStatisticalCalculations";

export const calculateLinearTrendLine = (data) => {
    const n = data.length;
    if (n === 0) return [];

    const sumX = data.reduce((sum, point, i) => sum + i, 0);
    const sumY = data.reduce((sum, point) => sum + point.valor, 0);
    const sumXY = data.reduce((sum, point, i) => sum + i * point.valor, 0);
    const sumX2 = data.reduce((sum, point, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map((point, i) => ({
        ...point,
        valor: slope * i + intercept
    }));
};

//Graphical function
export const calculateMovingAverage = (data, n) => {
    return data.map((value, index, array) => {
        const start = Math.max(0, index - n + 1);
        const subset = array.slice(start, index + 1);
        const sum = subset.reduce((acc, curr) => acc + curr.valor, 0);
        return {
            ...value,
            valor: sum / subset.length
        };
    });
};

//Graphical function
export const calculateExponentialMovingAverage = (data, n) => {
    const alpha = 2 / (n + 1);
    return data.reduce((acc, value, index) => {
        if (index === 0) {
            return [{ ...value, valor: value.valor }];
        }
        const prevEMA = acc[acc.length - 1].valor;
        const ema = alpha * value.valor + (1 - alpha) * prevEMA;
        return [...acc, { ...value, valor: ema }];
    }, []);
};

//Graphical function
export const calculateWeightedMovingAverage = (data, weights) => {
    const weightSum = weights.reduce((acc, w) => acc + w, 0);
    return data.map((value, index, array) => {
        const start = Math.max(0, index - weights.length + 1);
        const subset = array.slice(start, index + 1);
        const weightedSum = subset.reduce((acc, curr, i) => acc + curr.valor * weights[weights.length - subset.length + i], 0);
        return {
            ...value,
            valor: weightedSum / weightSum
        };
    });
};

//Graphical function
export const calculateBollingerBands = (data, n) => {
    const movingAverage = calculateMovingAverage(data, n);
    const standardDeviation = calculateStandardDeviation(movingAverage);
    return movingAverage.map((value, index) => ({
        ...value,
        upperBand: value.valor + 2 * standardDeviation,
        lowerBand: value.valor - 2 * standardDeviation,
    }));
};

//Graphical function
export const detectPeaks = (data, threshold = 4) => {
    return data.reduce((peaks, value, index, array) => {
        if (index > 0 && index < array.length - 1) {
            if (value.valor > array[index - 1].valor && value.valor > array[index + 1].valor && value.valor > threshold) {
                peaks.push(value);
            }
        }
        return peaks;
    }, []);
};
