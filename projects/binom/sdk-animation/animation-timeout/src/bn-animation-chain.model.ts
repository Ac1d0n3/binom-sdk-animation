import { BnAnimationStep } from "./bn-animation-step.model";

export interface BnAnimationChain {
    steps: BnAnimationStep[];
    index: number;
    timeoutId: number | null;
    isRunning: boolean;
  }