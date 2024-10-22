import React from 'react'

function Button({ type, text, onClickAction }) {
    return <button className={type} onClick={onClickAction}>{text}</button>;
}

export default Button
