export class Table {
    constructor(id, nombre, codigo, fkPeriodicidad, fkPublicacion, fkPeriodoIni, anyoPeriodoIni, fechaRefFin, ultimaModificacion) {
        this.id = id; //This is the main Table identifier
        this.nombre = nombre;
        this.codigo = codigo;
        this.fkPeriodicidad = fkPeriodicidad;
        this.fkPublicacion = fkPublicacion;
        this.fkPeriodoIni = fkPeriodoIni;
        this.anyoPeriodoIni = anyoPeriodoIni;
        this.fechaRefFin = fechaRefFin;
        this.ultimaModificacion = ultimaModificacion;
    }
}