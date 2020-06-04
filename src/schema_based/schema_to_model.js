const DataTypes = require("sequelize");

module.exports = {
    schema_to_model: function schema_to_model(db, schema) {
        let field_obj = {};
        let nested_objects = [];
        let nested_arrays = [];

        for (let key in schema["properties"]) {
            let property = schema["properties"][key];

            if (property["type"] === "object") {
                let new_schema = property;
                new_schema["title"] = key;
                nested_objects.push(schema_to_model(db, new_schema));
            } else if (property["type"] === "array") {
                let new_schema = {
                    title: key,
                    properties: {},
                };
                new_schema["properties"][key] = property["items"];
                nested_arrays.push(schema_to_model(db, new_schema));
            } else {
                let type;
                switch (property["type"]) {
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
                    type: type,
                };
            }
        }

        let result = db.define(schema["title"], field_obj);
        for (let i = 0; i < nested_objects.length; i++) {
            result.hasOne(nested_objects[i]);
            nested_objects[i].belongsTo(result);
        }
        for (let i = 0; i < nested_arrays.length; i++) {
            result.hasMany(nested_arrays[i]);
            nested_arrays[i].belongsTo(result);
        }

        return result;
    },
};
