const assert = require("assert");
const schema_based = require("../src/schema_based/schema_to_model");
const { DataTypes, Sequelize } = require("sequelize");

describe("test schema_to_models", function () {
    describe("test schema_to_models with flattened schema", function () {
        let db, person;
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

        beforeEach(function () {
            db = new Sequelize("sqlite::memory:");
            person = schema_based.schema_to_model(db, test_schema);
        });

        afterEach(function () {
            db.close();
        });

        it("test person model creation", function () {
            assert.equal(person, db.models.person);
        });

        it("test person.name is string", function () {
            assert.equal(
                db.models.person.rawAttributes.name.type.key,
                DataTypes.STRING.key
            );
        });

        it("test person.age is integer", function () {
            assert.equal(
                db.models.person.rawAttributes.age.type.key,
                DataTypes.INTEGER.key
            );
        });

        it("test person.height is float", function () {
            assert.equal(
                db.models.person.rawAttributes.height.type.key,
                DataTypes.FLOAT.key
            );
        });

        it("test person.is_active is boolean", function () {
            assert.equal(
                db.models.person.rawAttributes.is_active.type.key,
                DataTypes.BOOLEAN.key
            );
        });

        it("test person.nothing is null", function () {
            assert.equal(
                db.models.person.rawAttributes.nothing.type.key,
                DataTypes.STRING.key
            );
        });
    });

    describe("test schema_to_models with schema with one layer nested objects and arrays", function () {
        let db, person;
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

        beforeEach(function () {
            db = new Sequelize("sqlite::memory:");
            person = schema_based.schema_to_model(db, test_schema);
        });

        afterEach(function () {
            db.close();
        });

        it("test person model creation", function () {
            assert.equal(person, db.models.person);
        });

        it("test person.gender is string", function () {
            assert.equal(
                db.models.person.rawAttributes.gender.type.key,
                DataTypes.STRING.key
            );
        });

        it("test name.first_name is string", function () {
            assert.equal(
                db.models.name.rawAttributes.first_name.type.key,
                DataTypes.STRING.key
            );
        });

        it("test name.last_name is string", function () {
            assert.equal(
                db.models.name.rawAttributes.last_name.type.key,
                DataTypes.STRING.key
            );
        });

        it("test lucky_number.lucky_number is integer", function () {
            assert.equal(
                db.models.lucky_number.rawAttributes.lucky_number.type.key,
                DataTypes.INTEGER.key
            );
        });

        it("test one to one relation between person and name", function () {
            assert.equal(
                "personId" in
                    db.models.person.associations.name.target.rawAttributes,
                true
            );
        });

        it("test one to many relation between person and lucky_number", function () {
            assert.equal(
                "personId" in
                    db.models.person.associations.lucky_numbers.target
                        .rawAttributes,
                true
            );
        });
    });

    describe("test schema_to_models with schema with two layer nested objects and arrays", function(){
        let db, person;
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
                house:{
                    type: "object",
                    properties: {
                        area: {
                            type: "number"
                        },
                        address: {
                            type: "object",
                            properties: {
                                street: {
                                    type: "string"
                                },
                                city: {
                                    type: "string"
                                },
                                state: {
                                    type: "string"
                                },
                                zip: {
                                    type: "string"
                                }
                            }
                        },
                        price_history: {
                            type: "array",
                            items: {
                                type: "number"
                            }
                        }
                    }
                },
                vehicle: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            make: {
                                type: "string"
                            },
                            model: {
                                type: "string"
                            }
                        }
                    }
                }
            },
            required: [],
        };

        beforeEach(function () {
            db = new Sequelize("sqlite::memory:");
            person = schema_based.schema_to_model(db, test_schema);
        });

        it("test person model creation", function(){
            assert.equal(person, db.models.person);
        });

        it("test person.name is string", function(){
            assert.equal(
                db.models.person.rawAttributes.name.type.key,
                DataTypes.STRING.key
            );
        });

        it("test one to one relation between person and house", function () {
            assert.equal(
                "personId" in
                    db.models.person.associations.house.target.rawAttributes,
                true
            );
        });

        it("test house.area is float", function(){
            assert.equal(
                db.models.house.rawAttributes.area.type.key,
                DataTypes.FLOAT.key
            );
        });

        it("test one to one relation between house and address", function () {
            assert.equal(
                "houseId" in
                    db.models.house.associations.address.target.rawAttributes,
                true
            );
        });

        it("test address.street is string", function(){
            assert.equal(
                db.models.address.rawAttributes.street.type.key,
                DataTypes.STRING.key
            );
        });

        it("test address.city is string", function(){
            assert.equal(
                db.models.address.rawAttributes.city.type.key,
                DataTypes.STRING.key
            );
        });

        it("test address.state is string", function(){
            assert.equal(
                db.models.address.rawAttributes.state.type.key,
                DataTypes.STRING.key
            );
        });

        it("test address.zip is string", function(){
            assert.equal(
                db.models.address.rawAttributes.zip.type.key,
                DataTypes.STRING.key
            );
        });

        it("test one to many relation between house and price_history", function () {
            assert.equal(
                "houseId" in
                    db.models.house.associations.price_histories.target
                        .rawAttributes,
                true
            );
        });

        it("test price_history.price_history is float", function(){
            assert.equal(
                db.models.price_history.rawAttributes.price_history.type.key,
                DataTypes.FLOAT.key
            );
        });

        it("test one to many relation between person and vehicle", function () {
            assert.equal(
                "personId" in
                    db.models.person.associations.vehicles.target
                        .rawAttributes,
                true
            );
        });

        it("test vehicle.make is string", function(){
            assert.equal(
                db.models.vehicle.rawAttributes.make.type.key,
                DataTypes.STRING.key
            );
        });

        it("test vehicle.model is string", function(){
            assert.equal(
                db.models.vehicle.rawAttributes.model.type.key,
                DataTypes.STRING.key
            );
        });
    });
});
