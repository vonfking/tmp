import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-showdst',
  templateUrl: './showdst.component.html',
  styleUrls: ['./showdst.component.css']
})
export class ShowdstComponent implements OnInit {

  formErrors = {
    'userName': '',
    'password': '',
};

validationMessages = {
    'userName': { 'required': '代码不能为空' },
    'password': { 'required': '名称不能为空' }
};

formTitle: string = "Login";

validateForm: FormGroup;
dstid: string="admin";
dsaid: string="admin";

_logining = false;

constructor(private fb: FormBuilder) {
}

ngOnInit() {
    this.validateForm = this.fb.group({
        dstid: [this.dstid, [Validators.required]],
        dsaid: [this.dsaid, [Validators.required]],
    });
}


submitForm() {
    const loginData = {
        dstid: this.validateForm.get('dstid').value,
        dsaid: this.validateForm.get('dsaid').value
    };
    this._logining = true;
    //this.webService.login(loginData).subscribe(
    //  val => {
    //        this._logining = false;
    //        this.router.navigateByUrl('/main');
    //});
    //this.webService.login(loginData).then(
    //  res => {
    //    this.router.navigateByUrl('/main');
    //  }
    //)
    //this.router.navigateByUrl('/main');
}

}
