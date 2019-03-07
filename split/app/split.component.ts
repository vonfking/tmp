import { Component, Input, ChangeDetectionStrategy, Renderer2, AfterViewInit, OnDestroy, ElementRef, ViewChildren, QueryList } from '@angular/core';

import { SplitAreaDirective } from './splitArea.directive';

interface IArea {
    component: SplitAreaDirective;
    size: number;
    oldsize: number;
    order: number;
    closed:boolean;
}
interface IPoint {
    x: number;
    y: number;
}
@Component({
    selector: 'as-split',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [`./split.component.scss`],
    template: `
        <ng-content></ng-content>
        <ng-template ngFor [ngForOf]="displayedAreas" let-index="index" let-last="last">
            <div *ngIf="last === false" 
                #gutterEls
                class="as-split-gutter"
                [style.flex-basis.px]="gutterSize"
                [style.order]="index*2+1"
                (mousedown)="startDragging($event, index*2+1, index+1)">
                <div *ngIf="displayedAreas[index].component.closable===true 
                         || displayedAreas[index+1].component.closable===true"
                    class="as-split-gutter-icon" 
                    (click)="clickGutter($event, index*2+1, index+1)"
                    (mousedown)="$event.stopPropagation();$event.preventDefault()">
                </div>
            </div>
        </ng-template>`,
})
export class SplitComponent implements AfterViewInit, OnDestroy {

    private _direction: 'horizontal' | 'vertical' = 'horizontal';

    @Input() set direction(v: 'horizontal' | 'vertical') {
        this._direction = (v === 'vertical') ? 'vertical' : 'horizontal';
        
        this.renderer.addClass(this.elRef.nativeElement, `is-${ this._direction }`);
        this.renderer.removeClass(this.elRef.nativeElement, `is-${ (this._direction === 'vertical') ? 'horizontal' : 'vertical' }`);
        
        this.build(false, false);
    }
    
    get direction(): 'horizontal' | 'vertical' {
        return this._direction;
    }
    
    ////

    private _gutterSize: number = 11;

    @Input() set gutterSize(v: number) {
        v = Number(v);
        this._gutterSize = (!isNaN(v) && v > 0) ? v : 11;

        this.build(false, false);
    }
    
    get gutterSize(): number {
        return this._gutterSize;
    }
    
    ////

    private _useTransition: boolean = false;

    @Input() set useTransition(v: boolean) {
        this._useTransition = (typeof(v) === 'boolean') ? v : (v === 'false' ? false : true);

        if(this._useTransition) this.renderer.addClass(this.elRef.nativeElement, 'is-transition');
        else                    this.renderer.removeClass(this.elRef.nativeElement, 'is-transition');
    }
    
    get useTransition(): boolean {
        return this._useTransition;
    }
    
    ////

    private _disabled: boolean = false;
    
    @Input() set disabled(v: boolean) {
        this._disabled = (typeof(v) === 'boolean') ? v : (v === 'false' ? false : true);

        if(this._disabled)  this.renderer.addClass(this.elRef.nativeElement, 'is-disabled');
        else                this.renderer.removeClass(this.elRef.nativeElement, 'is-disabled');
    }
    
    get disabled(): boolean {
        return this._disabled;
    }

    ////

    private isDragging: boolean = false;
    private currentGutterNum: number = 0;
    private startPoint: IPoint | null = null;
    private endPoint: IPoint | null = null;

    public readonly displayedAreas: Array<IArea> = [];
    
    private readonly dragListeners: Array<Function> = [];
    private readonly dragStartValues = {
        sizePixelA: 0,
        sizePixelB: 0,
        sizePercentA: 0,
        sizePercentB: 0,
    };

    @ViewChildren('gutterEls') private gutterEls: QueryList<ElementRef>;

    constructor(private elRef: ElementRef,
                private renderer: Renderer2) {
        // To force adding default class, could be override by user @Input() or not
        this.direction = this._direction;
    }

    public ngAfterViewInit() {
        this.renderer.addClass(this.elRef.nativeElement, 'is-init');
     } 
    
    private getNbGutters(): number {
        return (this.displayedAreas.length === 0) ? 0 : this.displayedAreas.length - 1;
    }

    public addArea(component: SplitAreaDirective): void {
        const newArea: IArea = {
            component, 
            order: 0, 
            size: 0,
            oldsize: 0,
            closed:false
        };

        this.displayedAreas.push(newArea);
        this.build(true, true);
    }

    public removeArea(component: SplitAreaDirective): void {
        if(this.displayedAreas.some(a => a.component === component)) {
            const area = this.displayedAreas.find(a => a.component === component);
            this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);

            this.build(true, true);
        }
    }

    public updateArea(component: SplitAreaDirective, resetOrders: boolean, resetSizes: boolean): void {
        // Only refresh if area is displayed (No need to check inside 'hidedAreas')
        const area = this.displayedAreas.find(a => a.component === component);
        if(!area) {
            return;
        }

        this.build(resetOrders, resetSizes);
    }

    private build(resetOrders: boolean, resetSizes: boolean): void {
        this.stopDragging();

        // ¤ AREAS ORDER
        
        if(resetOrders === true) {
            this.displayedAreas.forEach((area, i) => {
                area.order = i * 2;
                this.renderer.setStyle(area.component.elRef.nativeElement, 'order', area.order);
            });
        }

        // ¤ AREAS SIZE PERCENT
        
        if(resetSizes === true) {

            const totalUserSize = <number> this.displayedAreas.reduce((total: number, s: IArea) => s.component.size ? total + s.component.size : total, 0);
            const totalNullSize = <number> this.displayedAreas.reduce((total: number, s: IArea) => s.component.size ? total : total + 1, 0);
            if (totalUserSize<=1){
                const size = (1-totalUserSize)/totalNullSize;
                this.displayedAreas.forEach(area => {
                    if (area.component.size){
                        area.size = <number> area.component.size;
                    }else{
                        area.size = size;
                    }                
                });
            }else{
                const size = 1 / this.displayedAreas.length;
                
                this.displayedAreas.forEach(area => {
                    area.size = size;
                });
            }
        }

        this.refreshStyleSizes();
    }

    private refreshStyleSizes(): void {
        const sumGutterSize = this.getNbGutters() * this.gutterSize;

        this.displayedAreas.forEach(area => {
            this.renderer.setStyle(area.component.elRef.nativeElement, 
                'flex-basis', 
                `calc( ${ area.size * 100 }% - ${ area.size * sumGutterSize }px )`);
        });
    }

    private AdjustAreaSize(areaA: IArea, areaB: IArea):void{
        if (areaA.component.minSize && areaA.size < areaA.component.minSize && 
            areaB.size + areaA.size > areaA.component.minSize){
            areaB.size -= areaA.component.minSize - areaA.size;
            areaA.size = areaA.component.minSize;
        }else if (areaA.component.maxSize && areaA.size > areaA.component.maxSize){
            areaB.size += areaA.size - areaA.component.maxSize;
            areaA.size = areaA.component.maxSize;
        }
    }
    private closeArea(areaA: IArea, areaB: IArea):void {
        if (areaA.closed){
            if (areaB.size < areaA.oldsize){
                areaA.size = areaB.size/2;
                areaB.size -= areaA.size;
            }else{
                areaA.size = areaA.oldsize;
                areaB.size -= areaA.size;
            }
            areaA.closed = false;
        }else if (areaA.size > 0){
            areaA.oldsize = areaA.size;
            areaB.size += areaA.size;
            areaA.size = 0;    
            areaA.closed = true;
        }
        this.refreshStyleSizes();
    }
    public clickGutter(event: MouseEvent, gutterOrder: number, gutterNum: number): void {
        event.preventDefault();
        event.stopPropagation();

        const areaA = this.displayedAreas.find(a => a.order === gutterOrder - 1);
        const areaB = this.displayedAreas.find(a => a.order === gutterOrder + 1);

        if(!areaA || !areaB) {
            return;
        }
        if (areaA.component.closable){
            this.closeArea(areaA, areaB);
        }else if (areaB.component.closable){
            this.closeArea(areaB, areaA);
        }
        if (areaA.closed || areaB.closed){
            this.renderer.addClass(this.gutterEls.toArray()[gutterNum-1].nativeElement, 'is-closed');
        }else{
            this.renderer.removeClass(this.gutterEls.toArray()[gutterNum-1].nativeElement, 'is-closed');
        }
    }

    public startDragging(event: MouseEvent, gutterOrder: number, gutterNum: number): void {
        event.preventDefault();
        event.stopPropagation();

        this.startPoint = this.getPointFromEvent(event);
        if(!this.startPoint || this.disabled) {
            return;
        }

        const areaA = this.displayedAreas.find(a => a.order === gutterOrder - 1);
        const areaB = this.displayedAreas.find(a => a.order === gutterOrder + 1);
        
        if(!areaA || !areaB || areaA.closed || areaB.closed) {
            return;
        }
        this.dragStartValues.sizePixelA = this.getPixelSize(areaA.component.elRef, this.direction);
        this.dragStartValues.sizePixelB = this.getPixelSize(areaB.component.elRef, this.direction);
        this.dragStartValues.sizePercentA = areaA.size;
        this.dragStartValues.sizePercentB = areaB.size;
        this.currentGutterNum = gutterNum;

        this.dragListeners.push( this.renderer.listen('document', 'mouseup', this.stopDragging.bind(this)) );            
        this.dragListeners.push( this.renderer.listen('document', 'mousemove', (e: MouseEvent) => this.dragEvent(e, areaA, areaB)) );
        this.isDragging = true;
        this.renderer.addClass(this.elRef.nativeElement, 'is-dragging');
    }

    private dragEvent(event: MouseEvent, areaA: IArea, areaB: IArea): void {
        event.preventDefault();
        event.stopPropagation();

        if(!this.isDragging) {
            return;
        }

        this.endPoint = this.getPointFromEvent(event);
        if(!this.endPoint) {
            return;
        }
        
        // ¤ AREAS SIZE PIXEL

        let offsetPixel = (this.direction === 'horizontal') ? (this.startPoint.x - this.endPoint.x) : (this.startPoint.y - this.endPoint.y);
        let newSizePixelA = this.dragStartValues.sizePixelA - offsetPixel;
        let newSizePixelB = this.dragStartValues.sizePixelB + offsetPixel;
        
        if(newSizePixelA < this.gutterSize && newSizePixelB < this.gutterSize) {
            return;
        }
        else if(newSizePixelA < this.gutterSize) {
            newSizePixelB += newSizePixelA;
            newSizePixelA = 0;
        }
        else if(newSizePixelB < this.gutterSize) {
            newSizePixelA += newSizePixelB;
            newSizePixelB = 0;
        }

        // ¤ AREAS SIZE PERCENT

        if(newSizePixelA === 0) {
            areaB.size += areaA.size;
            areaA.size = 0;
        }
        else if(newSizePixelB === 0) {
            areaA.size += areaB.size;
            areaB.size = 0;
        }
        else {
            // NEW_PERCENT = START_PERCENT / START_PIXEL * NEW_PIXEL;
            if(this.dragStartValues.sizePercentA === 0) {
                areaB.size = this.dragStartValues.sizePercentB / this.dragStartValues.sizePixelB * newSizePixelB;
                areaA.size = this.dragStartValues.sizePercentB - areaB.size;
            }
            else if(this.dragStartValues.sizePercentB === 0) {
                areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
                areaB.size = this.dragStartValues.sizePercentA - areaA.size;
            }
            else {
                areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
                areaB.size = (this.dragStartValues.sizePercentA + this.dragStartValues.sizePercentB) - areaA.size;
            }
        }

        //adjust min/max area size
        this.AdjustAreaSize(areaA, areaB);
        this.AdjustAreaSize(areaB, areaA);
        
        this.refreshStyleSizes();
    }

    private stopDragging(event?: Event): void {
        if(event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if(this.isDragging === false) {
            return;
        }
                
        while(this.dragListeners.length > 0) {
            const fct = this.dragListeners.pop();
            if(fct) {
                fct();
            }
        }        
        
        this.isDragging = false;
        this.renderer.removeClass(this.elRef.nativeElement, 'is-dragging');
    }

    public ngOnDestroy(): void {
        this.stopDragging();
    }

    private  getPointFromEvent(event: MouseEvent): IPoint {
        if(event.clientX !== undefined && event.clientY !== undefined) {
            return {
                x: event.clientX,
                y: event.clientY,
            };
        }
        return null;
    }
    
    private  getPixelSize(elRef: ElementRef, direction: 'horizontal' | 'vertical'): number {
        return elRef.nativeElement[(direction === 'horizontal') ? 'offsetWidth' : 'offsetHeight'];
    }
}
