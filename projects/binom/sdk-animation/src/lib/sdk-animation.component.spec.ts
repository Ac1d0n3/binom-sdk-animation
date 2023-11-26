import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkAnimationComponent } from './sdk-animation.component';

describe('SdkAnimationComponent', () => {
  let component: SdkAnimationComponent;
  let fixture: ComponentFixture<SdkAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdkAnimationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SdkAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
