import { languageSelector } from './utils';

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
        1: 'Haven, zoals gedefinieerd in UN/ECE Aanbeveling 16.',
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
    NL: {
        AA: 'Goedgekeurd door bevoegd agentschap van de nationale regering',
        AC: 'Goedgekeurd door douaneautoriteit',
        AF: 'Goedgekeurd door nationale handelsbevorderingsorganisatie',
        AI: 'Code aangenomen door internationale organisatie (IATA of ECLAC)',
        AS: 'Goedgekeurd door de nationale normalisatie-instelling',
        RL: 'Erkende locatie - Bestaan en vertegenwoordiging van locatienaam bevestigd door controle tegen genomineerd plaatsnaamregister of ander naslagwerk',
        RN: 'Aanvraag van geloofwaardige nationale bronnen voor locaties in hun eigen land',
        RQ: 'Aanvraag in behandeling',
        RR: 'Aanvraag afgewezen',
        QQ: 'Oorspronkelijke vermelding niet geverifieerd sinds aangegeven datum',
        XX: 'Vermelding die uit het volgende uitgave van UN/LOCODE wordt verwijderd»',
    },
};

const transformations = {
    unLocode: {
        functionClassifier: (value) => {
            // logv(pathMkr('transform.js', transformations.unLocode.functionClassifier, value));
            let output = {};
            for (const c of value) {
                if (c !== '-')
                    output[c] = functionClassifiers[languageSelector()][c];
            }
            return output;
        },
        status: (value) => {
            return {[value]: status[languageSelector()][value]};
        },
    },
};

export function transform(entityName, fieldName, value) {
    // console.log('transform()');
    return transformations[entityName][fieldName](value);
}
