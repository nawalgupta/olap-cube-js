import Cube from '../src/cube.js';
import '../node_modules/lodash/lodash.js';
// const Cube = require('../src/cube.js')
// const _ = require('../node_modules/lodash/lodash.js')

const etalon = {
    measurements: {
        cities: [
            { id: 1, city: 'New York' },
            { id: 2, city: 'Paris' },
            { id: 3, city: 'Moscow' },
        ],
        companies: [
            { id: 1, company: 'AirLine' },
            { id: 2, company: 'SkyLine' },
        ],
        age: [
            { id: 1, minAgePlane: '1 year', maxAgePlane: '5 year' },
            { id: 2, minAgePlane: '5 year', maxAgePlane: '10 year' },
        ],
        prices: [
            { id: 1, price: '20$' },
            { id: 2, price: '10$' },
            { id: 3, price: '20$' },
            { id: 4, price: '25$' },
        ],
        counts: [
            { id: 1, planesCount: 1 },
            { id: 2, planesCount: 1 },
            { id: 3, planesCount: 1 },
            { id: 4, planesCount: 1 },
            { id: 5, planesCount: 2 },
        ]
    },
    normalizedDataArray: [
        { id: 1, cities_id: 1, companies_id: 1, age_id: 1, prices_id: 1, counts_id: 1 },
        { id: 2, cities_id: 2, companies_id: 2, age_id: 2, prices_id: 2, counts_id: 3 },
        { id: 3, cities_id: 2, companies_id: 1, age_id: 2, prices_id: 2, counts_id: 2 },
        { id: 4, cities_id: 3, companies_id: 1, age_id: 1, prices_id: 3, counts_id: 4 },
        { id: 5, cities_id: 3, companies_id: 2, age_id: 1, prices_id: 4, counts_id: 5 },
    ]
}

let arrayData = [
    { id: 1, city: 'New York', company: 'AirLine', minAgePlane: '1 year', maxAgePlane: '5 year', planesCount: 1, price: '20$'},
    { id: 2, city: 'Paris', company: 'SkyLine', minAgePlane: '5 year', maxAgePlane: '10 year', planesCount: 1, price: '10$'},
    { id: 3, city: 'Paris', company: 'AirLine', minAgePlane: '5 year', maxAgePlane: '10 year', planesCount: 1, price: '10$'},
    { id: 4, city: 'Moscow', company: 'AirLine', minAgePlane: '1 year', maxAgePlane: '5 year', planesCount: 1, price: '20$'},
    { id: 5, city: 'Moscow', company: 'SkyLine', minAgePlane: '1 year', maxAgePlane: '5 year', planesCount: 2, price: '25$'},
]

let schema = [
    { name: 'cities', keyProps: ['city']},
    { name: 'companies', keyProps: ['company']},
    { name: 'age', keyProps: ['minAgePlane', 'maxAgePlane']},
    { name: 'prices', keyProps: ['price'], dependency: 'cities' },
    { name: 'counts', keyProps: ['planesCount'], dependency: ['cities', 'companies']},
]

schema = {
    name: 'counts',
    keyProps: ['planesCount'],
    dependency: [
        {
            name: 'prices',
            keyProps: ['price'],
            dependency: [
                {
                    name: 'cities',
                    keyProps: ['city']
                }
            ]
        },
        {
            name: 'companies',
            keyProps: ['company']
        },
        {
            name: 'age',
            keyProps: ['minAgePlane', 'maxAgePlane']
        }
    ]
}

describe('[ Cube work ]', function(){

    it('must be equal etalon and expected cube data', () => {
        let cube = new Cube(arrayData, schema);
        cube = JSON.parse(JSON.stringify(cube));
        expect(_.isEqual(cube, etalon)).toBe(true)
    })

    it('should return same array of data', () => {
        let cube = new Cube(arrayData, schema);
        let data = JSON.parse(JSON.stringify(cube.getDataArray()));
        expect(_.isEqual(arrayData, data)).toBe(true)
    })

    it('should return unique data', () => {
        let cube = new Cube(arrayData, schema);
        const res = cube.unique('prices');
        const expection = [
            { id: 1, price: "20$" },
            { id: 2, price: "10$" },
            { id: 3, price: "20$" },
            { id: 4, price: "25$" },
        ];
        expect(_.isEqual(JSON.parse(JSON.stringify(res)), expection)).toBe(true)
    })

    it('should add column to cube data', () => {
        const arrayData = [
            {id: 1, x: 0, y: 0, value: 10 },
            {id: 2, x: 0, y: 1, value: 100 },
            {id: 3, x: 1, y: 0, value: 1000 },
            {id: 4, x: 1, y: 1, value: 10000 },
        ];

        const schema = {
            name: 'valueOfXY',
            keyProps: ['value'],
            dependency: [
                {
                    name: 'coordinateX',
                    keyProps: ['x']
                },{
                    name: 'coordinateY',
                    keyProps: ['y']
                }
            ]
        };

        let cube = new Cube(arrayData, schema);

        const ealon = {
            "normalizedDataArray":[
                {"id":1,"coordinateY_id":1,"coordinateX_id":1,"valueOfXY_id":1},
                {"id":2,"coordinateY_id":2,"coordinateX_id":1,"valueOfXY_id":2},
                {"id":3,"coordinateY_id":1,"coordinateX_id":2,"valueOfXY_id":3},
                {"id":4,"coordinateY_id":2,"coordinateX_id":2,"valueOfXY_id":4}],
            "measurements":{
                "coordinateY":[
                    {"id":1,"y":0},
                    {"id":2,"y":1}
                ],
                "coordinateX":[
                    {"id":1,"x":0},
                    {"id":2,"x":1}
                ],
                "valueOfXY":[
                    {"id":1,"value":10},
                    {"id":2,"value":100},
                    {"id":3,"value":1000},
                    {"id":4,"value":10000}
                ]
            }
        };

        let isEqual = _.isEqual(JSON.parse(JSON.stringify(cube)), ealon);
        expect(isEqual).toBe(true);

        cube.addColumn('coordinateX', { x: 2 });

        cube.normalizedDataArray[4].id = null;
        cube.normalizedDataArray[5].id = null;

        const ealonAfterAdding = {
            "normalizedDataArray":[
                {"id":1,"coordinateY_id":1,"coordinateX_id":1,"valueOfXY_id":1},
                {"id":2,"coordinateY_id":2,"coordinateX_id":1,"valueOfXY_id":2},
                {"id":3,"coordinateY_id":1,"coordinateX_id":2,"valueOfXY_id":3},
                {"id":4,"coordinateY_id":2,"coordinateX_id":2,"valueOfXY_id":4},
                {"id":null,"coordinateY_id":1,"coordinateX_id":3,"valueOfXY_id":5},
                {"id":null,"coordinateY_id":2,"coordinateX_id":3,"valueOfXY_id":6},
            ],
            "measurements":{
                "coordinateY":[
                    {"id":1,"y":0},
                    {"id":2,"y":1}
                ],
                "coordinateX":[
                    {"id":1,"x":0},
                    {"id":2,"x":1},
                    {"id":3,"x":2}
                ],
                "valueOfXY":[
                    {"id":1,"value":10},
                    {"id":2,"value":100},
                    {"id":3,"value":1000},
                    {"id":4,"value":10000},
                    {"id":5,"value":null},
                    {"id":6,"value":null}
                ]
            }
        };

        isEqual = _.isEqual(JSON.parse(JSON.stringify(cube)), ealonAfterAdding)
        expect(isEqual).toBe(true);
    })

    it('should add column to cube data with dependency columns', () => {

        const schema = {
            name: 'money',
            keyProps: ['money'],
            dependency: [
                {
                    name: 'product',
                    keyProps: ['product']
                },
                {
                    name: 'day',
                    keyProps: ['day'],
                    dependency: [
                        {
                            name: 'month',
                            keyProps: ['month'],
                            dependency: [
                                {
                                    name: 'year',
                                    keyProps: ['year']
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const arrayData = [
            { id: 1, product: 'telephone', money: '5$', year: '2018', month: 'january', day: '1'},
            { id: 2, product: 'tv', money: '50$', year: '2018', month: 'january', day: '2' },
            { id: 3, product: 'telephone', money: '10$', year: '2018', month: 'january', day: '2' }
        ];

        let cube = new Cube(arrayData, schema);

        expect(cube.measurements['product'].length).toBe(2);
        expect(cube.measurements['money'].length).toBe(3);

        cube.addColumn('product', { product : 'mp3' } );

        expect(cube.measurements['product'].length).toBe(3);
        expect(cube.measurements['money'].length).toBe(4);

        cube = new Cube(arrayData, schema);

        expect(cube.measurements['year'].length).toBe(1);
        expect(cube.measurements['money'].length).toBe(3);

        cube.addColumn('year', { year : '2019' } );

        expect(cube.measurements['year'].length).toBe(2);
        expect(cube.measurements['money'].length).toBe(5);

        cube = new Cube(arrayData, schema);

        expect(cube.measurements['month'].length).toBe(1);
        expect(cube.measurements['money'].length).toBe(3);

        cube.addColumn('month', { month : 'april' } );

        expect(cube.measurements['month'].length).toBe(2);
        expect(cube.measurements['money'].length).toBe(5);
    })

    it('should normalize count of measure for non-normalized data', () => {
        const arrayData = [
            { id: 1, x: 0, y: 0, z: 0,is: true },
            { id: 2, x: 0, y: 0, z: 1,is: true },
            { id: 3, x: 0, y: 1, z: 0,is: true },
            { id: 4, x: 0, y: 1, z: 1,is: true },
            { id: 5, x: 1, y: 0, z: 0,is: true },
            // { id: 6, x: 1, y: 0, z: 1,is: true },
            // { id: 7, x: 1, y: 1, z: 0,is: true },
            // { id: 8, x: 1, y: 1, z: 1,is: true },
        ];
        const schema = {
            name: 'is',
            keyProps: ['is'],
            dependency: [
                {
                    name: 'x',
                    keyProps: ['x']
                },
                {
                    name: 'y',
                    keyProps: ['y']
                },
                {
                    name: 'z',
                    keyProps: ['z']
                }
            ]
        };

        let cube = new Cube(arrayData, schema);
        expect(cube.measurements['is'].length).toBe(5);
        cube.fill();
        expect(cube.measurements['is'].length).toBe(8);
    })
});