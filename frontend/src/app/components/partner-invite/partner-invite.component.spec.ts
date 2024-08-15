import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerInviteComponent } from './partner-invite.component';

describe('PartnerInviteComponent', () => {
  let component: PartnerInviteComponent;
  let fixture: ComponentFixture<PartnerInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerInviteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartnerInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
