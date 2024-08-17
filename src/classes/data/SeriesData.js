export class DataPoint {
    constructor(fecha, fkTipoDato, fkPeriodo, anyo, valor, secreto) {
        this.fecha = fecha;
        this.fkTipoDato = fkTipoDato;
        this.fkPeriodo = fkPeriodo;
        this.anyo = anyo;
        this.valor = valor;
        this.secreto = secreto;
    }

    // Static method to create a DataPoint instance from raw data
    static fromJson(data) {
        return new DataPoint(
            data.Fecha,
            data.FK_TipoDato,
            data.FK_Periodo,
            data.Anyo,
            data.Valor,
            data.Secreto
        );
    }
}

export class Record {
    constructor(cod, nombre, fkUnidad, fkEscala, data) {
        this.cod = cod; // This is the main Record identifier
        this.nombre = nombre;
        this.fkUnidad = fkUnidad;
        this.fkEscala = fkEscala;
        this.data = data.map(DataPoint.fromJson);
    }

    // Static method to create a Record instance from raw data
    static fromJson(data) {
        return new Record(
            data.COD,
            data.Nombre,
            data.FK_Unidad,
            data.FK_Escala,
            data.Data
        );
    }
}
