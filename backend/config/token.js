import jwt from "jsonwebtoken";

const generateToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
  }
};
export default generateToken;