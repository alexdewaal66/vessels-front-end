import React from 'react';
import { FieldEl, formStyles, ButtonRow } from '../formLayouts';
import { hints, languageSelector } from '../helpers';

const messages = {
    NL: {
        invalid: 'formulier niet juist ingevuld',
        pending: 'formulier wordt verzonden',
        ineligible: 'geen autorisatie om te wijzigen/verwijderen',
        update: 'Wijzig',
        create: 'Maak nieuw',
        delete: 'Verwijder',
    },
    EN: {
        invalid: 'form has invalid inputs',
        pending: 'sending form',
        ineligible: 'no authorisation to update/delete',
        update: 'Update',
        create: 'Create',
        delete: 'Delete',
    }
};


export function EditButtons({requestState, setRequestMethod, readOnly, isEligible, form}) {
    // const logRoot = rootMkr(EditButtons);
    const TXT = messages[languageSelector()];

    const {isValid} = form.formState;
    const hintValid = !isValid && TXT.invalid;
    const {isPending} = requestState;
    const hintPending = isPending && TXT.pending;
    const isDisabled = isPending || !isValid;
    const hintEligible = !isEligible && TXT.ineligible;

    function style(condition) {
        return condition ? formStyles.disabled : formStyles.enabled;
    }

    return (
        <ButtonRow title={hints('Pending: ' + isPending,
            'Eligible: ' + isEligible,
            'Valid: ' + isValid,
            'Disabled: ' + isDisabled
        )}>
            <FieldEl/>
            <FieldEl>
                {!readOnly && (
                    <>
                        <button
                            title={hints(hintEligible, hintPending, hintValid)}
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
                        <button
                            title={hints(hintPending, hintValid)}
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
                            title={hints(hintEligible, hintPending, hintValid)}
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

 ----------------------------------------------------------------------------------------

                                 {...onHoverHint(true, wijzigHint)}

 */