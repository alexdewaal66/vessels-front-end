import React, { useContext } from 'react';
import commandStyles from './command.module.css';
import pageLayout from '../pageLayouts/pageLayout.module.css';


export function Command({commandList, choice, children, className, ...rest}) {

    const makeChoice = c => () => choice.set(c);

    return (
        <nav className={pageLayout.command} {...rest}>
            {children}
            <div className={commandStyles.nav}>
                <h4>Opdrachten:</h4>

                <ul className={commandStyles.ul}>
                    {commandList?.displayOrder.map(command =>
                        <li key={command.name}
                            // todo: choose between anonymous or curried function
                            // onClick={() => choice.set(command)}
                            onClick={makeChoice(command)}
                        >
                            <a className={choice.value === command
                                    ? commandStyles.selected
                                    : null
                                }>
                                {command.name}
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}




