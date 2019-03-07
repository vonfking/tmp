import { Directive, Input, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';

import { SplitComponent } from './split.component';

@Directive({
    selector: 'as-split-area, [as-split-area]'
})
export class SplitAreaDirective implements OnInit, OnDestroy {

    private _size: number | null = null;

    @Input() set size(v: number | null) {
        v = Number(v);
        this._size = (!isNaN(v) && v >= 0 && v <= 100) ? (v/100) : null;

        this.split.updateArea(this, false, true);
    }
    
    get size(): number | null {
        return this._size;
    }

    ////

    private _minSize: number | null = null;

    @Input() set minSize(v: number | null) {
        v = Number(v);
        this._minSize = (!isNaN(v) && v >= 0 && v <= 100) ? (v/100) : null;

        this.split.updateArea(this, false, true);
    }
    
    get minSize(): number | null {
        return this._minSize;
    }

    ////

    private _maxSize: number | null = null;

    @Input() set maxSize(v: number | null) {
        v = Number(v);
        this._maxSize = (!isNaN(v) && v >= 0 && v <= 100) ? (v/100) : null;

        this.split.updateArea(this, false, true);
    }
    
    get maxSize(): number | null {
        return this._maxSize;
    }

    ////

    private _closable: boolean = false;

    @Input() set closable(v: boolean) {
        this._closable = (typeof(v) === 'boolean') ? v : (v === 'false' ? false : true);
    }

    get closable(): boolean {
        return this._closable;
    }

    ////
	
    constructor(public elRef: ElementRef,
                private renderer: Renderer2,
                private split: SplitComponent) {
        this.renderer.addClass(this.elRef.nativeElement, 'as-split-area');
    }

    public ngOnInit(): void {
        this.split.addArea(this);
    }

    public ngOnDestroy(): void {
        this.split.removeArea(this);
    }
}
