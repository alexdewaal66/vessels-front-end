import React from 'react';
import { FieldEl, formStyles, ButtonRow } from '../formLayouts';

export function EditButtons({requestState, setRequestMethod, readOnly, isEligible, form}) {
    // const logRoot = rootMkr(EditButtons);
    const {isValid} = form.formState;
    const {isPending} = requestState;
    const isDisabled = isPending || !isValid;

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
                        <button type="submit"
                                className={style(isDisabled || !isEligible)}
                                disabled={isDisabled || !isEligible}
                                onClick={setRequestMethod('put')}
                                id="submit_put"
                                key="submit_put"
                            // accessKey={'w'}
                        >
                            Wijzig
                        </button>
                        <button type="submit"
                                className={style(isDisabled)}
                                disabled={isDisabled}
                                onClick={setRequestMethod('post')}
                                id="submit_post"
                                key="submit_post"
                            // accessKey={'n'}
                        >
                            Maak nieuw
                        </button>
                        <button type="submit"
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
 */