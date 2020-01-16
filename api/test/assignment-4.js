var request = require('supertest');
var chai = require('chai');
chai.use(require('chai-subset'));
chai.use(require('chai-string'));
var expect = chai.expect;
var sleep = require('system-sleep');
var axios = require('axios');
var port = Number(process.env.PORT || '3000') + 443;

var server = require('../bin/www');

function get(url, args){
    return axios.get('https://localhost:' + port + url, args);
}

function post(url, body, args){
    return axios.post('https://localhost:' + port + url, body, args);
}

function put(url, body, args){
    return axios.put('https://localhost:' + port + url, body, args);
}

function del(url, args){
    return axios.delete('https://localhost:' + port + url, args);
}

describe('Assignment 4', function(){
    sleep(2000); 

    var tempToken1 = '';
    var tempToken2 = '';
    var adminToken = '';
    var dishId = '';
    var commentId = '';
    var dishIdList = [];
    

    before(function () {
    });

    after(function () {
    });

    describe('/v1/conFusion/favorites', function () {

        it('Should return list of Dish.', function () {
            return get('/dishes/')
                .then(function (response) {
                    expect(response.status).to.be.equal(200);
                    for (let index = 0; index < response.data.length; index++) {
                        const element = response.data[index];
                        dishIdList.push(element._id);
                    }
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

        it('Should return null favorite.', function () {
            return get('/favorites',
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(function (response) {
                    expect(response.status).to.be.equal(200);
                    expect(response.data).to.be.equal(null);
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
                  .finally(function () {
                  });
        });

        it('Should add an favorite.', function () {
            return post('/favorite/' + dishIdList[0],
                {
                },
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                    expect(response.data.dishes.length).to.be.equal(1);
                    expect(response.data.dishes[0]).to.be.equal(dishIdList[0]);
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });
        });

        it('Should add mult favorite.', function () {
            var body = [];
            body.push(dishIdList[1]);
            body.push(dishIdList[2]);
            body.push(dishIdList[3]);
            return post('/favorite/' + dishIdList[0],
                body,
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                    expect(response.data.dishes.length).to.be.equal(4);
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });
        });

        it('Should return favorite with population infos.', function () {
            return get('/favorites',
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(function (response) {
                    expect(response.status).to.be.equal(200);
                    expect(response.data.user.username).to.be.equal('paulo');
                    for (let index = 0; index < response.data.dishes.length; index++) {
                        const dish = response.data.dishes[index];
                        expect(dish).to.have.property('name');
                        expect(dish).to.have.property('label');
                        expect(dish).to.have.property('description');
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
                  .finally(function () {
                  });
        });

        it('Should return null favorite.', function () {
            return get('/favorites',
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${adminToken}`
                    }
                })
                .then(function (response) {
                    expect(response.status).to.be.equal(200);
                    expect(response.data).to.be.equal(null);
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
                  .finally(function () {
                  });
        });

        it('Should delete one favorite.', function () {
            return del('/favorites/' + dishIdList[0],
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(response => {
                    expect(response.status).to.be.equal(200);
                    expect(response.data.dishes.length).to.be.equal(3);
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });
        });

        it('Should delete all favorite.', function () {
            return del('/favorites/',
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

        it('Should return null favorite.', function () {
            return get('/favorites',
                {
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${tempToken1}`
                    }
                })
                .then(function (response) {
                    expect(response.status).to.be.equal(200);
                    expect(response.data).to.be.equal(null);
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
                  .finally(function () {
                  });
        });
    });
});