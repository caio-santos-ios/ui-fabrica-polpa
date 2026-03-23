import axios from "axios";

export const uriBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5097";
export const baseURL = `${uriBase}/api`;

export const api = axios.create({
  baseURL
});
