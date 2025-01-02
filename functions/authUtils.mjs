import { generateAccessToken } from "./otherUtils.mjs";

export function register(users) {
  return function (req, res) {
    // const payload = req.body;
    console.log("====Request User====", req.user);
    // users.push({ user: payload.user });
    users.set(req.user.userName, {
      tasks: new Map(),
      password: req.user.password,
    });
    // store username and password
    // const token = generateAccessToken(payload);
    res.json({ message: "User registered" });
  };
}

export function login(req, res) {
  const payload = req.body;
  // console.log(payload);
  // if username, password valid, generate jwt
  // and store in cookie
  // const token = generateAccessToken(payload);
  const token = generateAccessToken({ userName: payload.userName });
  res.cookie("accessToken", token, { maxAge: 1000 * 60 * 60 });
  res.json({ message: "Logged in", token });
}
