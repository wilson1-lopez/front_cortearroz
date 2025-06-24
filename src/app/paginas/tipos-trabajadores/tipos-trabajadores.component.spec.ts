import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposTrabajadoresComponent } from './tipos-trabajadores.component';

describe('TiposTrabajadoresComponent', () => {
  let component: TiposTrabajadoresComponent;
  let fixture: ComponentFixture<TiposTrabajadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposTrabajadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposTrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
