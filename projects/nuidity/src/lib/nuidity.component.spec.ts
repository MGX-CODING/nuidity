import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuidityComponent } from './nuidity.component';

describe('NuidityComponent', () => {
  let component: NuidityComponent;
  let fixture: ComponentFixture<NuidityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuidityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
