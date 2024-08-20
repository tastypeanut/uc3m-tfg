// Class to represent the Unidad object
export class Unidad {
    constructor(id, nombre, codigo, abrev) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.abrev = abrev;
    }

    static fromJson(data) {
        return new Unidad(data.Id, data.Nombre, data.Codigo, data.Abrev);
    }
}

// Class to represent the Escala object
export class Escala {
    constructor(id, nombre, factor, codigo, abrev) {
        this.id = id;
        this.nombre = nombre;
        this.factor = factor;
        this.codigo = codigo;
        this.abrev = abrev;
    }

    static fromJson(data) {
        return new Escala(data.Id, data.Nombre, data.Factor, data.Codigo, data.Abrev);
    }
}

// Class to represent the TipoDato object
export class TipoDato {
    constructor(id, nombre, codigo) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
    }

    static fromJson(data) {
        return new TipoDato(data.Id, data.Nombre, data.Codigo);
    }
}

// Class to represent the Periodo object
export class Periodo {
    constructor(id, valor, fkPeriodicidad, diaInicio, mesInicio, codigo, nombre, nombreLargo) {
        this.id = id;
        this.valor = valor;
        this.fkPeriodicidad = fkPeriodicidad;
        this.diaInicio = diaInicio;
        this.mesInicio = mesInicio;
        this.codigo = codigo;
        this.nombre = nombre;
        this.nombreLargo = nombreLargo;
    }

    static fromJson(data) {
        return new Periodo(
            data.Id,
            data.Valor,
            data.FK_Periodicidad,
            data.Dia_inicio,
            data.Mes_inicio,
            data.Codigo,
            data.Nombre,
            data.Nombre_largo
        );
    }
}

// Class to represent the DataPoint object
export class DataPoint {
    constructor(fecha, tipoDato, periodo, anyo, nombrePeriodo, codigoPeriodo, valor, secreto) {
        this.fecha = fecha;
        this.tipoDato = tipoDato;
        this.periodo = periodo;
        this.anyo = anyo;
        this.nombrePeriodo = nombrePeriodo;
        this.codigoPeriodo = codigoPeriodo;
        this.valor = valor;
        this.secreto = secreto;
    }

    // Static method to create a DataPoint instance from raw data
    static fromJson(data) {
        return new DataPoint(
            data.Fecha,
            TipoDato.fromJson(data.TipoDato),
            Periodo.fromJson(data.Periodo),
            data.Anyo,
            data.NombrePeriodo,
            data.CodigoPeriodo,
            data.Valor,
            data.Secreto
        );
    }
}

// Class to represent the Record object
export class Record {
    constructor(cod, nombre, unidad, escala, data) {
        this.cod = cod;
        this.nombre = nombre;
        this.unidad = unidad;
        this.escala = escala;
        this.data = data.map(DataPoint.fromJson);
    }

    // Static method to create a Record instance from raw data
    static fromJson(data) {
        return new Record(
            data.COD,
            data.Nombre,
            Unidad.fromJson(data.Unidad),
            Escala.fromJson(data.Escala),
            data.Data
        );
    }
}
