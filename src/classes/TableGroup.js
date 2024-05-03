export class TableGroup {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        //this.selectedOption = null;
        this.options = [];
        this.values = [];
    }
}

export class TableGroupValue {
    constructor(id, nombre, codigo, fkVariable) {
        this.id = id;
        this.fkVariable = fkVariable;
        this.nombre = nombre;
        this.codigo = codigo;
    }
}
