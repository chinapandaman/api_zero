const assert = require("assert");
const schema_based = require("./../src/schema_based/schema_based");
const Sequelize = require("sequelize");

describe("Test Schema Based", function() {
    let db;
    
    beforeEach(function(){
         db = new Sequelize("sqlite::memory:");
    });

    it("no nested objects or arrays", function() {
        let test_schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "http://example.com/person.schema.json",
            "title": "person",
            "description": "a person",
            "type": "object",
            "properties": {
                "first_name": {
                    "type": "string"
                },
                "last_name": {
                    "type": "string"
                }
            },
            "required": []
        }
        let person = schema_based.schema_to_model(db, test_schema);
        assert.equal(person, db.models.person);
    });
});
