"use strict";
const request = require('supertest');
const app = require('../server/app');

/* test root path */
describe('Test the root path', function() {
    test('It should response the GET method', function() {
        return request(app).get("/").then(function(response) {
            expect(response.statusCode).toBe(200);
        })
    });
});

/** test no end point found */
describe('Test no end point found', function() {
    test('It return page not found in response', function() {
        return request(app).get("/sdffdf").then(function(response) {
            expect(response.text).toBe("<h1>!!!! Page not found ! ! !</h1>");
        })
    });
});

/** test no end point found */
describe('Test randomize quizes', function() {
    test('It should return any randomize quiz range 0 to 4', function() {
        return request(app).get("/popquizes").then(function(response) {
            expect(parseInt(response.body.id)).toBeLessThanOrEqual(4);
        })
    });
});
