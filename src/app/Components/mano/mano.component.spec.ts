import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManoComponent } from './mano.component';

describe('ManoComponent', () => {
  let component: ManoComponent;
  let fixture: ComponentFixture<ManoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
