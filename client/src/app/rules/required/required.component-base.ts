import { Input } from '@angular/core';
import { BaseFormComponent } from '../../shared/base-form.component';
import { FormBuilder, Validators } from '@angular/forms';

export class RequiredBaseComponent extends BaseFormComponent {

  @Input()
  public model = { }

  constructor(protected builder: FormBuilder ){
    super();
  }

  protected buildCommonForm() {
    return this.builder.group({
      index: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      alert: ['', Validators.required]
    })
  }
}
