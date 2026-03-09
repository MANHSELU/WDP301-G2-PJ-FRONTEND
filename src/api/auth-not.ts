// baseAPIPublic.ts
import axios from "axios";

const baseAPIPublic = axios.create({
    baseURL: "http://localhost:3000",
});

export default baseAPIPublic;