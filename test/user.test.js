const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Update the path based on your project structure

chai.use(chaiHttp);
const expect = chai.expect;

describe('User API', () => {
  let authToken; // Used to store the authentication token for testing protected routes

//   before((done) => {
//     app.listen(8081, () => {
//       console.log('Server is running.');
//       done();
//     });
//   });
let server;  // 用于保存服务器实例

before((done) => {
  server = app.listen(8081, () => {
    console.log('Server is running on port 8081.');
    done();
  });
});

after((done) => {
  server.close(() => {
    console.log('Server is closed.');
    setTimeout(() => {
        done();
      }, 1000);
  });
});
  // Test user registration
  describe('/POST user/register', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/user/register')
        .send({
          username: 'testuser',
          password: 'testpassword',
          email: 'test@example.com',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(true);
          expect(res.body).to.have.property('code').eql('REGISTERED SUCCESSFULLY');
          done();
        });
    });
  });

  // Test user login
  describe('/GET user/login', () => {
    it('should login with the registered user', (done) => {
      chai.request(app)
        .get('/user/login')
        .query({
          username: 'testuser',
          password: 'testpassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(true);
          expect(res.body).to.have.property('code').eql('LOGIN SUCCESSFULLY');
          authToken = res.body.data.token; // Save the token for use in testing protected routes
          done();
        });
    });
  });

  // Test protected route (delete user)
  describe('/POST user/delete', () => {
    it('should delete the user', (done) => {
      chai.request(app)
        .post('/user/delete')
        .set('token', authToken) // Set the authentication token
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(true);
          expect(res.body).to.have.property('code').eql('DELETE SUCCESSFULLY');
          done();
        });
    });
  });
});

