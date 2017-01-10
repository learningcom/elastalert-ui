/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DebugElement, ComponentFactoryResolver } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EditComponent } from './edit.component';
import { CardinalityComponent } from '../cardinality/cardinality.component'
import { AnyComponent } from '../any/any.component';
import { RequiredCommonComponent } from '../common/required/required.component';
import { OptionalCommonComponent } from '../common/optional/optional.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { AlertComponent } from '../alert/alert.component';
import { EmailComponent } from '../alert/email/email.component';
import { HipchatComponent } from '../alert/hipchat/hipchat.component';
import { RulesService } from '../rules.service';
import * as TypeMoq from "typemoq";
import * as Rx from 'rxjs';


describe('CreateComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let rulesService: TypeMoq.IMock<RulesService>;

  beforeEach(async(() => {
    rulesService = TypeMoq.Mock.ofType(RulesService);
    let ruleNames = [
      'ruleName1',
      'ruleName2'
    ]
    let rule = {
      type: 'any'
    }
    rulesService.setup(x => x.ruleNames()).returns(() => new Rx.Observable<string[]>((observer: Rx.Subscriber<string[]>) => {
      observer.next(ruleNames);
    }));
    rulesService.setup(x => x.loadRule(TypeMoq.It.isAnyString())).returns(() => new Rx.Observable<Object>((observer: Rx.Subscriber<Object>) => {
      observer.next(rule);
    }));

    TestBed.configureTestingModule({
      declarations: [
        EditComponent,
        CardinalityComponent, 
        AnyComponent,
        OptionalCommonComponent,
        RequiredCommonComponent,
        AlertsComponent,
        AlertComponent,
        EmailComponent,
        HipchatComponent
      ],
      imports: [ReactiveFormsModule],
      providers: [
        ComponentFactoryResolver,
        { provide: RulesService, useValue: rulesService.object }
      ]
    })

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          CardinalityComponent, 
          AnyComponent, 
          OptionalCommonComponent, 
          RequiredCommonComponent,
          AlertsComponent,
          AlertComponent,
          EmailComponent,
          HipchatComponent
        ],
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize', () => {
    expect(component).toBeTruthy();
    expect(component.ruleComponentRef.componentType).toBe(AnyComponent);
    expect(component.rules).toEqual([
      'ruleName1',
      'ruleName2'
    ])
  });

  it('should update child component when rule type is changed', async(() => {
    component.ruleComponentRef.instance.typeUpdated.emit('cardinality');
    expect(component.ruleComponentRef.componentType).toBe(CardinalityComponent);
  }));

  it('should update rule when selected rule changes', async(() => {
    rulesService.setup(x => x.loadRule(TypeMoq.It.isAnyString())).returns(() => new Rx.Observable<Object>((observer: Rx.Subscriber<Object>) => {
      observer.next({type: 'cardinality'});
    }));
    
    component.ruleSelect.setValue('ruleName2');
    
    expect(component.model['ruleData']).toEqual({type: 'cardinality'});
    rulesService.verify(x => x.loadRule(TypeMoq.It.isValue<string>("ruleName2")), TypeMoq.Times.atLeastOnce())
  }));
});
