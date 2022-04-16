import React from 'react';
import { useSelector } from 'react-redux';
import { selectCol } from '../../app/dataSlice'
import { Card } from '../Card';
import styles  from './col.module.scss';

/**
 * 此为每列的容器组件
 */
export function Col(props) {
    const {depth, className = '', ...rest} = props;
    const list = useSelector(selectCol(depth));
    return (
        <div className={`${styles.col} ${styles[className] || ''}`} {...rest}>
            {list.map((node) => {
                return (
                    <Card key={node.id} node={node} />
                );
            })}
        </div>
    );
}