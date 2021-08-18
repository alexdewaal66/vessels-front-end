import React from 'react';
import { cx } from '../helpers/multipleStyles';

export function Empty({children, className, ...rest}) {
    return (
        <div className={cx('', className)} {...rest}>
            {children}
        </div>
    );
}

/*********************************

const initialState = { width: 15 }
const actions = {plus: 'plus', minus: 'minus'}

const reducer = (state, action) => {
    switch (action) {
        case actions.plus:
            return { width: state.width + 15 }
        case actions.minus:
            return { width: Math.max(state.width - 15, 2) }
        default:
            throw new Error("what's going on?" )
    }
}

const Bar = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return <>
        <div style={{marginTop: '3rem'}}>
            <button onClick={() => dispatch(actions.plus)}>Increase bar size</button>
            <button onClick={() => dispatch(actions.minus)}>Decrease bar size</button>
        </div>
    </>
}

render(Bar)

 /***************************************/