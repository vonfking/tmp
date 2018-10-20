import { Component, OnInit } from '@angular/core';
import {WebService} from '../../../service/web.service';

@Component({
  selector: 'app-showdsa',
  templateUrl: './showdsa.component.html',
  styleUrls: ['./showdsa.component.css'],
  providers: [WebService]
})
export class ShowdsaComponent implements OnInit {

  constructor(private webService: WebService) { }
  dataSet = [];
  ngOnInit() {
  }
  submitForm() {
    let mml="SHOW DSANODE STATUS";
    //this.webService.execMML(mml).then(
    //  val => {
    //    this.dataSet =val;
    //  }
    //);   
    //this.webService.execMML(mml).subscribe(
    //  val => {
    //    this.dataSet =<any[]>val;
    //  });   
  }
}
