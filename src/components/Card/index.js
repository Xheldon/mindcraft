import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addPrev,
    addNext,
    addChildren,
    selectPath,
    selectData,
} from '../../app/dataSlice'

import styles  from './style.module.css';

/**
 * 此为每列的容器组件
 */
export function Card(props) {
    const {node} = props;
    const dispatch = useDispatch();
    const data = useSelector(selectData);
    console.log('data:', data);
    return (
        <div className={styles.card} onClick={() => {
            // TODO: 点击卡片的时候高亮子级节点和祖先节点
        }}>
            <div className={styles['card-add-prev']} onClick={(e) => {
                e.stopPropagation();
                const add = addPrev({node});
                console.log('addPrev:', add);
                dispatch(add);
            }}>前面添加</div>
            {node.id}
            <div className={styles['card-add-children']} onClick={(e) => {
                e.stopPropagation();
                const add = addChildren({
                    node,
                });
                console.log('addChildren:', add);
                dispatch(add);
            }}>添加子节点</div>
            <div className={styles['card-add-next']} onClick={(e) => {
                e.stopPropagation();
                const add = addNext({
                    node,
                });
                console.log('addNext:', add);
                dispatch(add);
            }}>后面添加</div>
        </div>
    );
}