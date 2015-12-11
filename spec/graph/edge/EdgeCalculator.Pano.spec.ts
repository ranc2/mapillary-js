/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

import {
    EdgeCalculator,
    EdgeCalculatorSettings,
    EdgeCalculatorDirections,
    EdgeConstants,
    IEdge,
    IPotentialEdge
} from "../../../src/Edge";
import {Spatial} from "../../../src/Geo";
import {EdgeCalculatorHelper} from "../../helper/EdgeCalculatorHelper.spec";

describe('EdgeCalculator.computePanoEdges', () => {
    let edgeCalculator: EdgeCalculator;
    let edgeCalculatorSettings: EdgeCalculatorSettings;
    let edgeCalculatorDirections: EdgeCalculatorDirections;

    let edgeCalculatorHelper: EdgeCalculatorHelper;

    let spatial: Spatial;

    let potentialEdge1: IPotentialEdge;

    beforeEach(() => {
        edgeCalculatorSettings = new EdgeCalculatorSettings();
        edgeCalculatorSettings.panoMinDistance = 0.1;
        edgeCalculatorSettings.panoMaxDistance = 20;
        edgeCalculatorSettings.panoPreferredDistance = 5;
        edgeCalculatorSettings.panoMaxItems = 4;
    });

    beforeEach(() => {
        edgeCalculatorDirections = new EdgeCalculatorDirections();
        edgeCalculator = new EdgeCalculator(edgeCalculatorSettings, edgeCalculatorDirections);

        edgeCalculatorHelper = new EdgeCalculatorHelper();

        spatial = new Spatial();
    });

    beforeEach(() => {
        potentialEdge1 = edgeCalculatorHelper.createPotentialEdge("pkey1");
        potentialEdge1.distance = edgeCalculatorSettings.panoMaxDistance / 2;
        potentialEdge1.fullPano = true
    });

    it('should have a pano edge', () => {
        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges([potentialEdge1]);

        expect(panoEdges.length).toBe(1);

        let panoEdge: IEdge = panoEdges[0];

        expect(panoEdge.to).toBe(potentialEdge1.apiNavImIm.key);
        expect(panoEdge.direction).toBe(EdgeConstants.Direction.PANO);
    });

    it('should have a pano edge irrespective of rotation', () => {
        potentialEdge1.directionChange = Math.PI;

        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges([potentialEdge1]);

        expect(panoEdges.length).toBe(1);

        let panoEdge: IEdge = panoEdges[0];

        expect(panoEdge.to).toBe(potentialEdge1.apiNavImIm.key);
        expect(panoEdge.direction).toBe(EdgeConstants.Direction.PANO);
    });

    it('should not have a pano edge with to long distance', () => {
        potentialEdge1.distance = edgeCalculatorSettings.panoMaxDistance + 1;

        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges([potentialEdge1]);

        expect(panoEdges.length).toBe(0);
    });

    it('should not have a pano edge with to short distance', () => {
        potentialEdge1.distance = edgeCalculatorSettings.panoMinDistance / 2;

        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges([potentialEdge1]);

        expect(panoEdges.length).toBe(0);
    });

    it('should not have a pano edge for non full pano', () => {
        potentialEdge1.fullPano = false;

        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges([potentialEdge1]);

        expect(panoEdges.length).toBe(0);
    });
});

describe('EdgeCalculator.computePanoEdges', () => {
    let edgeCalculator: EdgeCalculator;
    let edgeCalculatorSettings: EdgeCalculatorSettings;
    let edgeCalculatorDirections: EdgeCalculatorDirections;

    let edgeCalculatorHelper: EdgeCalculatorHelper;

    let spatial: Spatial;

    let potentialEdge1: IPotentialEdge;
    let potentialEdge2: IPotentialEdge;

    beforeEach(() => {
        edgeCalculatorSettings = new EdgeCalculatorSettings();
        edgeCalculatorSettings.panoMinDistance = 0.1;
        edgeCalculatorSettings.panoMaxDistance = 20;
        edgeCalculatorSettings.panoPreferredDistance = 5;
        edgeCalculatorSettings.panoMaxItems = 4;
    });

    beforeEach(() => {
        edgeCalculatorDirections = new EdgeCalculatorDirections();
        edgeCalculator = new EdgeCalculator(edgeCalculatorSettings, edgeCalculatorDirections);

        edgeCalculatorHelper = new EdgeCalculatorHelper();

        spatial = new Spatial();
    });

    beforeEach(() => {
        potentialEdge1 = edgeCalculatorHelper.createPotentialEdge("pkey1");
        potentialEdge1.distance = edgeCalculatorSettings.panoPreferredDistance;
        potentialEdge1.fullPano = true

        potentialEdge2 = edgeCalculatorHelper.createPotentialEdge("pkey2");
        potentialEdge2.distance = edgeCalculatorSettings.panoPreferredDistance;
        potentialEdge2.fullPano = true
    });

    it('should have a pano edge closest to preferred distance', () => {
        potentialEdge1.distance = edgeCalculatorSettings.panoPreferredDistance + 1;
        potentialEdge2.distance = edgeCalculatorSettings.panoPreferredDistance;

        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges([potentialEdge1, potentialEdge2]);

        expect(panoEdges.length).toBe(1);

        let panoEdge: IEdge = panoEdges[0];

        expect(panoEdge.to).toBe(potentialEdge2.apiNavImIm.key);
        expect(panoEdge.direction).toBe(EdgeConstants.Direction.PANO);
    });

    it('should have a pano edge closest to preferred distance', () => {
        potentialEdge1.distance = edgeCalculatorSettings.panoPreferredDistance - 1;
        potentialEdge2.distance = edgeCalculatorSettings.panoPreferredDistance;

        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges([potentialEdge1, potentialEdge2]);

        expect(panoEdges.length).toBe(1);

        let panoEdge: IEdge = panoEdges[0];

        expect(panoEdge.to).toBe(potentialEdge2.apiNavImIm.key);
        expect(panoEdge.direction).toBe(EdgeConstants.Direction.PANO);
    });

    it('should have a pano edge with same sequence', () => {
        potentialEdge1.sameSequence = false;
        potentialEdge2.sameSequence = true;

        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges([potentialEdge1, potentialEdge2]);

        expect(panoEdges.length).toBe(1);

        let panoEdge: IEdge = panoEdges[0];

        expect(panoEdge.to).toBe(potentialEdge2.apiNavImIm.key);
        expect(panoEdge.direction).toBe(EdgeConstants.Direction.PANO);
    });

    it('should have a pano edge with same sequence', () => {
        potentialEdge1.sameMergeCc = false;
        potentialEdge2.sameMergeCc = true;

        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges([potentialEdge1, potentialEdge2]);

        expect(panoEdges.length).toBe(1);

        let panoEdge: IEdge = panoEdges[0];

        expect(panoEdge.to).toBe(potentialEdge2.apiNavImIm.key);
        expect(panoEdge.direction).toBe(EdgeConstants.Direction.PANO);
    });

    it('should have a pano edge with smallest motion change', () => {
        potentialEdge1.motionChange = 0.2;
        potentialEdge2.motionChange = 0.1;

        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges([potentialEdge1, potentialEdge2]);

        expect(panoEdges.length).toBe(1);

        let panoEdge: IEdge = panoEdges[0];

        expect(panoEdge.to).toBe(potentialEdge2.apiNavImIm.key);
        expect(panoEdge.direction).toBe(EdgeConstants.Direction.PANO);
    });
});

describe('EdgeCalculator.computePanoEdges', () => {
    let edgeCalculator: EdgeCalculator;
    let edgeCalculatorSettings: EdgeCalculatorSettings;
    let edgeCalculatorDirections: EdgeCalculatorDirections;

    let edgeCalculatorHelper: EdgeCalculatorHelper;

    let spatial: Spatial;

    let potentialEdge1: IPotentialEdge;
    let potentialEdge2: IPotentialEdge;
    let potentialEdge3: IPotentialEdge;
    let potentialEdge4: IPotentialEdge;

    beforeEach(() => {
        edgeCalculatorSettings = new EdgeCalculatorSettings();
        edgeCalculatorSettings.panoMinDistance = 0.1;
        edgeCalculatorSettings.panoMaxDistance = 20;
        edgeCalculatorSettings.panoPreferredDistance = 5;
        edgeCalculatorSettings.panoMaxItems = 4;
    });

    beforeEach(() => {
        edgeCalculatorDirections = new EdgeCalculatorDirections();
        edgeCalculator = new EdgeCalculator(edgeCalculatorSettings, edgeCalculatorDirections);

        edgeCalculatorHelper = new EdgeCalculatorHelper();

        spatial = new Spatial();
    });

    beforeEach(() => {
        potentialEdge1 = edgeCalculatorHelper.createPotentialEdge("pkey1");
        potentialEdge1.distance = edgeCalculatorSettings.panoMaxDistance / 2;
        potentialEdge1.fullPano = true;

        potentialEdge2 = edgeCalculatorHelper.createPotentialEdge("pkey2");
        potentialEdge2.distance = edgeCalculatorSettings.panoMaxDistance / 2;
        potentialEdge2.fullPano = true;

        potentialEdge3 = edgeCalculatorHelper.createPotentialEdge("pkey3");
        potentialEdge3.distance = edgeCalculatorSettings.panoMaxDistance / 2;
        potentialEdge3.fullPano = true;

        potentialEdge4 = edgeCalculatorHelper.createPotentialEdge("pkey4");
        potentialEdge4.distance = edgeCalculatorSettings.panoMaxDistance / 2;
        potentialEdge4.fullPano = true;
    });

    it('should have a pano edge in four directions', () => {
        potentialEdge1.motionChange = 0;
        potentialEdge2.motionChange = Math.PI / 2;
        potentialEdge3.motionChange = Math.PI;
        potentialEdge4.motionChange = -Math.PI / 2;

        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges(
            [potentialEdge1, potentialEdge2, potentialEdge3, potentialEdge4]);

        expect(panoEdges.length).toBe(4);

        let keys: string[] = [
            potentialEdge1.apiNavImIm.key,
            potentialEdge2.apiNavImIm.key,
            potentialEdge3.apiNavImIm.key,
            potentialEdge4.apiNavImIm.key
        ];

        for (let i: number = 0; i < keys.length; i++) {
            let key: string = keys[i];

            let edge: IEdge = null;
            for (let j: number = 0; j < panoEdges.length; j++) {
                let panoEdge: IEdge = panoEdges[j];

                if (panoEdge.to === key) {
                    edge = panoEdge;
                }
            }

            expect(edge.direction).toBe(EdgeConstants.Direction.PANO);
        }
    });

    it('should not have multiple pano edges in same slice', () => {
        potentialEdge1.motionChange = 0;
        potentialEdge2.motionChange = Math.PI / 36;
        potentialEdge3.motionChange = Math.PI;
        potentialEdge4.motionChange = -35 * Math.PI / 36;

        let panoEdges: IEdge[] = edgeCalculator.computePanoEdges(
            [potentialEdge1, potentialEdge2, potentialEdge3, potentialEdge4]);

        expect(panoEdges.length).toBe(2);

        let keys: string[] = [
            potentialEdge1.apiNavImIm.key,
            potentialEdge3.apiNavImIm.key
        ];

        for (let i: number = 0; i < keys.length; i++) {
            let key: string = keys[i];

            let edge: IEdge = null;
            for (let j: number = 0; j < panoEdges.length; j++) {
                let panoEdge: IEdge = panoEdges[j];

                if (panoEdge.to === key) {
                    edge = panoEdge;
                }
            }

            expect(edge.direction).toBe(EdgeConstants.Direction.PANO);
        }
    });
});