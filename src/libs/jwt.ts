
import JWT from 'jsonwebtoken';

async function generateToken(payload: any) {
  const SECRET_KEY = process.env.JWT_PRIVATE_KEY;
  if (!SECRET_KEY) {
    console.log('JWT SECRET KEY is missing');
    throw new Error('internal server error');
  }
  return JWT.sign(payload, SECRET_KEY)
}

async function verifyToken(token:string) {
  const SECRET_KEY = process.env.JWT_PRIVATE_KEY;
  if (!SECRET_KEY) {
    console.log('JWT SECRET KEY is missing');
    throw new Error('internal server error');
  }
 return JWT.verify(token, SECRET_KEY);
}

export { generateToken, verifyToken };
