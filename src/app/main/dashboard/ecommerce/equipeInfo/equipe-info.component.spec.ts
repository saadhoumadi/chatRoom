import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipeInfoComponent } from './equipe-info.component';

describe('EquipeInfoComponent', () => {
  let component: EquipeInfoComponent;
  let fixture: ComponentFixture<EquipeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipeInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
