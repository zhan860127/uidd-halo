interface Filter1D {
  input(i: number): number;
}

export class MovingAverageFilter implements Filter1D {
  window: number;
  memory: number[] = [];
  #sum: number = 0;

  constructor(window: number) {
    if (window <= 0 || window % 1) {
      throw new Error('window length must be a positive integer');
    }
    this.window = window;
  }

  input(i: number): number {
    if (this.memory.length === this.window) {
      this.#sum -= this.memory.shift()!;
    }
    this.memory.push(i);
    this.#sum += i;
    return this.#sum / this.memory.length;
  }
}
