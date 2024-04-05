import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/taskRouter";
import userRoutes from "./routes/userRoute";

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(taskRoutes);
app.use(userRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
