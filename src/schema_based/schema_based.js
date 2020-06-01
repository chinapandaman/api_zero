const DataTypes = require("sequelize");

function schema_to_model(db, schema){
    schema_type_to_model_type = {
        "string": "STRING"
    }

    let field_obj = {};

    for (let key in schema["properties"]){
        let property = schema[key];

        if (property["type"] === "object"){
            schema_to_model(db, property);
            field_obj[key] = {};
        }
        else if (property["type"] === "array"){
            schema_to_model(db, property["items"]);
            field_obj[key] = {};
        }
        else{
            field_obj[key] = {
                "type": schema_type_to_model_type[property["type"]],
            };
        }
    }

    const new_table = db.define(schema["title"], field_obj);

    console.log(new_table === db.models.new_table);
}
