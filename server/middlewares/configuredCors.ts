import cors from 'cors';

export function configuredCors() {
    const whitelist = [
      "http://localhost:3000",
      "https://teams-bot-ten.vercel.app",
    ];
    console.log(whitelist)
    const corsOptions = {
      origin: (origin: any, callback: Function) => {
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