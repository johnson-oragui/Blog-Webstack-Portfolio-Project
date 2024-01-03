import { hashedPwd } from '../server/utils/bcryptUtils';
import insertUserData from '../server/controllers/userController';
import User from '../server/models/user';

// Admin register page
describe('pOST /register', () => {
  it('should return 400 if firstname is missing', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        lastname: 'Doe',
        username: 'johndoe',
        email: '<EMAIL>',
        password: 'password',
        password2: 'password',
      });

    expect(response.status).toBe(400);
    expect(response.text).toContain('First Name is missing');
  });

  it('should return 400 if lastname is missing', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'John',
        username: 'johndoe',
        email: '<EMAIL>',
        password: 'password',
        password2: 'password',
      });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Last Name is missing');
  });

  it('should return 400 if username is missing', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: '<EMAIL>',
        password: 'password',
        password2: 'password',
      });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Username is missing');
  });

  it('should return 400 if email is missing', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        password: 'password',
        password2: 'password',
      });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Email is missing');
  });

  it('should return 400 if password is missing', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: '<EMAIL>',
        password2: 'password',
      });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Password is missing');
  });

  it('should return 400 if password2 is missing', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: '<EMAIL>',
        password: 'password',
      });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Confirm your Password');
  });

  it('should return 400 if password and password2 do not match', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: '<EMAIL>',
        password: 'password',
        password2: '<PASSWORD>',
      });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Both Passwords do not match');
  });

  it('should return 409 if username already exists', async () => {
    await User.create({
      firstname: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      email: '<EMAIL>',
      hashedPassword: 'password',
      hashedPassword2: 'password',
    });

    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: '<EMAIL>',
        password: 'password',
        password2: 'password',
      });

    expect(response.status).toBe(409);
    expect(response.text).toContain('Username already exists');
  });

  it('should return 409 if email already exists', async () => {
    await User.create({
      firstname: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      email: '<EMAIL>',
      hashedPassword: 'password',
      hashedPassword2: 'password',
    });

    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'Jane',
        lastname: 'Doe',
        username: 'janedoe',
        email: '<EMAIL>',
        password: 'password',
        password2: 'password',
      });

    expect(response.status).toBe(409);
    expect(response.text).toContain('Email already exists');
  });

  it('should register the user and redirect to login', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'JohnDoe@gmail.com',
        password: 'password',
        password2: 'password',
      });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
    expect(response.text).toContain('Succesfully registered!');
  });
});
