import React, { useState } from 'react';
import { FieldEl, formStyles, ButtonRow } from '../formLayouts';
import { hints } from '../helpers';

export function EditButtons({requestState, setRequestMethod, readOnly, isEligible, form}) {
    // const logRoot = rootMkr(EditButtons);
    const {isValid} = form.formState;
    const hintValid = !isValid && 'formulier niet juist ingevuld';
    const {isPending} = requestState;
    const hintPending = isPending && 'formulier wordt verzonden';
    const isDisabled = isPending || !isValid;
    const hintEligible = !isEligible && 'geen autorisatie om te wijzigen/verwijderen';

    function style(condition) {
        return condition ? formStyles.disabled : formStyles.enabled;
    }

    return (
        <ButtonRow>
            <FieldEl>
                {/*P:{+isPending} , E:{+isEligible} , V:{+isValid}*/}
                {/*<br/>*/}
                {/*DA:{+isDisabled}*/}
            </FieldEl>
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
                            Wijzig
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
                            Maak nieuw
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
                            Verwijder
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