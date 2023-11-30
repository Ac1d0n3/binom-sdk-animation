export interface BnAnimationStep {
    time: number;
    reference: any;
    startState?: { [key: string]: string };
    endState?: { [key: string]: string };
    callback?: () => void;
  }