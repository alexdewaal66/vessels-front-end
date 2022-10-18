
export function crossFieldExpansion(typeField, getValues) {
    let validation;
    if (!('crossFieldChecks' in typeField)) {
        validation = typeField.validation;
    } else {
        validation = {...typeField.validation, validate: {}};
        typeField.crossFieldChecks.forEach(xCheck => {
            validation.validate[xCheck.name] =
                value => xCheck.validate(value, getValues(xCheck.otherFieldName)) || xCheck.message;
        });
    }
    return validation;
}
