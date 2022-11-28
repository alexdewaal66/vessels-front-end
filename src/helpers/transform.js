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

const status = {
    EN: {
        AA: 'Approved by competent national government agency',
        AC: 'Approved by Customs Authority',
        AF: 'Approved by national facilitation body',
        AI: 'Code adopted by international organisation (IATA or ECLAC)',
        AS: 'Approved by national standardisation body',
        RL: 'Recognised location - Existence and representation of location name confirmed by check against nominated gazetteer or other reference work',
        RN: 'Request from credible national sources for locations in their own country',
        RQ: 'Request under consideration',
        RR: 'Request rejected',
        QQ: 'Original entry not verified since date indicated',
        XX: 'Entry that will be removed from the next issue of UN/LOCODE»',
    },
    NL: {},
};

const transformations = {
    unLocode: {
        functionClassifier: (value) => {
            // logv(pathMkr('transform.js', transformations.unLocode.functionClassifier, value));
            let output = {};
            for (const c of value) {
                if (c !== '-')
                    output[c] = functionClassifiers.NL[c];
            }
            return output;
        },
        status: (value) => {
            return {[value]: status.EN[value]};
        },
    },
};

export function transform(entityName, fieldName, value) {
    // console.log('transform()');
    return transformations[entityName][fieldName](value);
}
