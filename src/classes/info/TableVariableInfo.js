//Info of the variables inside a table
export class TableVariableInfo {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        //this.options = [];
        //this.values = [];
    }

    // Static method to create a TableVariableInfo instance from raw data
    static fromJson(data) {
        return new TableVariableInfo(
            data.Id,
            data.Nombre
        );
    }
}