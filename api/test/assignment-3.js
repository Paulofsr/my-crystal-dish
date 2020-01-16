var request = require('supertest');
var chai = require('chai');
chai.use(require('chai-subset'));
chai.use(require('chai-string'));
var expect = chai.expect;
var sleep = require('system-sleep');
var axios = require('axios');
var port = process.env.PORT || '3000';

var server = require('../bin/www');

function get(url, args){
    return axios.get('http://localhost:' + port + url, args);
}

function post(url, body, args){
    return axios.post('http://localhost:' + port + url, body, args);
}

function put(url, body, args){
    return axios.put('http://localhost:' + port + url, body, args);
}

function del(url, args){
    return axios.delete('http://localhost:' + port + url, args);
}

describe('Assignment 3', function(){
    sleep(2000); 

    var tempToken1 = '';
    var tempToken2 = '';
    var adminToken = '';
    var dishId = '';
    var commentId = '';
    

    before(function () {
    });

    after(function () {
    });

    describe('/v1/conFusion', function () {

        it('Should return list of Dish.', function () {
            return get('/dishes/')
                .then(function (response) {
                    expect(response.status).to.be.equal(200);
                    expect(response.data.length).to.be.equal(0);
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
                  .finally(function () {
                  });
        });

        it('Should login with adminer.', function () {
            return post('/users/login',
                    {
                        "username": "admin",
                        "password": "1233"
                    },
                    {
                        "headers": {
                            "Content-Type": "application/json"
                        }
                    })
                    .then(response => {
                        expect(response.status).to.be.equal(200);
                        expect(response.data.success).to.be.equal(true);
                        expect(response.data.status).to.be.equal('You are successfully logged in!');
                        adminToken = response.data.token;
                    })
                    .catch(function (error) {
                      console.log(error);
                    })
                    .finally(function () {
                    });
        });

        it('Should return list of Users with adminer.', function () {
            return get('/users',
                {
                    "headers": {
                        "Authorization": `bearer ${adminToken}`
                    }
                })
                .then(function (response) {
                    expect(response.status).to.be.equal(200);
                    expect(response.data.length).to.be.equal(3);
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
                  .finally(function () {
                  });
        });

        it('Should login with user 1.', function () {
            return post('/users/login',
                    {
                        "username": "paulo",
                        "password": "1233"
                    },
                    {
                        "headers": {
                            "Content-Type": "application/json"
                        }
                    })
                    .then(response => {
                        expect(response.status).to.be.equal(200);
                        expect(response.data.success).to.be.equal(true);
                        expect(response.data.status).to.be.equal('You are successfully logged in!');
                        tempToken1 = response.data.token;
                    })
                    .catch(function (error) {
                      console.log(error);
                    })
                    .finally(function () {
                    });
        });

        it('Should login with user 2.', function () {
            return post('/users/login',
                {
                    "username": "fernanda",
                    "password": "1233"
                },
                {
                    "headers": {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                    expect(response.data.success).to.be.equal(true);
                    expect(response.data.status).to.be.equal('You are successfully logged in!');
                    tempToken2 = response.data.token;
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });
        });

        it('Should return ERROR when list of Users with authorized user.', function () {
            return get('/users',
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(function (response) {
                    expect(response.status).to.be.equal(403);
                  })
                  .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("You are not authorized to perform this operation");
                  })
                  .finally(function () {
                  });
        });

        it('Dish - admin - POST - .', function () {
            return post('/dishes',
                {
                "name": "Teste DISH",
                "image": "images/zucchipakoda.png",
                "category": "appetizer",
                "label": "",
                "price": "1.99",
                "featured": "false",
                "description": "Deep fried Zucchini coated with mildly spiced Chickpea flour batter accompanied with a sweet-tangy tamarind sauce",
                "comments": [ ]
                },
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${adminToken}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                    dishId = response.data._id;
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });
        });

        it('Dish - admin - PUT - .', function () {
            return put('/dishes',
                {},
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${adminToken}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("PUT operation not supported on /dishes");
                })
                .finally(function () {
                });
        });

        it('DishId - admin - POST - .', function () {
            return post('/dishes/' + dishId,
                {},
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${adminToken}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase(`POST operation not supported on /dishes/${dishId}`);
                })
                .finally(function () {
                });
        });

        it('DishId - admin - PUT - .', function () {
            return put('/dishes/' + dishId,
                {
                "name": "Teste DISH",
                "image": "images/zucchipakoda.png",
                "category": "appetizer",
                "label": "",
                "price": "1.99",
                "featured": "false",
                "description": "Description updated",
                "comments": [ ]
                },
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${adminToken}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                    expect(response.data.description).to.be.equal("Description updated");
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });
        });

        it('Dish - user 1 - POST - ERROR.', function () {
            return post('/dishes',
                {
                },
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("You are not authorized to perform this operation");
                })
                .finally(function () {
                });
        });

        it('Dish - user 1 - PUT - ERROR.', function () {
            return put('/dishes',
                {},
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("You are not authorized to perform this operation");
                })
                .finally(function () {
                });
        });

        it('DishId - user 1 - POST - ERROR.', function () {
            return post('/dishes/' + dishId,
                {},
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("You are not authorized to perform this operation");
                })
                .finally(function () {
                });
        });

        it('DishId - user 1 - PUT - ERROR.', function () {
            return put('/dishes/' + dishId,
                {
                },
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("You are not authorized to perform this operation");
                })
                .finally(function () {
                });
        });

        it('Comments - user 1 - POST - .', function () {
            return post('/dishes/' + dishId + '/comments',
                {
                    "rating": 5,
                    "comment": "Imagine all the eatables, living in conFusion!"
                },
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                    expect(response.data.comments.length).to.be.equal(1);
                    commentId = response.data.comments[0]._id;
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });
        });

        it('Comments - user 1 - DELETE - ERROR.', function () {
            return del('/dishes/' + dishId + '/comments',
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("You are not authorized to perform this operation");
                })
                .finally(function () {
                });
        });

        it('CommentId - author - PUT - .', function () {
            return put('/dishes/' + dishId + '/comments/' + commentId,
                {
                    "rating": 5,
                    "comment": "Updated!!!"
                },
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                    expect(response.data.comments.length).to.be.equal(1);
                    expect(response.data.comments[0].comment).to.be.equal("Updated!!!");
                })
                .catch(function (error) {
                    console.log('>>> CommentId - author - PUT - .');
                    console.log(error);
                })
                .finally(function () {
                });
        });

        it('CommentId - another User - PUT - ERROR.', function () {
            return put('/dishes/' + dishId + '/comments/' + commentId,
                {
                },
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${adminToken}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("You are not authorized to update this comment!");
                })
                .finally(function () {
                });
        });

        it('CommentId - another User - DELETE - ERROR.', function () {
            return del('/dishes/' + dishId + '/comments/' + commentId,
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken2}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("You are not authorized to delete this comment!");
                })
                .finally(function () {
                });
        });

        it('CommentId - admin - DELETE - ERROR.', function () {
            return del('/dishes/' + dishId + '/comments/' + commentId,
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${adminToken}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("You are not authorized to delete this comment!");
                })
                .finally(function () {
                });
        });

        it('CommentId - author - DELETE - .', function () {
            return del('/dishes/' + dishId + '/comments/' + commentId,
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });
        });

        it('Comments - admin - DELETE - .', function () {
            return del('/dishes/' + dishId + '/comments/',
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${adminToken}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                    expect(response.data.comments.length).to.be.equal(0);
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });
        });

        it('Dish - user 1 - DELETE - ERROR.', function () {
            return del('/dishes',
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("You are not authorized to perform this operation");
                })
                .finally(function () {
                });
        });

        it('DishId - user 1 - DELETE - ERROR.', function () {
            return del('/dishes/' + dishId,
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(403);
                })
                .catch(function (error) {
                    expect(error.response.status).to.be.equal(403);
                    expect(error.response.data).to.containIgnoreCase("You are not authorized to perform this operation");
                })
                .finally(function () {
                });
        });

        it('DishId - admin - DELETE - .', function () {
            return del('/dishes/' + dishId,
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${adminToken}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });
        });

        it('Dish - admin - DELETE - .', function () {
            return del('/dishes',
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${adminToken}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                    expect(response.data).to.have.property('ok');
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });
        });
    });
});