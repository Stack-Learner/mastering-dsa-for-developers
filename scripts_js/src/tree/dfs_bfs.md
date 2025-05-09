### DFS vs BFS

Traversing a tree means visiting all its nodes in a systematic order to process or analyze the data they contain. Two fundamental approaches to tree traversal are Depth-First Search (DFS) and Breadth-First Search (BFS), which differ in how they explore the tree. For binary trees, DFS can be further categorized into Preorder, Inorder, and Postorder traversals, while BFS corresponds to Level-order traversal.

**Depth-First Search (DFS): Diving Deep**

**DFS** explores a tree by diving as deep as possible along each branch before backtracking. It follows a “go deep, then back up” strategy, making it ideal for tasks like pathfinding, cycle detection, or evaluating expressions in a tree.

**How DFS Works**

- Start at the root.
- Visit the current node, then recursively explore each child (or subtree) as far as possible before moving to the next child.
- Backtrack when you reach a leaf (a node with no children) and explore other branches.

**Example**

```jsx
       1
      / \
     2   3
    / \   \
   4   5   6
```

- **DFS Traversal**: Starting at the root (1), DFS might proceed as follows:
  - Visit 1, then go left to 2.
  - Visit 2, go left to 4.
  - Visit 4 (leaf), backtrack to 2.
  - Visit 2’s right child 5.
  - Visit 5 (leaf), backtrack to 2, then to 1.
  - Visit 1’s right child 3.
  - Visit 3, go right to 6.
  - Visit 6 (leaf), backtrack.
- **Order**: 1, 2, 4, 5, 3, 6 (this is a Preorder DFS, but DFS can vary depending on the child visit order).

**DFS is useful when you need to explore all paths to the leaves, such as in a maze solver or when evaluating an expression tree (e.g., in a compiler).**

DFS can be implemented as Preorder, Inorder, or Postorder traversals.

**Preorder Traversal (Root, Left, Right)**

Visit the root first, then recursively traverse the left subtree, followed by the right subtree. It’s useful for creating a copy of the tree or evaluating prefix expressions.

**Example** (same tree as above):

- Visit 1, then left to 2, then 2’s left to 4, backtrack, 2’s right to 5, backtrack, 1’s right to 3, then 3’s right to 6.
- **Order**: 1, 2, 4, 5, 3, 6.

**Inorder Traversal (Left, Root, Right)**

Traverse the left subtree, visit the root, then traverse the right subtree. In a binary search tree (BST), this yields nodes in sorted order.

**Example**:

- Start at 1, go left to 2, left to 4, visit 4, back to 2, visit 2, right to 5, visit 5, back to 1, visit 1, right to 3, visit 3, right to 6, visit 6.
- **Order**: 4, 2, 5, 1, 3, 6 (sorted order if the tree is a BST).

**Postorder Traversal (Left, Right, Root)**

Traverse the left subtree, then the right subtree, and finally visit the root. It’s useful for deleting a tree (delete children before the parent) or evaluating postfix expressions.

**Example**:

- Start at 1, go left to 2, left to 4, visit 4, right to 5, visit 5, visit 2, back to 1, right to 3, right to 6, visit 6, visit 3, finally visit 1.
- **Order**: 4, 5, 2, 6, 3, 1.

**Breadth-First Search (BFS): Exploring Level by Level**

BFS explores a tree level by level, visiting all nodes at the current depth before moving to the next depth. It uses a queue to keep track of nodes to visit, making it ideal for finding the shortest path or processing nodes in order of distance from the root.

**How BFS Works**

- Start at the root and add it to a queue.
- While the queue is not empty:
  - Dequeue a node, visit it, and enqueue all its children.
  - Repeat until the queue is empty.

**Example**

```jsx
       1
      / \
     2   3
    / \   \
   4   5   6
```

- **BFS Traversal**:
  - Start with 1 (queue: [1]).
  - Visit 1, enqueue 2 and 3 (queue: [2, 3]).
  - Visit 2, enqueue 4 and 5 (queue: [3, 4, 5]).
  - Visit 3, enqueue 6 (queue: [4, 5, 6]).
  - Visit 4 (queue: [5, 6]).
  - Visit 5 (queue: [6]).
  - Visit 6 (queue: []).
- **Order**: 1, 2, 3, 4, 5, 6.

**BFS is perfect for tasks like finding the shortest path between nodes (e.g., in social network analysis) or printing a tree level by level (e.g., in a file explorer).**
