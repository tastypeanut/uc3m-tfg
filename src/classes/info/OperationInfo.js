export class OperationInfo {
    constructor(id, codIOE, nombre, codigo, url) {
        this.id = id; // This is the main OperationInfo identifier
        this.codIOE = codIOE;
        this.nombre = nombre;
        this.codigo = codigo;
        this.url = url;
    }

    // Static method to create an OperationInfo instance from raw data (JSON)
    static fromJson(data) {
        return new OperationInfo(
            data.Id,
            data.Cod_IOE,
            data.Nombre,
            data.Codigo,
            data.Url
        );
    }
}
