"use server";
import * as fs from "node:fs/promises";

export async function pushMarkerMoved(
  dataId: string,
  index: number,
  position: { lat: number; lng: number },
) {
  const filePath = `${process.cwd()}/public/data/${dataId}.geojson`;
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(raw);
    const coords = json.features?.[0]?.geometry?.coordinates;
    if (!Array.isArray(coords)) throw new Error("invalid geojson");

    const idx = Number(index);
    if (Number.isNaN(idx) || idx < 0 || idx >= coords.length)
      throw new Error("invalid index");

    coords[idx] = [Number(position.lng), Number(position.lat)];
    await fs.writeFile(filePath, JSON.stringify(json, null, 2), "utf-8");
  } catch (err) {
    console.error("pushMarkerMoved error:", err);
    throw err;
  }
}

export async function pushMarkerAdded(
  dataId: string,
  index: number,
  position: { lat: number; lng: number },
) {
  const filePath = `${process.cwd()}/public/data/${dataId}.geojson`;
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(raw);
    const coords = json.features?.[0]?.geometry?.coordinates;
    if (!Array.isArray(coords)) throw new Error("invalid geojson");

    const idx = Number(index);
    const newCoord = [Number(position.lng), Number(position.lat)];
    if (Number.isNaN(idx) || idx < 0 || idx > coords.length) {
      coords.push(newCoord);
    } else {
      coords.splice(idx, 0, newCoord);
    }

    await fs.writeFile(filePath, JSON.stringify(json, null, 2), "utf-8");
  } catch (err) {
    console.error("pushMarkerAdded error:", err);
    throw err;
  }
}
