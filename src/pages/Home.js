import React, { useState } from 'react';
import { Colors } from '../dev/Colors';
import { Empty } from '../dev/Empty';
import { Main, Command, Aside, Content } from '../pageLayouts';
// import { useForm } from 'react-hook-form';
import { now } from '../helpers/utils';

const choices = {
    empty: {name: 'leeg', Comp: Empty},
    colors: {name: 'kleuren', Comp: Colors},
};

export default function Home() {
    const [choice, setChoice] = useState(choices.empty);
    // const {handleSubmit, register} = useForm();
    // const ChosenComp = Colors;

    function onSubmit(e) {
        console.log(now() + ' onSubmit()', e.target.value);
        setChoice(choices[e.target.value]);
    }

    return (
        <Content>
            <Main>
                <choice.Comp/>
            </Main>
            <Command>
                {Object.keys(choices).map(k =>
                    <button onClick={onSubmit}
                            type="submit"
                            value={k}
                    >
                        {choices[k].name}
                    </button>
                )}
                COMMAND & CONQUER
            </Command>
            <Aside>
                ASIDE
            </Aside>
        </Content>
    );
}

