import { FC } from 'react'

interface ButtonProps {
    text: string
    onClick: any
    margin?: string
    padding?: string
    color?: string
    backgroundColor?: string
}

export const Button: FC<ButtonProps> = ({
    text,
    onClick,
    margin = '0',
    padding = '4px 7px',
    color = 'var(--color-dark)',
    backgroundColor = 'var(--color-white)'
}) => {
    return (
        <button
            onClick={onClick}
            style={{
                margin: margin,
                padding: padding,
                color: color,
                backgroundColor: backgroundColor,
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                borderRadius: '3px'
            }}
        >
            {text}
        </button>
    )
}