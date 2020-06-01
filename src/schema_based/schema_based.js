const DataTypes = require("sequelize");

module.exports = {
    "schema_to_model": function (db, schema){
        let field_obj = {};
        let nested_objects = [];
        let nested_arrays = [];

        for (let key in schema["properties"]){
            let property = schema["properties"][key];

            if (property["type"] === "object"){
                nested_objects.push(schema_to_model(db, property));
            }
            else if (property["type"] === "array"){
                nested_arrays.push(schema_to_model(db, property));
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

        let result = db.define(schema["title"], field_obj);
        for (let i = 0; i < nested_objects.length; i ++){
            result.hasOne(nested_objects[i]);
            nested_objects[i].belongsTo(result);
        }
        for (let i = 0; i < nested_arrays.length; i ++){
            result.hasMany(nested_arrays[i]);
            nested_arrays[i].belongsTo(result);
        }

        return result;
    }
}
