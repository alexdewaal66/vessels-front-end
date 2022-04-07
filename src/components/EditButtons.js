import React from 'react';
import { FieldEl, FieldRow, formStyles } from '../formLayouts';
import { ButtonRow } from '../formLayouts/ButtonRow';

export function EditButtons({requestState, setRequestMethod, readOnly, isEligible, children}) {
    // const logRoot = rootMkr(EditButtons);
    // const { isDirty, isValid} = EditEntityFormFunctions;
    const {isPending} = requestState;
    const pendingStyle = isPending ? formStyles.disabled : formStyles.enabled;
    const isDisabled = isPending || !isEligible;// || !isDirty || !isValid;
    const changeStyle = isDisabled ? formStyles.disabled : formStyles.enabled;
    /*
    D:{isDirty ? 1 : 0} V:{isValid ? 1 : 0}
     */
    return (
        <ButtonRow>
            <FieldEl>
                {/*P:{+isPending} , E:{+isEligible} , D:{+isDisabled}*/}
            </FieldEl>
            <FieldEl>
                {!readOnly && (
                    <>
                        <button type="submit"
                                className={changeStyle}
                                disabled={isDisabled}
                                onClick={setRequestMethod('put')}
                                id="submit_put"
                                key="submit_put"
                            // accessKey={'w'}
                        >
                            Wijzig
                        </button>
                        <button type="submit"
                                className={pendingStyle}
                                disabled={isPending}
                                onClick={setRequestMethod('post')}
                                id="submit_post"
                                key="submit_post"
                            // accessKey={'n'}
                        >
                            Maak nieuw
                        </button>
                        <button type="submit"
                                className={changeStyle}
                                disabled={isDisabled}
                                onClick={setRequestMethod('delete')}
                                id="submit_del"
                                key="submit_del"
                            // accessKey={'v'}
                        >
                            Verwijder
                        </button>
                    </>
                )}
                {children}
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