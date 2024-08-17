export class SeriesInfo {
    constructor(cod, decimales, fkClasificacion, fkEscala, fkOperacion, fkPeriodicidad, fkPublicacion, fkUnidad, id, nombre) {
        this.cod = cod;
        this.decimales = decimales;
        this.fkClasificacion = fkClasificacion;
        this.fkEscala = fkEscala;
        this.fkOperacion = fkOperacion;
        this.fkPeriodicidad = fkPeriodicidad;
        this.fkPublicacion = fkPublicacion;
        this.fkUnidad = fkUnidad;
        this.id = id;
        this.nombre = nombre;
    }

    // Static method to create a SeriesInfo instance from raw data
    static fromJson(data) {
        return new SeriesInfo(
            data.COD,
            data.Decimales,
            data.FK_Clasificacion,
            data.FK_Escala,
            data.FK_Operacion,
            data.FK_Periodicidad,
            data.FK_Publicacion,
            data.FK_Unidad,
            data.Id,
            data.Nombre
        );
    }
}
