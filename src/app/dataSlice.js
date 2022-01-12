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
                data.children.forEach((item, key) => {
                    if (item.id === curr.id) {
                        data.children.splice(key, 0, newNode);
                    } else {
                        find(item);
                    }
                });
            }
            find({children: state});
        },
        addNext: (state, action) => {
            const { node: curr } = action.payload;
            const newNode = JSON.parse(JSON.stringify(node));
            newNode.depth = curr.depth;
            newNode.id = uuid();
            newNode.parent = curr.parent;
            function find(data) {
                data.children.forEach((item, key) => {
                    if (item.id === curr.id) {
                        data.children.splice(key + 1, 0, newNode);
                    } else {
                        find(item);
                    }
                });
            }
            find({children: state});
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
                data.children.forEach((item) => {
                    if (item.id === curr.id) {
                        item.children.push(newNode);
                    } else {
                        find(item);
                    }
                });
            }
            find({children: state});
        },
        removeChildren: (state, action) => {
            // Note: 寻找 action payload 中的 id 对应的 node, 移除之
            const { node } = action.payload;
            const list = node.parent ? node.parent.children : state;
            const index = list.findIndex(child => child.id === node.id);
            list.splice(index, 1);
        },
        // FIXME: 方法过于丑陋，不过好理解
        highlight: (state, action) => {
            // Note: 高亮当前节点的祖先节点和后代节点
            const { node } = action.payload;
            console.log('highlight:', node);
            // Note: 高亮祖先+自己
            const list = [];
            function find(data, id) {
                data.children.forEach(child => {
                    if (child.id === id) {
                        list.push({id: child.id, depth: child.depth});
                        // Note: 找到后找父节点
                        if (child.parent) {
                            find({children: state}, child.parent);
                        }
                        return;
                    } else {
                        if (child.children) {
                            find(child, id);
                        }
                    }
                });
            }
            find({children: state}, node.id);
            // Note: 高亮后代
            function findDown(data, id, isFind) {
                if (isFind) {
                    data.children.forEach((child) => {
                        list.push({id: child.id, depth: child.depth});
                        findDown(child, null, true);
                    });
                } else {
                    data.children.forEach(child => {
                        if (child.id === id) {
                            findDown(child, null, true);
                        } else {
                            findDown(child, id, false);
                        }
                    });
                }
            }
            findDown({children: state}, node.id);
            // Note: 按 depth 高亮
            list.sort((a, b) => a.depth - b.depth);
            console.log('list:', list);
            function hlt(data, id) {
                data.children.forEach(child => {
                    if (child.id === id) {
                        child.isHighlight = true;
                        return;
                    } else {
                        hlt(child, id);
                    }
                });
            }
            function removeHlt(data) {
                data.children.forEach(child => {
                    child.isHighlight = false;
                    removeHlt(child);
                });
            }
            removeHlt({children: state});
            // Note: 先全部置为 false
            list.forEach(({id}) => {
                hlt({children: state}, id);
            });
        },
    }
});

export const {
    initState,
    addPrev,
    addNext,
    addChildren,
    removeChildren,
    highlight,
} = dataSlice.actions;

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