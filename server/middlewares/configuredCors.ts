import * as cors from 'cors';

export function configuredCors() {
    const whitelist = ["http://localhost:3000", "http://localhost:80"];
    const corsOptions = {
      origin: (origin: any, callback: any) => {
        if (whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    };
    
    return cors(corsOptions)
}