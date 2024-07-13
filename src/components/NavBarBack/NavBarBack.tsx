import { NavBar } from 'antd-mobile';
import React from 'react'

interface NavBarBackProps {
    content?: string;
    style?: React.CSSProperties;
}
export default function NavBarBack(props: NavBarBackProps) {
    const { content, style } = props;
    const back = () => {
        history.back();
    }
    return (
        <div style={style}>
            <NavBar back='返回' onBack={back}>
                {content}
            </NavBar>
        </div>
    )
}
