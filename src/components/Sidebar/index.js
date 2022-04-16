import React from 'react';
import styles  from './sidebar.module.scss';

/**
 * 此为每列的容器组件
 */
export function Sidebar(props) {
    return (
        <div className={styles.sidebar}>
            这是一个简单的 Sidebar list
        </div>
    );
}