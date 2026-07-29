import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Ensures the data directory exists.
 */
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

/**
 * Reads and parses a JSON file safely from /data directory.
 */
export async function readJsonData<T>(fileName: string): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`[JSON DB] Error reading ${fileName}:`, error);
    throw new Error(`Failed to read data file: ${fileName}`);
  }
}

/**
 * Atomically writes data to a JSON file in /data directory using a temporary file.
 */
export async function writeJsonData<T>(fileName: string, data: T): Promise<boolean> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);
  const tempPath = `${filePath}.tmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(tempPath, jsonString, 'utf-8');
    await fs.rename(tempPath, filePath);
    return true;
  } catch (error) {
    console.error(`[JSON DB] Error writing ${fileName}:`, error);
    try {
      await fs.unlink(tempPath);
    } catch {}
    throw new Error(`Failed to write data file: ${fileName}`);
  }
}
