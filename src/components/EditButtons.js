import React from 'react';
import { logv } from '../dev/log';
import { FieldEl, FieldRow } from '../formLayouts';

export function EditButtons({requestState, setRequestMethod, readOnly}) {
    const logRoot = EditButtons.name;

    return (
        <FieldRow>
            <FieldEl> </FieldEl>
            <FieldEl>
                {!readOnly && (
                    <>
                        <button type="submit" className="form-button"
                                disabled={requestState.isPending}
                                onClick={setRequestMethod('put')}
                                key="submit_put"
                            // accessKey={'w'}
                        >
                            Wijzig
                        </button>
                        <button type="submit" className="form-button"
                                disabled={requestState.isPending}
                                onClick={setRequestMethod('post')}
                                key="submit_post"
                            // accessKey={'n'}
                        >
                            Maak nieuw
                        </button>
                        <button type="submit" className="form-button"
                                disabled={requestState.isPending}
                                onClick={setRequestMethod('delete')}
                                key="submit_del"
                            // accessKey={'v'}
                        >
                            Verwijder
                        </button>
                    </>
                    )}
                <button type="submit" className="form-button"
                        disabled={requestState.isPending}
                        onClick={setRequestMethod('search')}
                        key="submit_search"
                >
                    Zoek
                </button>
            </FieldEl>
        </FieldRow>
    );
}