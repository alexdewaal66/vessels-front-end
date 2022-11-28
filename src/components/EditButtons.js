import React from 'react';
import { FieldEl, formStyles, ButtonRow } from '../formLayouts';
import { devHints, languageSelector } from '../helpers';

const messages = {
    NL: {
        valid: '• formulier juist ingevuld',
        invalid: '• formulier foutief ingevuld',
        pending: '• bezig met verzenden formulier',
        notPending: '• niet bezig met verzenden formulier',
        eligible: '• autorisatie om te wijzigen/verwijderen',
        ineligible: '• geen autorisatie om te wijzigen/verwijderen',
        update: 'Wijzig',
        create: 'Maak nieuw',
        delete: 'Verwijder',
    },
    EN: {
        valid: '• form entered correctly',
        invalid: '• form entered incorrectly',
        pending: '• sending form now',
        notPending: '• not sending form now',
        eligible: '• authorisation to update/delete',
        ineligible: '• no authorisation to update/delete',
        update: 'Update',
        create: 'Create',
        delete: 'Delete',
    }
};


export function EditButtons({requestState, setRequestMethod, readOnly, isEligible, form, onlyUpdate}) {
    // const logRoot = rootMkr(EditButtons);
    const TXT = messages[languageSelector()];

    const {isValid} = form.formState;
    const hintValid = isValid ? TXT.valid : TXT.invalid;
    const {isPending} = requestState;
    const hintPending = isPending ? TXT.pending : TXT.notPending;
    const isDisabled = isPending || !isValid;
    const hintEligible = isEligible ? TXT.eligible : TXT.ineligible;

    function style(condition) {
        return condition ? formStyles.disabled : formStyles.enabled;
    }

    return (
        <ButtonRow title={devHints(hintEligible, hintPending, hintValid)}>
            <FieldEl/>
            <FieldEl>
                {!readOnly && (
                    <>
                        <button
                            type="submit"
                            className={style(isDisabled || !isEligible)}
                            disabled={isDisabled || !isEligible}
                            onClick={setRequestMethod('put')}
                            id="submit_put"
                            key="submit_put"
                            // accessKey={'w'}
                        >
                            {TXT.update}
                        </button>
                        {!onlyUpdate && (
                            <>
                                <button
                                    type="submit"
                                    className={style(isDisabled)}
                                    disabled={isDisabled}
                                    onClick={setRequestMethod('post')}
                                    id="submit_post"
                                    key="submit_post"
                                    // accessKey={'n'}
                                >
                                    {TXT.create}
                                </button>
                                <button
                                    type="submit"
                                    className={style(isDisabled || !isEligible)}
                                    disabled={isDisabled || !isEligible}
                                    onClick={setRequestMethod('delete')}
                                    id="submit_del"
                                    key="submit_del"
                                    // accessKey={'v'}
                                >
                                    {TXT.delete}
                                </button>
                            </>
                        )}
                    </>
                )}
            </FieldEl>
        </ButtonRow>
    );
}

/*
                <button type="submit" className={formStyles.disabled}
                        disabled={isPending}
                        onClick={setRequestMethod('search')}
                        key="submit_search"
                >
                    Zoek
                </button>
 */