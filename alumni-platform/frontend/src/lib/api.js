import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});
export const fmt = (d) => (typeof d === "string" ? d : d?.msg || JSON.stringify(d || "Error"));
