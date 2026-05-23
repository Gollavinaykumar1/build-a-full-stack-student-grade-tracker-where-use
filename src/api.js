import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;

// Auto-generated missing exports by VIA
export const createItem = async (d) => { const r = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/items`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}); if (!r.ok) throw new Error("createItem failed"); return r.json(); };
export const deleteItem = async (id) => { const r = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/items/${id}`, {method:"DELETE"}); if (!r.ok) throw new Error("deleteItem failed"); return r.json(); };
export const getItems = async (p) => { const q = p ? "?" + new URLSearchParams(p) : ""; const r = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/items${q}`); if (!r.ok) throw new Error("getItems failed"); return r.json(); };
export const getStats = async () => { const r = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/stats`); if (!r.ok) throw new Error("getStats failed"); return r.json(); };
