export class DataPoint {
    constructor(fecha, fkTipoDato, fkPeriodo, anyo, valor, secreto) {
        //TODO: I could do the deserializarion here
        this.fecha = fecha;
        this.fkTipoDato = fkTipoDato;
        this.fkPeriodo = fkPeriodo;
        this.anyo = anyo;
        this.valor = valor;
        this.secreto = secreto;
    }
}

export class Record {
    constructor(cod, nombre, fkUnidad, fkEscala, data) {
        this.cod = cod; //This is the main Record identifier
        this.nombre = nombre;
        this.fkUnidad = fkUnidad;
        this.fkEscala = fkEscala;
        this.data = data.map(d => new DataPoint(d.Fecha, d.FK_TipoDato, d.FK_Periodo, d.Anyo, d.Valor, d.Secreto));
    }
}
