//Info of the table variable groups. Example: Sexo is a group, and its variables are Masculino and Femenino
export class TableVariableGroupInfo {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    // Static method to create a TableVariableGroupInfo instance from raw data
    static fromJson(data) {
        return new TableVariableGroupInfo(
            data.Id,
            data.Nombre
        );
    }
}