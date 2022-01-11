import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from 'uuid';

// TODO: 考虑使用链表，而不是数组，链表查找速度更快
let initialState = [{
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
            // TODO: 反序列化的时候，parent 字段存的是 id，不是引用，因为序列化的时候引用不能被序列化
            state = action.payload;
        },
        addPrev: (state, action) => {
            // action.payload = { path: [xxx, yyy], _pathssition: after | before | null}; 节点插入到 zzz 的后面
            // null 表示是添加第一个元素
            const { node: curr } = action.payload;
            const newNode = JSON.parse(JSON.stringify(node));
            newNode.depth = curr.depth;
            newNode.id = uuid();
            newNode.parent = curr.parent;
            function find(data) {
                data.forEach((item, key) => {
                    if (item.id === curr.id) {
                        data.splice(key, 0, newNode);
                    } else {
                        find(item.children);
                    }
                });
            }
            find(state);
        },
        addNext: (state, action) => {
            const { node: curr } = action.payload;
            const newNode = JSON.parse(JSON.stringify(node));
            newNode.depth = curr.depth;
            newNode.id = uuid();
            newNode.parent = curr.parent;
            function find(data) {
                data.forEach((item, key) => {
                    if (item.id === curr.id) {
                        data.splice(key + 1, 0, newNode);
                    } else {
                        find(item.children);
                    }
                });
            }
            find(state);
        },
        addChildren: (state, action) => {
            // action.payload = { path: [xxx, yyy], _pathssition: after | before | null}; 节点插入到 zzz 的后面
            // null 表示是添加第一个元素
            const { node: curr } = action.payload;
            const newNode = JSON.parse(JSON.stringify(node));
            newNode.depth = curr.depth + 1;
            newNode.id = uuid();
            newNode.parent = curr.id;
            // Note: 不论节点有没有内容，新添加的节点都放到最后面，直接修改 curr.children.push 会报错：
            //  Uncaught TypeError: Cannot add property 0, object is not extensible
            function find(data) {
                data.forEach((item) => {
                    if (item.id === curr.id) {
                        item.children.push(newNode);
                    } else {
                        find(item.children);
                    }
                });
            }
            find(state);
        },
        removeChildren: (state, action) => {
            // Note: 寻找 action payload 中的 id 对应的 node, 移除之
            const { node } = action.payload;
            const list = node.parent ? node.parent.children : state;
            const index = list.findIndex(child => child.id === node.id);
            list.splice(index, 1);
        }
    }
});

export const { initState, addPrev, addNext, addChildren, removeChildren} = dataSlice.actions;

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
        return find(state.data, depth);
    };
};

export const selectPath = node => {
    let list = [];
    return () => {
        let _node = node;
        // Note: 先将当前节点放到最后
        list.push(node.id);
        while(_node.parent) {
            list.unshift(node.parent);
            _node = node.parent;
        }
        return list;
    }
};

export default dataSlice.reducer;