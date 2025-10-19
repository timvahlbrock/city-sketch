"use server";
import * as fs from "node:fs/promises";

async function read(dataId: string) {
  const filePath = `${process.cwd()}/data/${dataId}.geojson`;
  const raw = await fs.readFile(filePath, "utf-8");
  const json = JSON.parse(raw);
  return json;
}

async function write(dataId: string, json: any) {
  const filePath = `${process.cwd()}/data/${dataId}.geojson`;
  await fs.writeFile(filePath, JSON.stringify(json, null, 2), "utf-8");
}

function getCoordsArray(json: any): number[][] {
  const coords = json.features?.[0]?.geometry?.coordinates;
  if (!Array.isArray(coords)) throw new Error("invalid geojson");
  return coords;
}

export async function pushMarkerMoved(
  dataId: string,
  index: number,
  position: { lat: number; lng: number },
) {
  try {
    const json = await read(dataId);
    const coords = getCoordsArray(json);

    const idx = Number(index);
    if (Number.isNaN(idx) || idx < 0 || idx >= coords.length)
      throw new Error("invalid index");

    coords[idx] = [Number(position.lng), Number(position.lat)];
    await write(dataId, json);
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
  try {
    const json = await read(dataId);
    const coords = getCoordsArray(json);

    const idx = Number(index);
    const newCoord = [Number(position.lng), Number(position.lat)];
    if (Number.isNaN(idx) || idx < 0 || idx > coords.length) {
      coords.push(newCoord);
    } else {
      coords.splice(idx, 0, newCoord);
    }

    await write(dataId, json);
  } catch (err) {
    console.error("pushMarkerAdded error:", err);
    throw err;
  }
}
