import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/user-service.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('User Service API', function() {
  // 測試 GET /users 路由
  it('應該返回所有使用者資料', function(done) {
    chai.request(app)
      .get('/users')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // 測試 GET /users/:id 路由
  it('應該返回特定使用者資料', function(done) {
    const userId = 1; // 根據你的資料庫，使用一個有效的使用者 ID
    chai.request(app)
      .get(`/users/${userId}`)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id', userId);
        done();
      });
  });

  // 測試 GET /users/:id 路由，當使用者不存在
  it('應該返回 404 狀態碼當使用者不存在時', function(done) {
    const nonExistentUserId = 9999; // 一個你確定不存在的使用者 ID
    chai.request(app)
      .get(`/users/${nonExistentUserId}`)
      .end(function(err, res) {
        expect(res).to.have.status(404);
        done();
      });
  });
});
