import fs from 'fs';
import path from 'path';
import { generateTs } from './generateTs';
import { OpenAPI } from './model';

describe('generateTs', () => {
  ["01", "02"].forEach(testId => it('should return the expected typescript code', () => {
    const inputPath = path.join(__dirname, `test-${testId}/input.json`);
    const inputContent = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

    const resultPath = path.join(__dirname, `test-${testId}/result.ts`);
    const resultContent = fs.readFileSync(resultPath, 'utf8');

    const result = generateTs(inputContent as OpenAPI, "projects");
    // console.log(result)
    expect(resultContent).toBe(result);
  }));
});
