import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export interface OcrResult {
  text: string;
  source: 'pdf' | 'image' | 'txt';
}

export async function extractTextFromFile(
  file: File,
  onProgress?: (stage: string) => void
): Promise<OcrResult> {
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    onProgress?.('Reading plain text file...');
    const text = await file.text();
    return { text, source: 'txt' };
  }

  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    return extractFromPdf(file, onProgress);
  }

  if (file.type.startsWith('image/')) {
    return extractFromImage(file, onProgress);
  }

  throw new Error(`Unsupported file type: ${file.type || file.name}`);
}

async function extractFromPdf(
  file: File,
  onProgress?: (stage: string) => void
): Promise<OcrResult> {
  onProgress?.('Loading PDF document...');
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  const totalPages = pdf.numPages;

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.(`Extracting text from page ${i} of ${totalPages}...`);
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return { text: fullText.trim(), source: 'pdf' };
}

async function extractFromImage(
  file: File,
  onProgress?: (stage: string) => void
): Promise<OcrResult> {
  onProgress?.('Initializing OCR engine...');
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng');

  onProgress?.('Running OCR on image...');
  const { data } = await worker.recognize(file);
  await worker.terminate();

  return { text: data.text.trim(), source: 'image' };
}
