import { Injectable } from '@angular/core';
import { BnAnimationStep } from './bn-animation-step.model';
import { BnAnimationChain } from './bn-animation-chain.model';

@Injectable({
  providedIn: 'root',
})
export class BnAnimationService {
  private animationChains: BnAnimationChain[] = [];
  private currentIndex = -1;

  createAnimationChain(animationChain: BnAnimationStep[]): BnAnimationChain {
    const newChain: BnAnimationChain = {
      steps: animationChain,
      index: -1,
      timeoutId: null,
      isRunning: false,
    };
    this.animationChains.push(newChain);
    return newChain;
  }

  updateReferencesInChain(animationChain: BnAnimationChain, newReference: any): void {
    animationChain.steps.forEach((step) => {
      step.reference = newReference; // Aktualisiere die Referenz in jedem Schritt
    });
  }

  updateAnimationChain(animationChain: BnAnimationChain, newAnimationChain: BnAnimationStep[]): void {
    animationChain.steps = newAnimationChain;
    animationChain.index = -1;
  }

  removeAnimationChain(animationChain: BnAnimationChain): void {
    const index = this.animationChains.indexOf(animationChain);
    if (index !== -1) {
      this.animationChains.splice(index, 1); // Entferne die AnimationChain aus dem Array
    }
  }

  startAnimation(chain: BnAnimationChain): void {
    if (chain.index < chain.steps.length - 1 && !chain.isRunning) {
      chain.isRunning = true;
      chain.index++;
      this.runNextAnimation(chain);
    }
  }

  pauseAnimation(chain: BnAnimationChain): void {
    if (chain.isRunning && chain.timeoutId !== null) {
      if (chain.index >= 0 && chain.index < chain.steps.length) {
        const currentStep = chain.steps[chain.index];
        if (currentStep.endState) {
          this.setCssClasses(currentStep.reference, currentStep.endState);
        }
      }
      clearTimeout(chain.timeoutId);
      chain.timeoutId = null;
      chain.isRunning = false;
    }
  }

  resumeAnimation(chain: BnAnimationChain): void {
    if (!chain.isRunning && chain.index < chain.steps.length - 1) {
      chain.isRunning = true;
      chain.index++; // Einen Schritt weitergehen
      this.runNextAnimation(chain);
    }
  }

  resetAnimation(chain: BnAnimationChain): void {
    if (chain) {
      if (chain.isRunning) {
        this.pauseAnimation(chain); // Pause, falls die Animation läuft
      }
      if (chain.index >= 0 && chain.index < chain.steps.length) {
        const lastStep = chain.steps[chain.index];
        if (lastStep.endState) {
          this.setCssClasses(lastStep.reference, lastStep.endState);
        }
      }
      chain.index = -1;
    }
  }

  private runNextAnimation(chain: BnAnimationChain): void {
    if (chain.index < chain.steps.length) {
      const animationStep = chain.steps[chain.index];

      if (animationStep.startState) {
        this.setCssClasses(animationStep.reference, animationStep.startState);
      }
      chain.timeoutId = setTimeout(() => {
        
        if (animationStep.callback && typeof animationStep.callback === 'function') {
          animationStep.callback();
        }
        if (animationStep.endState) {
          this.setCssClasses(animationStep.reference, animationStep.endState);
        }
        chain.index++;
        this.runNextAnimation(chain);
      }, animationStep.time);
    } else {
      chain.timeoutId = null;
      chain.isRunning = false;
    }
  }

  private setCssClasses(reference: any, classes: { [key: string]: string }): void {
    for (const key in classes) {
      if (classes.hasOwnProperty(key)) {
        reference[key] = classes[key];
        console.log(reference[key],' => ', classes[key])
      }
    }
  }


  private curTyperText = '';
  private curTyperIndex = 0;

  typeText(text: string, typingSpeed: number, callback: (result: string) => void) {
    this.curTyperText = '';
    this.curTyperIndex = 0;

    const typeNextCharacter = () => {
      if (this.curTyperIndex < text.length) {
        this.curTyperText += text.charAt(this.curTyperIndex);
        this.curTyperIndex++;
        callback(this.curTyperText);
        setTimeout(typeNextCharacter, typingSpeed);
      }
    };

    typeNextCharacter();
  }


  
}