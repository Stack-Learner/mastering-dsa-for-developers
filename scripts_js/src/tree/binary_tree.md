### Binary Tree

A Binary Tree is a tree data structure where each node has at most two children, typically referred to as the left child and right child. This restriction to two children distinguishes binary trees from general trees, where nodes can have any number of children. Unlike a BST, a binary tree does not require nodes to follow any ordering (e.g., left child < parent < right child). This makes binary trees versatile for representing any hierarchical structure, such as:

- **Expression Trees**: Representing mathematical expressions (e.g., (3 + 5) \* 2).
- **Decision Trees**: Used in decision-making processes (e.g., yes/no questions in a game).
- **Hierarchical Data**: Like a family tree or organizational chart.

**Structure of a Binary Tree**

- **Nodes**: Each node contains a value (data) and pointers to its left and right children.
- **Root**: The topmost node, with no parent.
- **Leaves**: Nodes with no children.
- **Edges**: Connections between parent and child nodes.

**Full Binary Tree**

A **Full Binary Tree** is a binary tree where every node has either **0 or 2 children**. No node in the tree has exactly one child, ensuring that nodes are either leaves (0 children) or fully branched (2 children).

```jsx
Full Binary Tree

       1
      / \
     2   3
    / \
   4   5

Not a Full Binary Tree

       1
      / \
     2   3
    /
   4
```

**Complete Binary Tree**

A **Complete Binary Tree** is a binary tree where:

- All levels, except possibly the last, are fully filled.
- In the last level, nodes are filled from **left to right**, with no gaps between nodes.

```jsx
Complete Binary Trees

       1
      / \
     2   3
    / \
   4   5


       1
      / \
     2   3
    /
   4


Not Complete Binary Tree

       1
      / \
     2   3
      \
       5
```

**Perfect Binary Tree**

A **Perfect Binary Tree** is a binary tree where:

- All **internal nodes** have exactly two children.
- All **leaf nodes** are at the same level.
- Every level is fully filled.

```jsx
Perfect Binary Tree

       1
      / \
     2   3
    / \ / \
   4  5 6  7

Not A Perfect Binary Tree

       1
      / \
     2   3
    / \
   4   5
```

**Degenerate (Skewed) Binary Tree**

A **Degenerate Binary Tree**, also called a skewed tree, is a binary tree where each node has only one child, resembling a linked list. It can be skewed to the left (only left children) or right (only right children).

```jsx
       1
        \
         2
          \
           3
```
