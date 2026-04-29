class Node {
    constructor(data) {
        this.data = data
        this.left = null
        this.right = null
    }
}

class Tree {
    constructor(array) {
        this.root = this.buildTree(array);
    }

    buildTree(array) {
        const sortedUnique = [...new Set(array)].sort((a, b) => a - b);

        const recursiveBuild = (arr, start, end) => {
            if (start > end) return null;

            const mid = Math.floor((start + end) / 2);
            const node = new Node(arr[mid]);

            node.left = recursiveBuild(arr, start, mid - 1);
            node.right = recursiveBuild(arr, mid + 1, end);

            return node;
        };

        return recursiveBuild(sortedUnique, 0, sortedUnique.length - 1);
    }

    insert(value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            return;
        }

        let current = this.root;
        while (true) {
            if (value === current.data) return; // Value already exists
            if (value < current.data) {
                if (!current.left) {
                    current.left = newNode;
                    return;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return;
                }
                current = current.right;
            }
        }
    }

    deleteItem(value, node = this.root) {
        if (!node) return null;

        if (value < node.data) {
            node.left = this.deleteItem(value, node.left);
        } else if (value > node.data) {
            node.right = this.deleteItem(value, node.right);
        } else {
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            let successor = node.right;
            while (successor.left) successor = successor.left;
            node.data = successor.data;
            node.right = this.deleteItem(successor.data, node.right);
        }

        return node;
    }

    includes(value) {
        let current = this.root;
        while (current) {
            if (value === current.data) return true;
            current = value < current.data ? current.left : current.right;
        }
        return false;
    }

    levelOrderForEach(callback) {
        if (!callback) throw new Error("Callback is required");
        const queue = [this.root];
        while (queue.length > 0) {
            const node = queue.shift();
            if (node) {
                callback(node.data);
                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }
        }
    }

    inOrderForEach(callback, node = this.root) {
        if (!callback) throw new Error("Callback is required");
        if (!node) return;
        this.inOrderForEach(callback, node.left);
        callback(node.data);
        this.inOrderForEach(callback, node.right);
    }

    preOrderForEach(callback, node = this.root) {
        if (!callback) throw new Error("Callback is required");
        if (!node) return;
        callback(node.data);
        this.preOrderForEach(callback, node.left);
        this.preOrderForEach(callback, node.right);
    }

    postOrderForEach(callback, node = this.root) {
        if (!callback) throw new Error("Callback is required");
        if (!node) return;
        this.postOrderForEach(callback, node.left);
        this.postOrderForEach(callback, node.right);
        callback(node.data);
    }

    height(value) {
        const findNode = (node, val) => {
            if (!node) return null;
            if (node.data === val) return node;
            return val < node.data ? findNode(node.left, val) : findNode(node.right, val);
        };

        const nodeHeight = (node) => {
            if (!node) return -1;
            return Math.max(nodeHeight(node.left), nodeHeight(node.right)) + 1;
        };

        const targetNode = findNode(this.root, value);
        return targetNode ? nodeHeight(targetNode) : undefined;
    }

    depth(value) {
        let count = 0;
        let current = this.root;
        while (current) {
            if (value === current.data) return count;
            current = value < current.data ? current.left : current.right;
            count++;
        }
        return undefined;
    }

    isBalanced(node = this.root) {
        const checkHeight = (curr) => {
            if (!curr) return 0;
            const leftH = checkHeight(curr.left);
            const rightH = checkHeight(curr.right);
            if (leftH === -1 || rightH === -1 || Math.abs(leftH - rightH) > 1) return -1;
            return Math.max(leftH, rightH) + 1;
        };
        return checkHeight(node) !== -1;
    }

    rebalance() {
        const vals = [];
        this.inOrderForEach((val) => vals.push(val));
        this.root = this.buildTree(vals);
    }
}

// Visualizer helper
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (!node) return;
  prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
};

// --- Driver Script ---
const randomArray = (size) => Array.from({length: size}, () => Math.floor(Math.random() * 100));

const bst = new Tree(randomArray(15));
console.log("Is Balanced:", bst.isBalanced());
prettyPrint(bst.root);

const printOrders = (tree) => {
  const log = (label, fn) => {
    let res = [];
    fn.call(tree, (v) => res.push(v));
    console.log(`${label}: ${res.join(", ")}`);
  };
  log("Level", tree.levelOrderForEach);
  log("Pre", tree.preOrderForEach);
  log("In", tree.inOrderForEach);
  log("Post", tree.postOrderForEach);
};

printOrders(bst);

console.log("\nUnbalancing...");
[150, 200, 300, 400].forEach(v => bst.insert(v));
console.log("Is Balanced:", bst.isBalanced());

bst.rebalance();
console.log("\nRebalanced!");
console.log("Is Balanced:", bst.isBalanced());
prettyPrint(bst.root);
printOrders(bst);