import {
    exportedForTesting,
    getFieldFromPath,
    entityTypes,
    types,
    initializeEntityTypes,
    createEmptySummary,
    createEmptyItem
} from '../../helpers/entityTypes';


const {
    expansions,
    expandValidation,
    transformEntries,
    expandFieldValidation,
    createEmptyObject,
    setInternalReference,
    setEveryFieldsInternalReferences,
    expandEveryFieldsValidations
} = exportedForTesting

const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

const entityTypesCopy = deepCopy(entityTypes);

const entityEntries = (entityTypesCopy = deepCopy(entityTypes)) =>
    Object.entries(entityTypesCopy).map(
        ([entityName, entityType]) =>
            [entityName, entityType, entityTypesCopy]
    );

const fieldEntries = (entityTypesCopy = deepCopy(entityTypes)) =>
    Object.entries(entityTypesCopy).map(
        ([entityName, entityType]) =>
            Object.entries(entityType.fields).map(
                ([fieldName, field]) =>
                    [entityName, fieldName, field, entityTypesCopy]
            )
    ).flat();

const referringFieldEntries = () => fieldEntries().filter(([entityName, fieldName, field, entityTypesCopy]) => field.type === types.obj || field.type === types.file);

const textFieldEntries = () => fieldEntries().filter(([entityName, fieldName, field, entityTypesCopy]) => field.type === types.str);

const numFieldEntries = () => fieldEntries().filter(([entityName, fieldName, field, entityTypesCopy]) => field.type === types.num);

describe('validation support functions', () => {
    describe('expansions', () => {
        test('dot notation', () => {
            const actual = expansions.max(10);
            expect(actual).toEqual({value: 10, message: 'niet groter dan 10'});
        });
        test.each([
            ['required', null, {value: null, message: 'verplicht veld'}],
            ['maxLength', 30, {value: 30, message: 'maximaal 30 karakters'}],
            ['minLength', 10, {value: 10, message: 'minimaal 10 karakters'}],
            ['max', 4321, {value: 4321, message: 'niet groter dan 4321'}],
            ['min', 1234, {value: 1234, message: 'niet kleiner dan 1234'}]
        ])('criterion=%s', (criterion, value, expected) => {
            const actual = expansions[criterion](value);
            expect(actual).toEqual(expected);
        });
    });

    describe('expandValidation', () => {
        test.each([
            [['required', null], ['required', {value: null, message: 'verplicht veld'}]],
            [['required', {a: 1, b: 'bb'}], ['required', {a: 1, b: 'bb'}]],
            [['maxLength', 30], ['maxLength', {value: 30, message: 'maximaal 30 karakters'}]],
            [['min', 1234], ['min', {value: 1234, message: 'niet kleiner dan 1234'}]]
        ])('unexpanded=%o', (unexpanded, expected) => {
            const actual = expandValidation(unexpanded);
            expect(actual).toEqual(expected);
        });
    });

    describe('transformEntries', () => {
        function swapElements([a, b]) {
            return [b, a];
        }

        const testcase = {a: 1, b: 2, c: 3};
        const actual = transformEntries(testcase, swapElements);
        expect(actual).toEqual({'1': 'a', '2': 'b', '3': 'c'});
    });

    describe('expandFieldValidation', () => {
        test.each([
            ['no validation',
                {a: 1, b: 2, c: 3},
                {a: 1, b: 2, c: 3}
            ],
            ['unexpanded validation, min',
                {a: 1, b: 2, c: 3, validation: {min: 314159}},
                {
                    a: 1, b: 2, c: 3,
                    validation: {min: {value: 314159, message: 'niet kleiner dan 314159'}}
                }
            ],
            ['unexpanded validation, maxLength',
                {a: 1, b: 2, validation: {maxLength: 100}, c: 3},
                {
                    a: 1, b: 2, c: 3,
                    validation: {maxLength: {value: 100, message: 'maximaal 100 karakters'}}
                }
            ],
            ['multiple validations, required + max',
                {a: 1, b: 2, validation: {required: true, max: 123.456}, c: 3},
                {
                    a: 1, b: 2, c: 3,
                    validation: {
                        required: {value: true, message: 'verplicht veld'},
                        max: {value: 123.456, message: 'niet groter dan 123.456'}
                    }
                }
            ],
        ])('title=%s , fieldValue=%o , expected=%o',
            (title, fieldValue, expected) => {
                expandFieldValidation(fieldValue);
                expect(fieldValue).toEqual(expected);

            });
    });

    describe('check String Validation presence', () => {
        test.each(
            textFieldEntries()
        )('just validation , entityName=%s , fieldName=%s',
            (entityName, fieldName, field) => {
                expect(field).toHaveProperty('validation');
            });

        test.each(
            textFieldEntries()
        )('validation.maxLength , entityName=%s , fieldName=%s',
            (entityName, fieldName, field) => {
                expect(field).toHaveProperty('validation.maxLength');
            });
    });

});

describe('internal reference support functions', () => {

    describe('getFieldFromPath', () => {

        test('return directly referenced field', () => {
            const entityTypesCopy = deepCopy(entityTypes);
            const actual = getFieldFromPath(entityTypesCopy, entityTypesCopy.hull, entityTypesCopy.hull.summary[1]);
            const expected = {type: 'string', label: 'rompnummer', validation: {maxLength: 20}};
            expect(actual).toEqual(expected);
        });

        test('find target of prop referring to entity', () => {
            const entityTypesCopy = deepCopy(entityTypes);
            const actual = getFieldFromPath(entityTypesCopy, entityTypesCopy.relation, entityTypesCopy.relation.summary[2]);
            const expected = {type: 'string', label: 'naam', validation: {maxLength: 50}};
            expect(actual).toEqual(expected);
        });
    });

    describe('check Internal References', () => {
        test.each(
            referringFieldEntries().filter(([entityName, fieldName, field, entityTypesCopy]) => ('target' in field))
        )('with target prop, entityName= %s , fieldName=%s',
            (entityName, fieldName, field, entityTypesCopy) => {
                expect(entityTypesCopy).toHaveProperty(field.target);
            });

        test.each(
            referringFieldEntries().filter(([entityName, fieldName, field, entityTypesCopy]) => !('target' in field))
        )('no target prop, , entityName= %s , fieldName=%s',
            (entityName, fieldName, field, entityTypesCopy) => {
                expect(entityTypesCopy).toHaveProperty(fieldName);
            });
    });

    describe('setInternalReference', () => {
        test('no reference, no changes', () => {
            const entityTypesCopy = deepCopy(entityTypes);
            const fieldCopy = deepCopy(entityTypesCopy.country.fields.shortNameNL);
            setInternalReference(entityTypesCopy, 'country', 'shortNameNL');
            expect(entityTypesCopy.country.fields.shortNameNL).toEqual(fieldCopy);
        });

        test('reference w/o target prop, target & label should be inserted', () => {
            const entityTypesCopy = deepCopy(entityTypes);
            const expected = {
                hasNull: true,
                isMulti: false,
                label: 'romp',
                target: 'hull',
                type: 'object'
            };
            setInternalReference(entityTypesCopy, 'vessel', 'hull');
            expect(entityTypesCopy.vessel.fields.hull).toEqual(expected);
        });


    });

    function addSubProps(targetObject, difference) {
        for (const key in difference) {
            targetObject[key] = {...targetObject[key], ...difference[key]};
        }
    }

    describe('setEveryFieldsInternalReferences', () => {
        test('vessel', () => {
            const entityTypesCopy = deepCopy(entityTypes);
            const entityName = 'vessel';
            const entityType = entityTypesCopy[entityName];
            const fields = entityType.fields;
            const fieldsCopy = deepCopy(fields);
            // fieldsCopy.hull = {...fieldsCopy.hull, label: 'romp', target: 'hull'};
            // fieldsCopy.vesselType = {...fieldsCopy.vesselType, label: 'scheepstype', target: 'vesselType'};
            addSubProps(fieldsCopy, {
                hull: {label: 'romp', target: 'hull'},
                vesselType: {label: 'scheepstype', target: 'vesselType'}
            });
            setEveryFieldsInternalReferences(entityTypesCopy, entityName);
            expect(fields).toEqual(fieldsCopy);
        });

        test('vesselType', () => {
            const entityTypesCopy = deepCopy(entityTypes);
            const entityName = 'vesselType';
            const entityType = entityTypesCopy[entityName];
            const fields = entityType.fields;
            const fieldsCopy = deepCopy(fields);
            setEveryFieldsInternalReferences(entityTypesCopy, entityName);
            expect(fields).toEqual(fieldsCopy);
        });

        test('address', () => {
            const entityTypesCopy = deepCopy(entityTypes);
            const entityName = 'address';
            const entityType = entityTypesCopy[entityName];
            // console.log('fields.country (before)=', entityType.fields.country)
            const fieldsCopy = deepCopy(entityType.fields);
            fieldsCopy.country = {...fieldsCopy.country, label: 'land', target: 'country'};
            // console.log('fieldsCopy.country=', fieldsCopy.country);
            setEveryFieldsInternalReferences(entityTypesCopy, entityName);
            // console.log('fields.country (after)=', entityType.fields.country)
            expect(entityType.fields).toEqual(fieldsCopy);
            expect(entityType.fields.country).toHaveProperty('label');
        });

    });


    const summaryEntries = (entityTypesCopy = deepCopy(entityTypes)) =>
        Object.entries(entityTypesCopy).map(
            ([entityName, entityType]) =>
                entityType.summary.map(
                    (fieldPath) =>
                        [entityName, fieldPath, entityType.fields, entityTypesCopy]
                )
        ).flat();

    function dotCount(fieldPath) {
        return (fieldPath.match(/\./g) || []).length;
    }

    describe('validity of summary elements', () => {
        test.each(
            summaryEntries().filter(
                ([entityName, fieldPath, fields, entityTypesCopy]) => dotCount(fieldPath) === 0
            )
        )('direct path , entityName=%s , fieldPath=%s',
            (entityName, fieldPath, fields, entityTypesCopy) => {
                expect(fields).toHaveProperty(fieldPath);
            });

        test.each(
            summaryEntries().filter(
                ([entityName, fieldPath, fields, entityTypesCopy]) => dotCount(fieldPath) === 1
            )
        )('indirect path , entityName=%s , fieldPath=%s',
            (entityName, fieldPath, fields, entityTypesCopy) => {
                const parts = fieldPath.split('.');
                expect(fields).toHaveProperty(parts[0]);
                setInternalReference(entityTypesCopy, entityName, parts[0]);
                expect(fields).toHaveProperty(parts[0] + '.target');
                const targetEntityName = fields[parts[0]].target;
                expect(entityTypesCopy).toHaveProperty(targetEntityName);
                expect(entityTypesCopy).toHaveProperty(targetEntityName + '.fields.' + parts[1]);
            });
    });

    describe('createEmptyObject()', () => {
        test.each([
            ['hull', ['id'], {id: null}],
            ['hull', ['id', 'hullNumber'], {id: null, hullNumber: ''}]
        ])('case: , entityName=%s , fieldPaths=%o , expected=%o',
            (entityName, fieldPaths, expected) => {
                const entityTypesCopy = deepCopy(entityTypes);
                setEveryFieldsInternalReferences(entityTypesCopy, entityName);
                const actual = createEmptyObject(entityTypesCopy, entityTypesCopy[entityName], fieldPaths);
                expect(actual).toEqual(expected);
            });
    });

    describe('createEmptySummary()', () => {
        test.each([
            ['address', {id: null, address1: '', address2: '', city: '', 'country.alpha2Code': ''}]
        ])('case , entityName=%s , expected=%o',
            (entityName, expected) => {
                const entityTypesCopy = deepCopy(entityTypes);
                setEveryFieldsInternalReferences(entityTypesCopy, entityName);
                const actual = createEmptySummary(entityTypesCopy, entityTypesCopy[entityName]);
                expect(actual).toEqual(expected);
            });
    });

    describe('createEmptyItem()', () => {
        test.each([
            ['address', {id: null, address1: '', address2: '', city: '', postalCode: '', country: null}]
        ])('case , entityName=%s , expected=%o',
            (entityName, expected) => {
                const entityTypesCopy = deepCopy(entityTypes);
                setEveryFieldsInternalReferences(entityTypesCopy, entityName);
                const actual = createEmptyItem(entityTypesCopy, entityTypesCopy[entityName]);
                expect(actual).toEqual(expected);
            });
    });

});

describe('initializeEntityTypes()', () => {
});


