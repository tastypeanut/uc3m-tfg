// src/types.ts
export interface DataEntry {
    Fecha: number;
    FK_TipoDato: number;
    FK_Periodo: number;
    Anyo: number;
    Valor: number;
    Secreto: boolean;
}

export interface MyObject {
    COD: string;
    Nombre: string;
    FK_Unidad: number;
    FK_Escala: number;
    Data: DataEntry[];
}
