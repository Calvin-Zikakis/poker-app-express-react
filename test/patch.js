const supertest = require("supertest"),
    should = require("should"),
    dbSetup = require("../setup/db"),
    dbDelete = require("../setup/deleteTable"),
    chai = require('chai'),
    { routes } = require('../project/constants/constants');
chai.should();

var server = require('../server.js');
var request = supertest(server);

describe("PATCH players route", function () {
    let seedPlayers;
    before(async () => {
        console.log("[Patch]seeding players...");
        seedPlayers = await dbSetup.seedTable();
   
        return seedPlayers;
    });

    // Edit a user
    it('Edits a user', function () {
        let playerId = seedPlayers[1].id
        const playerData = {
            firstName: 'patchy3453',
            lastName: 'lastpatchy'
        }
        return request.patch(`/${routes.player}/${playerId}`)
            .send(playerData)
            .then(response => {
                var {
                    status,
                    body
                } = response
                status.should.eql(200)
            })
        body[0].should.have.property('firstName').and.to.be.a('string');
        body[0].should.have.property('lastName').and.to.be.a('string');
        body[0].should.have.property('winning');
        body[0].should.have.property('country').and.to.be.a('string');
    });

    it('Retrieves previously Edited player', function () {
        let playerId = seedPlayers[1].id
        return request.get(`/${routes.player}/${playerId}`)
            .then(response => {
                var {
                    status,
                    body
                } = response
                status.should.eql(200)
            })
        // Check that the body is an array
        body.should.an('array');
        // Check that the content is not null (0)
        body.should.not.equal(0);
        return request.get(`/${routes.player}/${playerId}`)
        // Check that the property contains a first name that is a string value
        body[0].should.have.property('firstName').and.to.be.a('string');
        body[0].should.have.property('lastName').and.to.be.a('string');
        body[0].should.have.property('winning');
        body[0].should.have.property('country').and.to.be.a('string');
    })

    it('Should fail to update a non-existing player', function(){
        let playerId = 666
        const playerData = {
            firstName: 'noPlayer',
            lastName: 'lastnoPlayer'
        }
        return request.patch(`/${routes.player}/${playerId}`)
        .send(playerData)
        .then(response => {
            var {
                status, 
                body
            } = response 
            status.should.eql(404)
        })   
    });

    after (async () => {
        console.log("[Patch]tests complete deleting db...")
        return await dbDelete();
    })
});