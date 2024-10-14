import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/order-service.js'; // 引入您的 Express 應用程式

chai.use(chaiHttp);
const expect = chai.expect;

describe('Order Service API', function() {
  // 測試 GET /orders 路由
  it('應該返回所有訂單資料', function(done) {
    chai.request(app)
      .get('/orders')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // 測試 GET /orders/:id 路由
  it('應該返回特定訂單資料', function(done) {
    const orderId = 1; // 根據你的資料庫，使用一個有效的訂單 ID
    chai.request(app)
      .get(`/orders/${orderId}`)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id', orderId);
        done();
      });
  });

  // 測試 GET /orders/:id 路由，當訂單不存在
  it('應該返回 404 狀態碼當訂單不存在時', function(done) {
    const nonExistentOrderId = 9999; // 一個你確定不存在的訂單 ID
    chai.request(app)
      .get(`/orders/${nonExistentOrderId}`)
      .end(function(err, res) {
        expect(res).to.have.status(404);
        done();
      });
  });

  // 測試 POST /orders 路由
  it('應該新增一筆訂單', function(done) {
    const newOrder = {
      userId: 1,
      orderTime: '2024-10-08T01:00:00Z',
      details: [
        {productId: 1, quantity: 2},
        {productId: 2, quantity: 1}
      ]
    };
    chai.request(app)
      .post('/orders')
      .send(newOrder)
      .end(function(err, res) {
        expect(res).to.have.status(201);
        expect(res.body).to.include({ userId: newOrder.userId });
        expect(res.body.details).to.be.an('array').that.has.lengthOf(2);
        done();
      });
  });

  // 測試 PUT /orders/:id 路由
  it('應該更新一筆訂單', function(done) {
    const updatedOrder = {
      userId: 1,
      orderTime: '2024-10-08T02:00:00Z',
      details: [
        {productId: 1, quantity: 3},
        {productId: 2, quantity: 2}
      ]
    };
    const orderId = 1; // 根據你的資料庫，使用一個有效的訂單 ID
    chai.request(app)
      .put(`/orders/${orderId}`)
      .send(updatedOrder)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.include({ userId: updatedOrder.userId });
        expect(res.body.details).to.be.an('array').that.has.lengthOf(2);
        done();
      });
  });

  // 測試 DELETE /orders/:id 路由
  it('應該刪除一筆訂單', function(done) {
    const orderId = 1; // 根據你的資料庫，使用一個有效的訂單 ID
    chai.request(app)
      .delete(`/orders/${orderId}`)
      .end(function(err, res) {
        expect(res).to.have.status(204);
        done();
      });
  });
});
