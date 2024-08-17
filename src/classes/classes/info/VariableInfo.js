//Variable info
export class VariableInfo {
    constructor(id, nombre, codigo, fkVariable) {
        this.id = id;
        this.fkVariable = fkVariable;
        this.nombre = nombre;
        this.codigo = codigo;
    }

    // Static method to create a TableGroupValue instance from raw data
    static fromJson(data) {
        return new VariableInfo(
            data.Id,
            data.Nombre,
            data.Codigo,
            data.FK_Variable
        );
    }
}
