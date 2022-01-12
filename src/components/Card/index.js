import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addPrev,
    addNext,
    addChildren,
    selectData,
    highlight,
} from '../../app/dataSlice'

import styles  from './style.module.css';
import RichTextEditor from '../Editor';

/**
 * 此为每列的容器组件
 */
export function Card(props) {
    const {node} = props;
    const dispatch = useDispatch();
    const data = useSelector(selectData);
    console.log('data:', data);
    return (
        <div className={styles.card} style={{
            backgroundColor: node.isHighlight ? 'yellow' : null,
        }} onClick={(e) => {
            // TODO: 点击卡片的时候高亮子级节点和祖先节点
            e.stopPropagation();
            const hlt = highlight({node});
            console.log('hlt:', hlt);
            dispatch(hlt);
        }}>
            <div className={styles['card-add-prev']} onClick={(e) => {
                e.stopPropagation();
                const add = addPrev({node});
                console.log('addPrev:', add);
                dispatch(add);
            }}>👆🏻添加</div>
            <RichTextEditor />
            <div className={styles['card-add-children']} onClick={(e) => {
                e.stopPropagation();
                const add = addChildren({
                    node,
                });
                console.log('addChildren:', add);
                dispatch(add);
            }}>👉🏻添加</div>
            <div className={styles['card-add-next']} onClick={(e) => {
                e.stopPropagation();
                const add = addNext({
                    node,
                });
                console.log('addNext:', add);
                dispatch(add);
            }}>👇🏻添加</div>
        </div>
    );
}