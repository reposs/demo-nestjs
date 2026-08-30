import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class JsonStorageService {
  private readonly rootDir = path.join(process.cwd(), 'data');

  private resolveFile(fileName: string) {
    if (!existsSync(this.rootDir)) {
      mkdirSync(this.rootDir, { recursive: true });
    }

    return path.join(this.rootDir, fileName);
  }

  read<T = any>(fileName: string, fallback: T[] = []): T[] {
    const fullPath = this.resolveFile(fileName);

    if (!existsSync(fullPath)) {
      writeFileSync(fullPath, JSON.stringify(fallback, null, 2), 'utf8');
      return fallback;
    }

    const content = readFileSync(fullPath, 'utf8').trim();

    if (!content) {
      writeFileSync(fullPath, JSON.stringify(fallback, null, 2), 'utf8');
      return fallback;
    }

    return JSON.parse(content) as T[];
  }

  write<T = any>(fileName: string, data: T[]): T[] {
    const fullPath = this.resolveFile(fileName);
    writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
    return data;
  }

  upsert<T extends { id?: string }>(
    fileName: string,
    item: T,
    fallback: T[] = [],
  ): T[] {
    const items = this.read<T>(fileName, fallback);
    const index = items.findIndex((i) => i.id === item.id);

    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }

    return this.write(fileName, items);
  }
}
