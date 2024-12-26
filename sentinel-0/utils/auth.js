const axios = require("axios");

const YOUR_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID.toString();
const YOUR_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET.toString();
const YOUR_REDIRECT_URL = process.env.GOOGLE_OAUTH_REDIRECT_URL.toString();

const scopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

const options = {
  redirect_uri: YOUR_REDIRECT_URL,
  client_id: YOUR_CLIENT_ID,
  response_type: "code",
  access_type: "offline",
  include_granted_scopes: true,
  scope: scopes,
};

const qs = new URLSearchParams(options);

const authorizeUrl = `${rootUrl}?${qs.toString()}`;

const getToken = async (code) => {
  const res = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      code,
      client_id: YOUR_CLIENT_ID,
      client_secret: YOUR_CLIENT_SECRET,
      redirect_uri: YOUR_REDIRECT_URL,
      grant_type: "authorization_code",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res.data;
};

module.exports = {
  authorizeUrl,
  getToken,
};
