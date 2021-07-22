import React, { useContext } from 'react';
import commandStyles from './command.module.css';
import pageLayout from '../pageLayouts/pageLayout.module.css';


export function Command({commandList, choice, children, ...rest}) {
    // console.log(`commandList=`, commandList);

    return (
        <nav className={pageLayout.command} {...rest}>
            {children}
            <div className={commandStyles.nav}>
                <h4>Opdrachten:</h4>

                <ul className={commandStyles.ul}>
                    {commandList?.displayOrder.map(command =>
                        <li key={command.name}
                            onClick={() => choice.set(command)}
                        >
                            <a href="javascript:void(0)"
                               className={choice.value === command
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




