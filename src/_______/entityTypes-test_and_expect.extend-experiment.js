/*************************************************************************


 const getOnlyValidationEntries = (entityType) =>
 Object.values(entityType.fields).filter(
 field => 'validation' in field
 );

 expect.extend({
    toHaveNoValidationXorBeExpanded(receivedField, originalField, fieldName) {
        const vo = 'validation' in originalField;
        const vr = 'validation' in receivedField;
        const er = vr && ('value' in receivedField.validation) && ('message' in receivedField.validation);
        const noVals = (!vo && !vr);
        const isExp = (vo && er);
        const pass = noVals || isExp;
        const erBit = vo && vr ? er : '*';
        const msgKey = `${+vo}${+vr}${erBit}`;
        const msgs = {
            '00*': 'exp. a validation',
        };
        const msg = (msgKey) =>;

    }
});

 //     Vo      Vr      Er     ->  pass     msg
 // ------------------------------------------------------------
 //     0       0       *           1       exp. a validation
 //     0       1       *           0       did not exp. a validation to appear
 //     1       0       *           0       did not exp. the validation to disappear
 //     1       1       0           0       exp. validation to be expanded
 //     1       1       1           1       did not exp. validation to be expanded




 describe('expandEveryFieldsValidations()',
 () => {
            test.each([
                entityEntries()
            ])('entityName=%s',
                (entityName, entityType, entityTypesCopy) => {
//    -----------------------------------------------------------------
                    expandEveryFieldsValidations(entityTypesCopy, entityName);
                    // expect(entityTypesCopy[entityName].fields)
//    -----------------------------------------------------------------
                });
        }
 );


 *********************************************************/

// const ternaryLogic = {T: true, F: false, d: "don't care"};

function createTruthTable(tableDefinition) {
    const entries = Object.entries(tableDefinition);
    const rows = entries.length;
    const inputs = entries[0][0].length;
    const outputs = entries[0][1].length;

    return function (...args) {
        if (args.length !== inputs) throw 'wrong number of arguments, expected ' + inputs;

        const key = args.reduce((previous, current) => previous.concat(+!!current), '');
        const values = tableDefinition[key].split('');
        return values.map(c => !!+c);
    };
}

const and = createTruthTable({
    '00': '0',
    '01': '0',
    '10': '0',
    '11': '1'
});

const p = createTruthTable({
    '000': '1',
    '001': '1',
    '010': '0',
    '011': '0',
    '100': '0',
    '101': '0',
    '110': '0',
    '111': '1',
});

