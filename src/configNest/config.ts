import { SessionOptions } from "express-session";

export const CONFIG_SESSION: SessionOptions = {
    name: 's.id',
    secret: "hola",
    resave: false,
    saveUninitialized: false,
    rolling: true, 
    cookie: {
      httpOnly: true,
      secure: false, 
      priority: 'high',
      maxAge: 3600000, 
    },
  };
  