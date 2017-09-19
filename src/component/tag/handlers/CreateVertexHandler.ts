import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

import {
    CreateHandlerBase,
    Geometry,
    OutlineCreateTag,
} from "../../../Component";
import {Transform} from "../../../Geo";
import {RenderCamera} from "../../../Render";

export abstract class CreateVertexHandler extends CreateHandlerBase {
    private _addPointSubscription: Subscription;
    private _createSubscription: Subscription;
    private _deleteSubscription: Subscription;
    private _geometryCreateSubscription: Subscription;
    private _setVertexSubscription: Subscription;

    protected _enable(): void {
        const transformChanged$: Observable<void> = this._navigator.stateService.currentTransform$
            .map((transform: Transform): void => { /*noop*/ })
            .publishReplay(1)
            .refCount();

        this._deleteSubscription = transformChanged$
            .skip(1)
            .subscribe(this._tagCreator.delete$);

        this._createSubscription = transformChanged$
            .switchMap(
                (): Observable<number[]> => {
                    return this._validBasicClick$.take(1);
                })
            .subscribe(this._tagCreator.create$);

        this._setVertexSubscription = this._tagCreator.tag$
            .switchMap(
                (tag: OutlineCreateTag): Observable<[OutlineCreateTag, MouseEvent, RenderCamera, Transform]> => {
                    return !!tag ?
                        Observable
                            .combineLatest(
                                Observable.of(tag),
                                Observable
                                    .merge(
                                        this._container.mouseService.mouseMove$,
                                        this._container.mouseService.domMouseMove$),
                                this._container.renderService.renderCamera$,
                                this._navigator.stateService.currentTransform$) :
                        Observable.empty();
                })
            .subscribe(
                ([tag, event, camera, transform]: [OutlineCreateTag, MouseEvent, RenderCamera, Transform]): void => {
                    const basicPoint: number[] = this._mouseEventToBasic(
                        event,
                        this._container.element,
                        camera,
                        transform);

                    this._setVertex2d(tag, basicPoint, transform);
                });

        this._addPointSubscription = this._tagCreator.tag$
            .switchMap(
                (tag: OutlineCreateTag): Observable<[OutlineCreateTag, number[]]> => {
                    return !!tag ?
                        Observable
                            .combineLatest(
                                Observable.of(tag),
                                this._basicClick$) :
                        Observable.empty();
                })
            .subscribe(
                ([tag, basicPoint]: [OutlineCreateTag, number[]]): void => {
                    tag.addPoint(basicPoint);
                });

        this._geometryCreateSubscription = this._tagCreator.tag$
            .switchMap(
                (tag: OutlineCreateTag): Observable<Geometry> => {
                    return !!tag ?
                        tag.created$
                            .map(
                                (t: OutlineCreateTag): Geometry => {
                                    return t.geometry;
                                }) :
                        Observable.empty();
                })
            .subscribe(this._geometryCreated$);
    }

    protected abstract _setVertex2d(tag: OutlineCreateTag, basicPoint: number[], transform: Transform): void;

    protected _disable(): void {
        this._tagCreator.delete$.next(null);

        this._addPointSubscription.unsubscribe();
        this._createSubscription.unsubscribe();
        this._deleteSubscription.unsubscribe();
        this._geometryCreateSubscription.unsubscribe();
        this._setVertexSubscription.unsubscribe();
    }
}

export default CreateVertexHandler;