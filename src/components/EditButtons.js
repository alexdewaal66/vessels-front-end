import React from 'react';
import { FieldEl, formStyles, ButtonRow } from '../formLayouts';
import { devHints, languageSelector } from '../helpers';
import { accessPurposes } from '../helpers/globals/levels';
import { logCondition, logv, rootMkr } from '../dev/log';

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
        canUpdate: '• mag wijzigen',
        canCreate: '• mag nieuwe maken',
        canDelete: '• mag verwijderen',
        canNotUpdate: '• mag niet wijzigen',
        canNotCreate: '• mag geen nieuwe maken',
        canNotDelete: '• mag niet verwijderen',
        error:''
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
        canUpdate: '• can update',
        canCreate: '• can create',
        canDelete: '• can delete',
        canNotUpdate: '• can not update',
        canNotCreate: '• can not create',
        canNotDelete: '• can not delete',
    }
};


export function EditButtons({
                                requestState, setRequestMethod, readOnly,
                                isEligible, form, onlyUpdate, toEntity
                            }) {
    const logRoot = rootMkr(EditButtons);
    const doLog = logCondition(EditButtons, '*')
    const TXT = messages[languageSelector()];

    const {isValid} = form.formState;
    const hintValid = isValid ? TXT.valid : TXT.invalid;
    const {isPending} = requestState;
    const hintPending = isPending ? TXT.pending : TXT.notPending;
    const isDisabled = isPending || !isValid;
    const hintEligible = isEligible ? TXT.eligible : TXT.ineligible;
    const canUpdate = toEntity(accessPurposes.UPDATE);
    const hintUpdate = canUpdate ? TXT.canUpdate : TXT.canNotUpdate;
    const canCreate = toEntity(accessPurposes.CREATE);
    const hintCreate = canCreate ? TXT.canCreate : TXT.canNotCreate;
    const canDelete = toEntity(accessPurposes.DELETE);
    const hintDelete = canDelete ? TXT.canDelete : TXT.canNotDelete;

    if (doLog) logv(logRoot, {canUpdate, canCreate, canDelete});

    function style(condition) {
        return isPending
            ? formStyles.pending
            : condition ? formStyles.disabled : formStyles.enabled;
    }

    return (
        <ButtonRow title={devHints(hintEligible, hintPending, hintValid, hintUpdate, hintCreate, hintDelete)}>
            <FieldEl/>
            <FieldEl>
                {!readOnly && (
                    <>
                        <button
                            type="submit"
                            className={style(isDisabled || !isEligible || !canUpdate)}
                            disabled={isDisabled || !isEligible || !canUpdate}
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
                                    className={style(isDisabled || !canCreate)}
                                    disabled={isDisabled || !canCreate}
                                    onClick={setRequestMethod('post')}
                                    id="submit_post"
                                    key="submit_post"
                                    // accessKey={'n'}
                                >
                                    {TXT.create}
                                </button>
                                <button
                                    type="submit"
                                    className={style(isDisabled || !isEligible || !canDelete)}
                                    disabled={isDisabled || !isEligible || !canDelete}
                                    onClick={setRequestMethod('delete')}
                                    id="submit_del"
                                    key="submit_del"
                                    // accessKey={'v'}
                                >
                                    {TXT.delete}
                                </button>
                            </>
                        )}
                        {requestState.isError && (
                            <span className={formStyles.error}>
                                {TXT.error}
                            </span>
                        )}
                    </>
                )}
            </FieldEl>
        </ButtonRow>
    );
}

