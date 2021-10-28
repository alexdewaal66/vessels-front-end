import React from 'react';
import commandStyles from './command.module.css';
import pageLayout from '../pageLayouts/pageLayout.module.css';


export function Command({commandList, choice, setChoice, children, className, ...rest}) {

    const makeChoice = c => () => setChoice(c);

    return (
        <nav className={pageLayout.command} {...rest}>
            {children}
            <div className={commandStyles.nav}>
                <h4>Gegevens:</h4>

                <ul className={commandStyles.ul}>
                    {/*{commandList?.map(command =>*/}
                    {commandList?.map(command =>
                        <li key={command.label}
                            onClick={makeChoice(command)}
                            className={choice === command
                                ? commandStyles.selected
                                : null
                            }
                        >
                            {command.label}
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

/*
                            <a className={choice.value === command
                                ? commandStyles.selected
                                : null
                            }>
                                {command.name}
                            </a>

                            <button type="button"
                                    className={commandStyles.linkButton}
                            >
                                {command.name}
                            </button>
 */