import { Component, OnInit,ViewChild, ViewContainerRef, ComponentFactory,
  ComponentRef, ComponentFactoryResolver, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { NzFormatEmitEvent, NzTabChangeEvent } from 'ng-zorro-antd';
import { ShowdsaComponent } from './showdsa/showdsa.component';
import { ShowdstComponent } from './showdst/showdst.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit,OnDestroy  {

  ngOnInit() {
  }
  isCollapsed = false;
  selectedIndex = 0;

  panels = [
    {
      active    : true,
      name      : 'System Monitor',
      treeData: [
        {
          title: 'Topo Managemant', 
          key: '1',
          children: [
            { title: 'Show Dsa Status', key: '1001', isLeaf: true},
            { title: 'Show Dst Status', key: '1002', isLeaf: true}
          ]
        },
        {
          title: 'Data Managemant', 
          key: '2',
          children: [
            { title: 'Locate User', key: '2001', isLeaf: true },
          ]
        }
      ]
    },
    {
      active: false,
      name  : 'Daily Maintance',
      treeData: [
        {
          title: 'Data Check', 
          key: '3',
          children: [
            { title: 'Online Data Check', key: '3001', isLeaf: true },
            { title: 'Backup Data Check', key: '3002', isLeaf: true}
          ]
        }
      ]      
    },
    {
      active: false,
      name  : 'Important Operation',
      treeData: [
        {
          title: 'Data Migration', 
          key: '4',
          isLeaf: true
        },
        {
          title: 'Data Maintainance', 
          key: '5',
          children: [
            { title: 'Batch Operation', key: '5001', isLeaf: true },
            { title: 'Online Data Correction', key: '5002', isLeaf: true },
            { title: 'LDAP Command Creation', key: '5003', isLeaf: true },
          ]
        }
      ]
    }
  ];
  tabs = [];//[{"name":"Home", "init":true}];//{name, init}

  addTab(tabName: string):number{
    return this.tabs.push({"name":tabName, "init":false});
  }
  searchTab(tabName: string):number{
    for (var _i=0; _i<this.tabs.length; _i++)
    {
      if (this.tabs[_i].name == tabName)
      {
        return _i;
      }
    }
    return -1;
  }
  closeTab(tabName: string): void {
    var _i=this.searchTab(tabName);
    if (_i != -1)
      this.tabs.splice(_i, 1);
  }
  nzTreeClick(event: NzFormatEmitEvent): void {
    //console.log(event);
    if (event.eventName === 'click')
    {
      var tabTitle="";
       if (event.node.key == '1001')
      {
        tabTitle = "DSAStatus";
      }
      else if (event.node.key == '1002')
      {
        tabTitle = "DSTStatus"
      }
      if (tabTitle == "")return;
      var index = this.searchTab(tabTitle);
      if (index>=0)
      {
        this.selectedIndex = index+1;
        //this.createComponent(tabTitle);
      }
      else
      {
        this.selectedIndex =  this.addTab(tabTitle);
        //this.createComponent(tabTitle);
      }      
    }
  }

  //showdsaComponentRef: ComponentRef<ShowdsaComponent>;
  //showdstComponentRef: ComponentRef<ShowdstComponent>;
  
  constructor(private resolver: ComponentFactoryResolver) { }

  @ViewChildren("tabContainer", { read: ViewContainerRef }) tabContainer: QueryList<ViewContainerRef>;

  ngOnDestroy() {
    //this.showdsaComponentRef.destroy();
    //this.showdstComponentRef.destroy();
  }
  nzTabChange(event: NzTabChangeEvent):void{
    console.log(event);
    var index = event.index;
    if (index == 0)
      return;
    index = index - 1;
    if (this.tabs[index].init)
      return;
    this.tabs[index].init = true;
    var tmp:ViewContainerRef
    tmp = this.tabContainer.find(function(_element,i){return i==index});
    console.log(tmp);
    tmp.clear();
    if (this.tabs[index].name == "DSAStatus")
    {
      let factory: ComponentFactory<ShowdsaComponent> =
        this.resolver.resolveComponentFactory(ShowdsaComponent);
      tmp.createComponent(factory);
    }
    else if (this.tabs[index].name == "DSTStatus")
    {
      let factory: ComponentFactory<ShowdstComponent> =
        this.resolver.resolveComponentFactory(ShowdstComponent);
      tmp.createComponent(factory);
    }
  }
}
