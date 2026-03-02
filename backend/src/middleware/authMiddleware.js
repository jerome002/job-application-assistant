import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if Header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      message: "Access Denied: No token provided" 
    });
  }

  // 2. Extract Token
  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "dev_secret_key";
    const decoded = jwt.verify(token, secret);

    // 3. Normalize the User Object
    // This ensures req.user.id is ALWAYS available whether 
    // the token used 'id' or '_id'.
    const userId = decoded.id || decoded._id || (typeof decoded === 'string' ? decoded : null);

    if (!userId) {
      throw new Error("Token does not contain a valid user identifier");
    }

    req.user = { id: userId };
    
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(403).json({ 
      success: false, 
      message: "Session expired or invalid token" 
    });
  }
};