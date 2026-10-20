import { Transform } from 'stream';
import { Decompress } from 'fzstd';

export class ZstdTransform extends Transform {
  private decoder: any;

  constructor() {
    super();
    this.decoder = new Decompress((chunk: Uint8Array) => {
      this.push(Buffer.from(chunk));
    });
  }

  _transform(chunk: any, encoding: string, callback: Function) {
    try {
      this.decoder.push(new Uint8Array(chunk));
      callback();
    } catch (err) {
      callback(err);
    }
  }
}
