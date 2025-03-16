import jwt from "jsonwebtoken";

const KEY = process.env.JWT_SECRET || "";
// KEY =

type userType = {
  _id: string;
  username: string;
  email: string;
  role: string;
  status: string;
};
const setUser = ({ user }: { user: userType }) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    KEY,
    {
      expiresIn: "7d",
      algorithm: "HS512",
    }
  );
};

const getInfo = (token: string) => {
  return jwt.decode(token);
};

const getUser = ({
  token,
  accessToken = KEY,
}: {
  token: string;
  accessToken?: string;
}) => {
  if (!token) return null;
  try {
    return jwt.verify(token, accessToken);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { setUser, getUser, getInfo };
