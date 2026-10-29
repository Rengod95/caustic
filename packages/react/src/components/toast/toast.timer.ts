/** The clock a DismissTimer runs on. Injected by tests so pause and resume can be checked without real time. */
export interface DismissClock {
  now(): number;
  setTimeout(run: () => void, ms: number): unknown;
  clearTimeout(id: unknown): void;
}

const system: DismissClock = {
  now: () => performance.now(),
  setTimeout: (run, ms) => setTimeout(run, ms),
  clearTimeout: id => clearTimeout(id as ReturnType<typeof setTimeout>),
};

/**
 * Auto-dismiss countdown that keeps the time it has left. pause() stops it and remembers the rest; start() runs the rest.
 * So leaving hover or focus resumes the countdown where it stopped instead of starting the full time again. Fires once.
 */
export class DismissTimer {
  private left: number;
  private due = 0;
  private id: unknown = undefined;
  private finished = false;
  private readonly fire: () => void;
  private readonly clock: DismissClock;

  constructor(ms: number, fire: () => void, clock: DismissClock = system) {
    this.left = ms;
    this.fire = fire;
    this.clock = clock;
  }

  /** Runs the time that is left. A no-op while running, after it fired, or after stop(). */
  start(): void {
    if (this.finished || this.id !== undefined) return;
    this.due = this.clock.now() + this.left;
    this.id = this.clock.setTimeout(() => {
      this.id = undefined;
      this.left = 0;
      this.finished = true;
      this.fire();
    }, this.left);
  }

  /** Stops the countdown and keeps the time left. A no-op when it is not running. */
  pause(): void {
    if (this.id === undefined) return;
    this.clock.clearTimeout(this.id);
    this.id = undefined;
    this.left = Math.max(0, this.due - this.clock.now());
  }

  /** Stops for good: the timer never fires again. */
  stop(): void {
    this.pause();
    this.finished = true;
  }
}
