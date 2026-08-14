import jwt from 'jsonwebtoken';

/**
 * Token Service (SOLID - Single Responsibility)
 * Encapsulates JWT authentication token creation and verification.
 */
export class TokenService {
  constructor(secret = process.env.JWT_SECRET || 'pro_res_jwt_secret_key_2026') {
    this.secret = secret;
  }

  /**
   * Generates signed JWT payload
   */
  generateAuthToken(user, expiresIn = '7d') {
    const payload = {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  /**
   * Decodes & verifies JWT token signature
   */
  verifyAuthToken(token) {
    return jwt.verify(token, this.secret);
  }
}

export default new TokenService();
