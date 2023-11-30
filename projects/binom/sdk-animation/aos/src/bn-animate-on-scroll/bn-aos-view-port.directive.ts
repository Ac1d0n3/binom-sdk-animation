
import { Directive, Input, ElementRef, forwardRef, NgZone } from '@angular/core';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/overlay';
import { coerceBooleanProperty, coerceNumberProperty,BooleanInput } from '@angular/cdk/coercion';
import { BnAnimateOnScrollService } from '../bn-animate-on-scroll.service';

@Directive({
  selector: '[bnAosViewPort]',
  standalone:true,
  providers: [
    { provide:  BnAnimateOnScrollService, useExisting: forwardRef(() => BnAosViewPortDirective) },
  ]
})
export class BnAosViewPortDirective  extends  BnAnimateOnScrollService  {

  @Input() offsetTop!: number;
  @Input() offsetLeft!: number;
  @Input() offsetBottom!: number;
  @Input() offsetRight!: number;

  private _useElAsViewPort:boolean = false;
  get useElAsViewPort():boolean{ return this._useElAsViewPort; }
  @Input() set useElAsViewPort(val:BooleanInput){ this._useElAsViewPort = coerceBooleanProperty(val); }
  
  override get viewRect(): any {
    const useView = this.useElAsViewPort ? this.el.nativeElement.getBoundingClientRect() : this.viewPort.getViewportRect();
    const top = useView.top + coerceNumberProperty(this.offsetTop, 0);
    const left = useView.left + coerceNumberProperty(this.offsetLeft, 0);
    const bottom = useView.bottom + coerceNumberProperty(this.offsetBottom, 0);
    const right = useView.right + coerceNumberProperty(this.offsetRight, 0);
    return { top, left, bottom, right, height: bottom - top, width: right - left };
  }

  constructor(private el: ElementRef<HTMLElement>, override viewPort: ViewportRuler, scroll: ScrollDispatcher, zone: NgZone) {
    super(scroll, viewPort, zone);
  }
}