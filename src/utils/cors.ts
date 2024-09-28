import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

// Initialisieren Sie die CORS-Middleware
const cors = Cors({
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
  origin: "https://dnd.lauch.eu",
  credentials: true, // Wenn Sie Cookies oder Autorisierungsheader senden
  optionsSuccessStatus: 204,
});

// Helper-Methode, um das Middleware-Verhalten in einer Next.js-API-Route zu verwenden
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export { cors, runMiddleware };
