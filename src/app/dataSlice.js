import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from 'uuid';

const initialState = [{
    type: 'node',
    depth: 0,
    isSelete: false,
    isHighlight: false,
    parent: null,
    id: uuid(),
    isFirst: false,
    isLast: false,
    isReadOnly: false,
    children: [],
}];

const node = {
    type: 'node',
    depth: 0,
    isSelete: false,
    isHighlight: false,
    parent: null,
    isFirst: false,
    isLast: false,
    isReadOnly: false,
    children: [],
};

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        initState: (state, action) => {
            // Note: 初始加载的数据
            state.data = action.payload;
        },
        addChildren: (state, action) => {
            // action.payload = { path: [xxx, yyy], _pathssition: after | before | null}; 节点插入到 zzz 的后面
            // null 表示是添加第一个元素
            const { path, position } = action.payload;
            let _path = path;
            if (position) {
                _path = path.slice(0, -1);
            }
            // Note: 如果 _path 是空数组，说明是添加了根节点的兄弟元素，直接对 state 进行操作
            let parent = null;
            const children = _path.reduce((prev, curr) => {
                const data = prev.find(node => node.id === curr);
                if (data) {
                    parent = data;
                    return data.children;
                }
                return prev;
            }, state.data);
            // TODO
            const newNode = JSON.parse(JSON.stringify(node));
            newNode.depth = parent.depth + 1;
            newNode.id = uuid();
            // Note: 子节点保持对父节点的引用
            newNode.parent = parent;
            if (children.length) {
                // Note: 此时说明是在一个已有 children 的元素中添加子节点，depth 继承已有的子节点
                const index = children.findIndex(node => node.id === path[path.length - 1]);
                children.splice(position === 'after' ? index + 1 : index, 0, newNode);
            } else {
                // Note: 此时说明是在一个还未有元素的节点添加子节点, depth + 1
                children.push(newNode);
            }
        },
        removeChildren: (state, action) => {
            // Note: 寻找 action payload 中的 id 对应的 node, 移除之
            const { path } = action.payload;
            const _path = path.slice(0, -1);
            const children = _path.reduce((prev, curr) => {
                const data = prev.find(node => node.id === curr);
                if (data) {
                    return data.children;
                }
                return prev;
            }, state.data);
            // Note: children 一定存在
            const index = children.findIndex(node => node.id === path[path.length - 1]);
            children.splice(index, 1);
        }
    }
});

export const { initState, addChildren, removeChildren} = dataSlice.actions;

export const selectData = state => state.data;
export const selectDepth = state => {
    let deep = 0;
    state.data.forEach(node => {
    if (node.children) {
        deep = Math.max(deep, selectDepth({data: node.children}) + 1);
    } else {
        deep = deep + 1;  
    }
    });
    return deep;
};

export const selectCol = depth => {
    const list = [];
    function find(data, depth) {
        // Note: 深度优先遍历树
        data.forEach((node) => {
            if (node.depth === depth) {
                list.push(node);
            } else if (node.depth < depth) {
                find(node.children, depth);
            }
        });
        return list;
    };
    return (state) => {
        console.log('state in selectCol:', state);
        return find(state.data, depth);
    };
};

export const selectPath = node => {
    let list = [];
    return () => {
        console.log('node:', node);
        let _node = node;
        // Note: 先将当前节点放到最后
        list.push(node.id);
        while(_node.parent) {
            list.unshift(node.parent.id);
            _node = node.parent;
        }
        return list;
    }
};

export default dataSlice.reducer;