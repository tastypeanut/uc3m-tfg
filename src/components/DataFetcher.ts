// src/dataFetcher.ts
import { MyObject } from '../types/types';

export const fetchData = async (url: string): Promise<MyObject[] | null> => {
    try {
        const response = await fetch(url);
        const data: MyObject[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};
