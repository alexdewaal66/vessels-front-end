import { useForm } from 'react-hook-form';
import { quantities, UnitInput } from './UnitInput';

export function TestCalculatingNumberInput() {
    // const [result, setResult] = useState(0);
    const entityForm = useForm({
        mode: 'onChange'
    });

    const quantity = quantities.displacement;

    return(
        <>
            <UnitInput fieldName={quantity}
                       entityForm={entityForm}
                       defaultValue={20}
                       typeField={{quantity, validation: {min: 0}}}
                       readOnly={false}
                       isEligible={true}
                       quantity={quantity}
                       elKey={'UnitInput'}
            />
        </>
    );
}