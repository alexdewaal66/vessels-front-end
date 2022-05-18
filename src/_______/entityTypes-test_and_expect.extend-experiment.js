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
