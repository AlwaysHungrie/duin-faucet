import express from "express";
import cors from "cors";
import config from "./config";
import router from "./routes/apiRouter";
import { asyncHandler } from "./middleware/misc";
import { generateOneTimeDownloadUrl } from "./services/s3Service";

const { PORT, FRONTEND_URL } = config;

const app = express();

app.use(cors({
  origin: FRONTEND_URL,
}));
app.use(express.json());

app.use("/api/v1", router);

// For verifier service and Constella
app.get(
  '/presigned-url',
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { key } = req.query
    if (!key) {
      return res.status(400).json({ error: 'Key is required' })
    }
    const presignedUrl = await generateOneTimeDownloadUrl(
      'tlsn-notary-test',
      key as string
    )
    if (!presignedUrl) {
      return res.status(500).json({ error: 'Failed to generate presigned URL' })
    }
    res.send(presignedUrl)
  })
)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
