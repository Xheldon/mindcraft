import React from 'react';
import styles  from './style.module.css';

/**
 * 此为每列的容器组件
 */
export function Header(props) {
    const {children} = props;
    return (
        <div className={styles.header}>
            {children}
        </div>
    );
}