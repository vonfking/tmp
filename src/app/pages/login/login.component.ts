import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {WebService} from '../../service/web.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [WebService]
})
export class LoginComponent implements OnInit {

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
userName: string="admin";
password: string="admin";

_logining = false;

constructor(private fb: FormBuilder,
  private router: Router,
  private webService: WebService) {
}

ngOnInit() {
    this.validateForm = this.fb.group({
        userName: [this.userName, [Validators.required]],
        password: [this.password, [Validators.required]],
    });
}


submitForm() {
    const loginData = {
        user: this.validateForm.get('userName').value,
        pass: this.validateForm.get('password').value
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
    this.router.navigateByUrl('/main');
}

}
