import unittest
from app import app, mongo  # 假設 Flask app 和 mongo 是在 app.py 中初始化的
from bson.objectid import ObjectId

class UserServiceAPITest(unittest.TestCase):
    
    # 設定測試環境
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

        # 建立測試資料
        self.test_user_id = mongo.db.users.insert_one({
            "name": "測試使用者",
            "email": "testuser@example.com"
        }).inserted_id

    # 清理測試資料
    def tearDown(self):
        mongo.db.users.delete_many({})  # 清空測試用的 users 集合
    
    # 測試 GET /users 路由
    def test_get_all_users(self):
        response = self.app.get('/users')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)  # 確認返回的資料型態是 list
    
    # 測試 GET /users/<id> 路由
    def test_get_user_by_id(self):
        response = self.app.get(f'/users/{str(self.test_user_id)}')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, dict)  # 確認返回的資料型態是 dict
        self.assertEqual(response.json["_id"], str(self.test_user_id))  # 驗證使用者 ID
    
    # 測試 GET /users/<id> 當使用者不存在
    def test_get_user_not_found(self):
        non_existent_user_id = ObjectId()  # 隨機產生一個不存在的 ObjectId
        response = self.app.get(f'/users/{str(non_existent_user_id)}')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
