import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostBinding, HostListener, ElementRef } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { startWith, delay, filter, takeWhile } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { trigger } from '@angular/animations';
import { BnAnimateOnScrollService } from '../bn-animate-on-scroll.service'; 
import { beat, bounce, headShake, heartBeat, pulse, rubberBand, shake, swing, wobble, jello, tada, flip } from '@binom/sdk-animation/animation-effects';
import { bumpIn, bounceIn, fadeIn, flipIn, jackInTheBox, landing, rollIn, zoomIn } from '@binom/sdk-animation/animation-in';
import { bounceOut, fadeOut, hinge, rollOut, zoomOut } from '@binom/sdk-animation/animation-out';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
export type bnAnimateScrollSpeed = 'slower'|'slow'|'normal'|'fast'|'faster';
export type bnAnimations =
  'beat'|'bounce'|'flip'|'headShake'|'heartBeat'|'jello'|'pulse'|'rubberBand'|'shake'|'swing'|'tada'|'wobble'|
  'bumpIn'|'bounceIn'|'bounceInDown'|'bounceInLeft'|'bounceInUp'|'bounceInRight'|'fadeIn'|'fadeInRight'|'fadeInLeft'|'fadeInUp'|'fadeInDown'|'flipInX'|'flipInY'|'jackInTheBox'|'landing'|'rollIn'|'zoomIn'|'zoomInDown'|'zoomInLeft'|'zoomInUp'|'zoomInRight'|
  'bounceOut'|'bounceOutDown'|'bounceOutUp'|'bounceOutRight'|'bounceOutLeft'|'fadeOut'|'fadeOutRight'|'fadeOutLeft'|'fadeOutDown'|'fadeOutUp'|'hinge'|'rollOut'|'zoomOut'|'zoomOutDown'|'zoomOutRight'|'zoomOutUp'|'zoomOutLeft';

@Component({
  selector: '[bnAos]',
  template: '<ng-content></ng-content>',
  standalone:true,
  imports:[CommonModule,ScrollingModule],
  animations: [ trigger('animate', [
    ...beat,...bounce,...flip,...headShake,...heartBeat,...jello,...pulse,...rubberBand,...shake,...swing,...tada,...wobble,
    ...bumpIn,...bounceIn,...fadeIn,...flipIn,...jackInTheBox,...landing,...rollIn,...zoomIn,
    ...bounceOut,...fadeOut,...hinge,...rollOut,...zoomOut
  ])]
})

export class BnAnimateOnScrollComponent implements OnInit, OnDestroy {

  private replay$ = new Subject<boolean>();
  private sub!: Subscription;
  private timing!: string;
  private delay!: string;
  public animating = false;
  public animated = false;

  constructor(
    private elm: ElementRef, 
    private scroll: BnAnimateOnScrollService
  ) {}

  @HostBinding('@animate') private trigger:any;

  private get idle() { return { value: `idle-${this.animate}` }; }
  private get play() {
    const params = {timing:'1s',delay:'0.5ms'};
    if(!!this.timing) { params['timing'] = this.timing; }
    if(!!this.delay) { params['delay'] = this.delay; }
    return { value: this.animate, params };
  }

  @Input('bnAos') animate!: bnAnimations;

  @Input() set speed(speed: bnAnimateScrollSpeed) {
    this.timing = { slower: '3s', slow: '2s', normal: '1s', fast: '500ms', faster: '300ms'
    }[speed || 'normal'];
  }

  @Input('delay') set postpone(delay: string) {
    const value = coerceNumberProperty(delay, 0);
    if(value) { this.delay = `${value}ms`;}
    else {this.delay = /^\d+(?:ms|s)$/.test(delay) ? delay : '';}
  }

  @Output() start = new EventEmitter<void>();
  @HostListener('@animate.start')
  private animationStart() { this.animating = true; this.animated = false; this.start.emit(); }

  @Output() done = new EventEmitter<void>();
  @HostListener('@animate.done')
  private animationDone() { this.animating = false; this.animated = true; this.done.emit(); }

  @Input('paused') set pauseAnimation(value: boolean) { this.paused = coerceBooleanProperty(value); }
  public paused: boolean = false;

  @Input() threshold: number = 0.5;

  @Input('once') set aosOnce(value: boolean) { this.once = coerceBooleanProperty(value); }
  public once: boolean = false;

  @Input() set replay(replay: any) {
    if(!!this.trigger && coerceBooleanProperty(replay)) {
      this.trigger = this.idle;
      this.replay$.next(true);
    }
  }

  ngOnInit() {
    this.trigger = this.idle;
    this.sub = this.replay$.pipe(
      delay(0),startWith(!this.paused),this.scroll.trigger(this.elm, this.threshold),
      filter( trigger => !this.animating ),
      takeWhile(trigger => !trigger || !this.once, true),
    ).subscribe( trigger => {
      this.trigger = trigger ? this.play : this.idle;
    });
  }

  ngOnDestroy() { if(this.sub) this.sub.unsubscribe(); }
}
