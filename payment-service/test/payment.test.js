import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/payment-service.js'; // 引入您的 Express 應用程式

chai.use(chaiHttp);
const expect = chai.expect;

describe('Payment Service API', function() {
  // 測試 GET /payments 路由
  it('應該返回所有付款資料', function(done) {
    chai.request(app)
      .get('/payments')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // 測試 GET /payments/:id 路由
  it('應該返回特定付款資料', function(done) {
    const paymentId = 1; // 根據你的資料庫，使用一個有效的付款 ID
    chai.request(app)
      .get(`/payments/${paymentId}`)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id', paymentId);
        done();
      });
  });

  // 測試 GET /payments/:id 路由，當付款不存在
  it('應該返回 404 狀態碼當付款不存在時', function(done) {
    const nonExistentPaymentId = 9999; // 一個你確定不存在的付款 ID
    chai.request(app)
      .get(`/payments/${nonExistentPaymentId}`)
      .end(function(err, res) {
        expect(res).to.have.status(404);
        done();
      });
  });

  // 測試 POST /payments 路由
  it('應該新增一筆付款', function(done) {
    const newPayment = {
      orderId: 1,
      amount: 200.00
    };
    chai.request(app)
      .post('/payments')
      .send(newPayment)
      .end(function(err, res) {
        expect(res).to.have.status(201);
        expect(res.body).to.include({ orderId: newPayment.orderId });
        expect(res.body).to.have.property('amount', newPayment.amount);
        done();
      });
  });

  // 測試 PUT /payments/:id 路由
  it('應該更新一筆付款', function(done) {
    const updatedPayment = {
      orderId: 1,
      amount: 250.00
    };
    const paymentId = 1; // 根據你的資料庫，使用一個有效的付款 ID
    chai.request(app)
      .put(`/payments/${paymentId}`)
      .send(updatedPayment)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.include({ orderId: updatedPayment.orderId });
        expect(res.body).to.have.property('amount', updatedPayment.amount);
        done();
      });
  });

  // 測試 DELETE /payments/:id 路由
  it('應該刪除一筆付款', function(done) {
    const paymentId = 1; // 根據你的資料庫，使用一個有效的付款 ID
    chai.request(app)
      .delete(`/payments/${paymentId}`)
      .end(function(err, res) {
        expect(res).to.have.status(204);
        done();
      });
  });
});
