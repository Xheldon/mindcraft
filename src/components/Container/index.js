import React from 'react';
import { useSelector } from 'react-redux';
import { selectDepth } from '../../app/dataSlice'
import { Col } from '../Col';
import styles  from './container.module.scss';

/**
 * 此为每列的容器组件
 */
export function Container(props) {
    // Note: 最大深度
    const depth = useSelector(selectDepth);
    console.log('depth:', depth);
    return (
        <div className={styles.container}>
            {Array.apply(null, {length: depth}).map((_, key) => {
                return <Col className={depth === 1 ? 'col-min' : ''} key={key} depth={key}/>
            })}
        </div>
    );
}