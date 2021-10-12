const functionClassifiers = {
    EN: {
        1: 'Port, as defined in UN/ECE Recommendation 16.',
        2: 'Rail terminal',
        3: 'Road terminal',
        4: 'Airport',
        5: 'Postal exchange office',
        6: 'reserved for multimodal functions, ICDs etc.',
        7: 'reserved for fixed transport functions (e.g. oil platform).',
        B: 'Specifies that the location is Border crossing.',
        0: 'functional use is not known and is to be specified',
    },
    NL: {
        1: 'Haven',
        2: 'Treinstation',
        3: 'Wegterminal',
        4: 'Luchthaven',
        5: 'Postkantoor',
        6: 'Multimodale functies, ICDs etc.',
        7: 'Vaste transport functies (bv. olieplatform)',
        B: 'Grensovergang',
        0: 'Gebruik onbekend. Moet nog vastgelegd worden',
    },
};


const transformations = {
    unLocode: {
        functionClassifier: (value) => {
            // console.log(`transformations.unLocode.functionClassifier(${value})`);
            let output = {};
            for (const c of value) {
                if (c !== '-')
                    output[c] = functionClassifiers.NL[c];
            }
            return output;
        }
    }
};

export function transform(entityName, propertyName, value) {
    // console.log('transform()');
    return transformations[entityName][propertyName](value);
}