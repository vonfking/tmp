import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ShowdsaComponent } from './showdsa/showdsa.component';
import { ShowdstComponent } from './showdst/showdst.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  entryComponents: [ShowdsaComponent, ShowdstComponent],
  declarations: [MainComponent, ShowdsaComponent, ShowdstComponent]
})
export class MainModule { }
