import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addChildren,
    removeChildren,
    selectPath,
} from '../../app/dataSlice'

import styles  from './style.module.css';

/**
 * 此为每列的容器组件
 */
export function Card(props) {
    const {node} = props;
    const dispatch = useDispatch();
    const path = useSelector(selectPath(node));
    console.log('path:', path);
    return (
        <div className={styles.card} >
            <div className={styles['card-add']} onClick={() => dispatch(addChildren({
                path,
                position: 'before'
            }))}>前面添加</div>
            {node.id}
            <div className={styles['card-remove']} onClick={() => dispatch(addChildren({
                path,
                position: 'after'
            }))}>后面添加</div>
        </div>
    );
}