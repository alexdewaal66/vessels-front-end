import { entityNameList, entityTypes } from '../../helpers';
import { useStorage } from '../../helpers';
import { render } from '@testing-library/react';
import {actual, setActual, TestHook } from '../__resources__/testHook';

describe('useStorage', () => {
    describe('store-entityTypes consistency', () => {
        render(<TestHook
            useHook={useStorage}
            getHook={setActual}
        />);

        const {store} = actual;
        const storeKeys = Object.keys(store);

        test.each(storeKeys.filter(key => key !== 'timestamps'))
        ('dictName=%s', (dictName) => {
            expect(entityTypes).toHaveProperty(dictName);
        });

        test.each(entityNameList)('entityName', (entityName) => {
            expect(store).toHaveProperty(entityName);
        });

        test('timestamps', () => {
          expect(store).toHaveProperty('timestamps');
        });
    });
});
