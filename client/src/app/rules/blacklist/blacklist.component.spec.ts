/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BlacklistComponent } from './blacklist.component';
import { OptionalCommonComponent } from '../common/optional/optional.component';
import { RequiredCommonComponent } from '../common/required/required.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { AlertComponent } from '../alert/alert.component';
import { EmailComponent } from '../alert/email/email.component';
import { HipchatComponent } from '../alert/hipchat/hipchat.component';
import { RulesService } from '../rules.service';
import { CollapseModule } from 'ng2-bootstrap';
import * as Mockito from 'ts-mockito';
import * as Rx from 'rxjs';


describe('BlacklistComponent', () => {
  let component: BlacklistComponent;
  let rulesService: RulesService;
  let fixture: ComponentFixture<BlacklistComponent>;
  let model = {
      ruleData: { 
        compare_key: 'testCompareKey',
        blacklist: ['test1','test2']
      }
  }
  beforeEach(async(() => {
    rulesService = Mockito.mock(RulesService);
    TestBed.configureTestingModule({
      declarations: [
          BlacklistComponent,
          OptionalCommonComponent,
          RequiredCommonComponent,
          AlertsComponent,
          AlertComponent,
          EmailComponent
      ],
      imports: [
        ReactiveFormsModule,
        CollapseModule
      ],
      providers: [
        FormBuilder,
        { provide: RulesService, useValue: Mockito.instance(rulesService) }
      ]
    })
    
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          RequiredCommonComponent, 
          OptionalCommonComponent, 
          AlertsComponent,
          AlertComponent,
          EmailComponent
        ],
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistComponent);
    component = fixture.componentInstance;
    component.model = model;
    fixture.detectChanges();
  });

  it('should create and initialize', () => {
    expect(component).toBeTruthy();
    expect(component.ruleForm.controls['compareKey'].value).toEqual('testCompareKey');
    expect(component.ruleForm.controls['blacklist'].value).toEqual('test1,test2');
  });

  it('should update model compare_key on change', () => {
    component.ruleForm.controls['compareKey'].setValue('newCompareKey');
    expect(component.model['ruleData']['compare_key']).toEqual('newCompareKey');
  });

  it('should update model blacklist on change', () => {
    component.ruleForm.controls['blacklist'].setValue('test1,test2,test3');
    expect(component.model['ruleData']['blacklist']).toEqual(['test1','test2','test3']);
  });

});
