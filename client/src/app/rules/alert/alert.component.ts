import { Component, OnInit, Input , ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertService } from './alert.service';
import { Observable } from 'rxjs/Observable';
import { EmailComponent } from './email/email.component';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  providers: [AlertService]
})
export class AlertComponent implements OnInit {
  @Input('group') 
  alertForm: FormGroup;

  @Input()
  model: Object;

  @ViewChild('alertParent', {read: ViewContainerRef})
  alertParent: ViewContainerRef;

  public alertTypes: string[];

  constructor(private alertService: AlertService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    setTimeout(() => {
      while(true) {
        if(this.alertParent) {
          let alertType = this.alertForm.controls['type'].value;
          let childComponent = this.resolveAlertTypeComponent(alertType);
          let componentRef = this.alertParent.createComponent(childComponent);
          componentRef.instance.model = this.model;
        }
        break;
      }
    }, 1);

    this.alertTypes = this.alertService.alertTypes;
  }

  private resolveAlertTypeComponent(alertType: string): ComponentFactory<any> {
    switch (alertType) {
      case 'email':
        return this.componentFactoryResolver.resolveComponentFactory(EmailComponent);
      default:
        return null;
    }
  }

}
