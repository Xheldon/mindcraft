import React from 'react';
import { useSelector } from 'react-redux';
import { selectCol } from '../../app/dataSlice'
import { Card } from '../Card';
import styles  from './style.module.css';

/**
 * 此为每列的容器组件
 */
export function Col(props) {
    const {depth} = props;
    console.log('depthh:', depth);
    const list = useSelector(selectCol(depth));
    console.log('list:', list);
    return (
        <div className={styles.col}>
            {list.map((node) => {
                return (
                    <Card key={node.id} node={node} />
                );
            })}
        </div>
    );
}