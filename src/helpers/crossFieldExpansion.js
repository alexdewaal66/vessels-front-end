
export function crossFieldExpansion(typeField, getValues) {
    if (!('crossFieldChecks' in typeField)) {
        return  typeField.validation;
    } else {
        const validation = {...typeField.validation, validate: {}};
        typeField.crossFieldChecks.forEach(xCheck => {
            validation.validate[xCheck.name] =
                value => xCheck.validate(value, getValues(xCheck.otherFieldName)) || xCheck.message;
        });
        return validation;
    }
}
