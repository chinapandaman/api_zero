const DataTypes = require("sequelize");

module.exports = {
    "schema_to_model": function (db, schema){
        let field_obj = {};

        for (let key in schema["properties"]){
            let property = schema["properties"][key];

            if (property["type"] === "object"){
                schema_to_model(db, property);
                field_obj[key] = {};
            }
            else if (property["type"] === "array"){
                schema_to_model(db, property["items"]);
                field_obj[key] = {};
            }
            else{
                let type;
                switch(property["type"]){
                    case "string":
                        type = DataTypes.STRING;
                        break;
                    case "integer":
                        type = DataTypes.INTEGER;
                        break;
                    case "number":
                        type = DataTypes.FLOAT;
                        break;
                    case "boolean":
                        type = DataTypes.BOOLEAN;
                        break;
                    default:
                        type = DataTypes.STRING;
                }
                field_obj[key] = {
                    "type": type
                }
            }
        }

        return db.define(schema["title"], field_obj);
    }
}
