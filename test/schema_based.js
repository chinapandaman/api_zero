const assert = require("assert");
const schema_based = require("../src/schema_based/schema_to_model");
const { DataTypes, Sequelize } = require("sequelize");

describe("test schema_to_models", function () {
    let db;

    beforeEach(function () {
        db = new Sequelize("sqlite::memory:");
    });

    afterEach(function () {
        db.close();
    });

    it("no nested objects or arrays", function () {
        let test_schema = {
            $schema: "http://json-schema.org/draft-07/schema#",
            $id: "http://example.com/person.schema.json",
            title: "person",
            description: "a person",
            type: "object",
            properties: {
                name: {
                    type: "string",
                },
                age: {
                    type: "integer",
                },
                height: {
                    type: "number",
                },
                is_active: {
                    type: "boolean",
                },
                nothing: {
                    type: "null",
                },
            },
            required: [],
        };
        let person = schema_based.schema_to_model(db, test_schema);
        assert.equal(person, db.models.person);
        assert.equal(
            db.models.person.rawAttributes.name.type.key,
            DataTypes.STRING.key
        );
        assert.equal(
            db.models.person.rawAttributes.age.type.key,
            DataTypes.INTEGER.key
        );
        assert.equal(
            db.models.person.rawAttributes.height.type.key,
            DataTypes.FLOAT.key
        );
        assert.equal(
            db.models.person.rawAttributes.is_active.type.key,
            DataTypes.BOOLEAN.key
        );
        assert.equal(
            db.models.person.rawAttributes.nothing.type.key,
            DataTypes.STRING.key
        );
    });

    it("nested objects and arrays", function () {
        let test_schema = {
            $schema: "http://json-schema.org/draft-07/schema#",
            $id: "http://example.com/person.schema.json",
            title: "person",
            description: "a person",
            type: "object",
            properties: {
                name: {
                    type: "object",
                    properties: {
                        first_name: {
                            type: "string",
                        },
                        last_name: {
                            type: "string",
                        },
                    },
                },
                gender: {
                    type: "string",
                },
                lucky_number: {
                    type: "array",
                    items: {
                        type: "integer",
                    },
                },
            },
            required: [],
        };

        let person = schema_based.schema_to_model(db, test_schema);
        assert.equal(person, db.models.person);
        assert.equal(
            db.models.person.rawAttributes.gender.type.key,
            DataTypes.STRING.key
        );
        assert.equal(
            db.models.name.rawAttributes.first_name.type.key,
            DataTypes.STRING.key
        );
        assert.equal(
            db.models.name.rawAttributes.last_name.type.key,
            DataTypes.STRING.key
        );
        assert.equal(
            db.models.lucky_number.rawAttributes.lucky_number.type.key,
            DataTypes.INTEGER.key
        );
        assert.equal(
            "personId" in
                db.models.person.associations.name.target.rawAttributes,
            true
        );
        assert.equal(
            "personId" in
                db.models.person.associations.lucky_numbers.target
                    .rawAttributes,
            true
        );
    });
});
