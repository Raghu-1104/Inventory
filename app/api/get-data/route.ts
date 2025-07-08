// If you see type errors for 'fs', 'path', or 'process', run: npm install --save-dev @types/node
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'data.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(file);
    return NextResponse.json(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return NextResponse.json([]);
  }
} 