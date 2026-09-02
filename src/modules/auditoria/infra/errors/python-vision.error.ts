export class PythonVisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PythonVisionError';
  }
}
