const { google } = require("googleapis");

const YOUR_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const YOUR_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const YOUR_REDIRECT_URL = process.env.GOOGLE_OAUTH_REDIRECT_URL.toString();

const scopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
);

google.options({
  auth: oauth2Client,
});

const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes.join(" "),
  include_granted_scopes: true,
});

const getToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

const setCredentials = (tokens) => {
  return oauth2Client.setCredentials(tokens);
};

module.exports = {
  authorizeUrl,
  getToken,
  setCredentials,
};
