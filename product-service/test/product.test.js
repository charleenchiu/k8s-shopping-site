import * as chai from 'chai'; // 使用 * 作為 chai 的命名空間
import chaiHttp from 'chai-http';

chai.use(chaiHttp); // 確保使用 chai-http 插件
import app from '../src/product-service.js';    // 引入您的 Express 應用程式

const { expect } = chai; // 從 chai 解構 expect

///console.log(chai);
//console.log(chaiHttp);


describe('Products API', () => {
    it('應該獲取所有商品', (done) => {
        chai.request(app)
            .get('/products')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('應該獲取單個商品', (done) => {
        const productId = 1;    // 假設這個商品ID存在
        chai.request(app)
            .get(`/products/${productId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('id', productId);
                done();
            });
    });

    it('應該新增商品', (done) => {
        const newProduct = { name: 'Product 3', price: 300 };
        chai.request(app)
            .post('/products')
            .send(newProduct)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('name', newProduct.name);
                expect(res.body).to.have.property('price', newProduct.price);
                done();
            });
    });

    it('應該更新商品', (done) => {
        const productId = 1;    // 假設這個商品ID存在
        const updatedProduct = { name: 'Updated Product', price: 150 };
        chai.request(app)
            .put(`/products/${productId}`)
            .send(updatedProduct)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('name', updatedProduct.name);
                expect(res.body).to.have.property('price', updatedProduct.price);
                done();
            });
    });

    it('應該刪除商品', (done) => {
        const productId = 1;    // 假設這個商品 ID 存在
        chai.request(app)
            .delete(`/products/${productId}`)
            .end((err, res) => {
                expect(res).to.have.status(204);
                done();
            });
    });
});
