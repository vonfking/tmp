import { NgModule } from '@angular/core';
import {FlexLayoutModule} from "@angular/flex-layout";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_ICONS } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import { NzDemoTabsCardTopComponent } from './app.component';

import { NZ_I18N, en_US } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { SplitComponent } from './split.component';
import { SplitAreaDirective } from './splitArea.directive';
registerLocaleData(en);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, ReactiveFormsModule, NgZorroAntdModule, FlexLayoutModule, BrowserAnimationsModule ],
  declarations: [ NzDemoTabsCardTopComponent, SplitComponent, SplitAreaDirective ],
  bootstrap:    [ NzDemoTabsCardTopComponent ],
  providers   : [ { provide: NZ_I18N, useValue: en_US }, { provide: NZ_ICONS, useValue: icons } ]
})
export class AppModule { }
