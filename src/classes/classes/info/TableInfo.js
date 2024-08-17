export class TableInfo {
    constructor(id, nombre, codigo, fkPeriodicidad, fkPublicacion, fkPeriodoIni, anyoPeriodoIni, fkPeriodoFin, anyoPeriodoFin, fechaRefFin, ultimaModificacion) {
        this.id = id; // This is the main TableInfo identifier
        this.nombre = nombre;
        this.codigo = codigo;
        this.fkPeriodicidad = fkPeriodicidad;
        this.fkPublicacion = fkPublicacion;
        this.fkPeriodoIni = fkPeriodoIni;
        this.anyoPeriodoIni = anyoPeriodoIni;
        this.fkPeriodoFin = fkPeriodoFin;
        this.anyoPeriodoFin = anyoPeriodoFin;
        this.fechaRefFin = fechaRefFin;
        this.ultimaModificacion = ultimaModificacion;
    }

    // Static method to create a TableInfo instance from raw data
    static fromJson(data) {
        return new TableInfo(
            data.Id,
            data.Nombre,
            data.Codigo,
            data.FK_Periodicidad,
            data.FK_Publicacion,
            data.FK_Periodo_ini,
            data.Anyo_Periodo_ini,
            data.FK_Periodo_fin,
            data.Anyo_Periodo_fin,
            data.FechaRef_fin,
            data.Ultima_Modificacion
        );
    }
}
