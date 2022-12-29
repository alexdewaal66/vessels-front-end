import { useForm } from 'react-hook-form';
import { quantityNames, UnitInput } from '../components/UnitInput';
import { FieldDesc, FieldEl, FieldRow, Form, formStyles } from '../formLayouts';

export function TestCalculatingNumberInput() {
    // const [result, setResult] = useState(0);
    const entityForm = useForm({
        mode: 'onChange'
    });

    const fields = [
        {q: quantityNames.displacement, v: 200},
        {q: quantityNames.length, v: 50},
        {q: quantityNames.temperature, v: 300},
        {q: quantityNames.volume, v: Math.E},
    ];

    return (
        <Form>
            {fields.map(field =>
                <FieldRow key={'UnitInput' + field.q}>
                    <FieldDesc>
                        {field.q}
                    </FieldDesc>
                    <FieldEl className={formStyles.padding}>
                        <UnitInput fieldName={field.q}
                                   entityForm={entityForm}
                                   defaultValue={field.v}
                                   typeField={{quantity: field.q, validation: {min: 0}}}
                                   readOnly={false}
                                   isEligible={true}
                                   quantity={field.q}
                                   elKey={'UnitInput' + field.q}
                        />
                    </FieldEl>
                </FieldRow>
            )}
        </Form>
    );
}