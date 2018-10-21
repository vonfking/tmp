import { Component, OnInit } from '@angular/core';
import {WebService} from '../../../service/web.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-showdsa',
  templateUrl: './showdsa.component.html',
  styleUrls: ['./showdsa.component.css'],
  providers: [WebService]
})
export class ShowdsaComponent implements OnInit {

  constructor(
    private webService: WebService,
    private fb: FormBuilder) { }
  dataSet = [];
  validateForm: FormGroup;
  tenantId: string="1";
  dsaId: string="1060";
  
  ngOnInit() {
    this.validateForm = this.fb.group({
      tenantId: [this.tenantId, [Validators.required]],
      dsaId: [this.dsaId, [Validators.required]],
    });
  }

  Search() {
    let mml="SHOW DSANODE STATUS";
    let id1 = this.validateForm.get('tenantId').value;
    let id2 = this.validateForm.get('dsaId').value;

    if (id1 != "" && id2 != "")
    {
      mml = mml+":TENANTID="+id1+",DSAID="+id2;
    }
    else if(id1 != "")
    {
      mml = mml+":TENANTID="+id1;
    } 
    else if(id2 != "")
    {
      mml = mml+":DSAID="+id2;
    } 
    alert(mml);
    //this.webService.execMML(mml).then(
    //  val => {
    //    this.dataSet =val;
    //  }
    //);   
    this.webService.execMML(mml).subscribe(
      val => {
        this.dataSet =<any[]>val;
      });   
  }
}
