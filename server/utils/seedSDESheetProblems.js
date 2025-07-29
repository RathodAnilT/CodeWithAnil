const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SDESheetProblem = require('../models/SDESheetProblem');
const additionalProblems = require('./additionalProblems');
const additionalProblems2 = require('./additionalProblems2');
const additionalProblems3 = require('./additionalProblems3');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'codewithanil'
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Initial SDE Sheet problems
const initialProblems = [
  // Additional Array Problems
  {
    title: "Group Anagrams",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/group-anagrams/",
    order: 8,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Top K Frequent Elements",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/top-k-frequent-elements/",
    order: 9,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Valid Sudoku",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/valid-sudoku/",
    order: 10,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Find All Numbers Disappeared in an Array",
    category: "Arrays",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
    order: 11,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "3Sum",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/3sum/",
    order: 12,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Subarray Sum Equals K",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/subarray-sum-equals-k/",
    order: 13,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Sort Colors",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/sort-colors/",
    order: 14,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Majority Element",
    category: "Arrays",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/majority-element/",
    order: 15,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Majority Element II",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/majority-element-ii/",
    order: 16,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Insert Delete GetRandom O(1)",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/insert-delete-getrandom-o1/",
    order: 17,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "First Missing Positive",
    category: "Arrays",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/first-missing-positive/",
    order: 18,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Next Permutation",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/next-permutation/",
    order: 19,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Merge Intervals",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/merge-intervals/",
    order: 20,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Non-overlapping Intervals",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/non-overlapping-intervals/",
    order: 21,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Insert Interval",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/insert-interval/",
    order: 22,
    sheet: "sde",
    section: "Arrays"
  },
  
  // Additional String Problems
  {
    title: "Group Anagrams",
    category: "Strings",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/group-anagrams/",
    order: 6,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "Longest Repeating Character Replacement",
    category: "Strings",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/longest-repeating-character-replacement/",
    order: 7,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "Minimum Window Substring",
    category: "Strings",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/minimum-window-substring/",
    order: 8,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "Valid Parentheses",
    category: "Strings",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/valid-parentheses/",
    order: 9,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "Palindromic Substrings",
    category: "Strings",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/palindromic-substrings/",
    order: 10,
    sheet: "sde",
    section: "Strings"
  },
  
  // Additional Linked List Problems
  {
    title: "Add Two Numbers",
    category: "Linked List",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/add-two-numbers/",
    order: 5,
    sheet: "sde",
    section: "Linked List"
  },
  {
    title: "Copy List with Random Pointer",
    category: "Linked List",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/copy-list-with-random-pointer/",
    order: 6,
    sheet: "sde",
    section: "Linked List"
  },
  {
    title: "LRU Cache", 
    category: "Linked List",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/lru-cache/",
    order: 7,
    sheet: "sde",
    section: "Linked List"
  },
  {
    title: "Reorder List",
    category: "Linked List",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/reorder-list/",
    order: 8,
    sheet: "sde",
    section: "Linked List"
  },
  {
    title: "Merge k Sorted Lists",
    category: "Linked List",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/merge-k-sorted-lists/",
    order: 9,
    sheet: "sde",
    section: "Linked List"
  },
  
  // Additional Stack & Queue Problems
  {
    title: "Daily Temperatures",
    category: "Stack & Queue",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/daily-temperatures/",
    order: 4,
    sheet: "sde",
    section: "Stack"
  },
  {
    title: "Car Fleet",
    category: "Stack & Queue",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/car-fleet/",
    order: 5,
    sheet: "sde",
    section: "Stack"
  },
  {
    title: "Largest Rectangle in Histogram",
    category: "Stack & Queue",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    order: 6,
    sheet: "sde",
    section: "Stack"
  },
  
  // Original Problems
  // Arrays
  {
    title: "Two Sum",
    category: "Arrays",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/two-sum/",
    order: 1,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Best Time to Buy and Sell Stock",
    category: "Arrays",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    order: 2,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Contains Duplicate",
    category: "Arrays",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/contains-duplicate/",
    order: 3,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Product of Array Except Self",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/product-of-array-except-self/",
    order: 4,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Maximum Subarray",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/maximum-subarray/",
    order: 5,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Merge Sorted Array",
    category: "Arrays",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/merge-sorted-array/",
    order: 6,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Move Zeroes",
    category: "Arrays",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/move-zeroes/",
    order: 7,
    sheet: "sde",
    section: "Arrays"
  },
  
  // Strings
  {
    title: "Valid Anagram",
    category: "Strings",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/valid-anagram/",
    order: 1,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "Valid Palindrome",
    category: "Strings",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/valid-palindrome/",
    order: 2,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "Longest Substring Without Repeating Characters",
    category: "Strings",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    order: 3,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "String to Integer (atoi)",
    category: "Strings",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/string-to-integer-atoi/",
    order: 4,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "Longest Palindromic Substring",
    category: "Strings",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/longest-palindromic-substring/",
    order: 5,
    sheet: "sde",
    section: "Strings"
  },
  
  // Linked List
  {
    title: "Reverse Linked List",
    category: "Linked List",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/reverse-linked-list/",
    order: 1,
    sheet: "sde",
    section: "Linked List"
  },
  {
    title: "Merge Two Sorted Lists",
    category: "Linked List",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/merge-two-sorted-lists/",
    order: 2,
    sheet: "sde",
    section: "Linked List"
  },
  {
    title: "Linked List Cycle",
    category: "Linked List",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/linked-list-cycle/",
    order: 3,
    sheet: "sde",
    section: "Linked List"
  },
  {
    title: "Remove Nth Node From End of List",
    category: "Linked List",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    order: 4,
    sheet: "sde",
    section: "Linked List"
  },
  
  // Stack & Queue
  {
    title: "Valid Parentheses",
    category: "Stack & Queue",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/valid-parentheses/",
    order: 1,
    sheet: "sde",
    section: "Stack"
  },
  {
    title: "Min Stack",
    category: "Stack & Queue",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/min-stack/",
    order: 2,
    sheet: "sde",
    section: "Stack"
  },
  {
    title: "Evaluate Reverse Polish Notation",
    category: "Stack & Queue",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    order: 3,
    sheet: "sde",
    section: "Stack"
  },
  
  // Queue (now part of Stack & Queue)
  {
    title: "Implement Queue using Stacks",
    category: "Stack & Queue",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/implement-queue-using-stacks/",
    order: 1,
    sheet: "sde",
    section: "Queue"
  },
  {
    title: "Design Circular Queue",
    category: "Stack & Queue",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/design-circular-queue/",
    order: 2,
    sheet: "sde",
    section: "Queue"
  },
  
  // Hashing
  {
    title: "Group Anagrams",
    category: "Hashing",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/group-anagrams/",
    order: 1,
    sheet: "sde",
    section: "Hashing"
  },
  {
    title: "LRU Cache",
    category: "Hashing",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/lru-cache/",
    order: 2,
    sheet: "sde",
    section: "Hashing"
  },
  
  // Recursion & Backtracking
  {
    title: "Combinations",
    category: "Recursion & Backtracking",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/combinations/",
    order: 1,
    sheet: "sde",
    section: "Recursion & Backtracking"
  },
  {
    title: "Subsets",
    category: "Recursion & Backtracking",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/subsets/",
    order: 2,
    sheet: "sde",
    section: "Recursion & Backtracking"
  },
  {
    title: "Letter Combinations of a Phone Number",
    category: "Recursion & Backtracking",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    order: 3,
    sheet: "sde",
    section: "Recursion & Backtracking"
  },
  
  // Binary Search
  {
    title: "Binary Search",
    category: "Binary Search",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/binary-search/",
    order: 1,
    sheet: "sde",
    section: "Searching"
  },
  {
    title: "Search in Rotated Sorted Array",
    category: "Binary Search",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    order: 2,
    sheet: "sde",
    section: "Searching"
  },
  
  // Changed from Sorting to Arrays for better categorization
  {
    title: "Sort an Array",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/sort-an-array/",
    order: 1,
    sheet: "sde",
    section: "Sorting"
  },
  {
    title: "Sort Colors",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/sort-colors/",
    order: 2,
    sheet: "sde",
    section: "Sorting"
  },
  
  // Binary Search continued
  {
    title: "Find First and Last Position of Element in Sorted Array",
    category: "Binary Search",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
    order: 1,
    sheet: "sde",
    section: "Binary Search"
  },
  {
    title: "Search a 2D Matrix",
    category: "Binary Search",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/search-a-2d-matrix/",
    order: 2,
    sheet: "sde",
    section: "Binary Search"
  },
  {
    title: "Find Peak Element",
    category: "Binary Search",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/find-peak-element/",
    order: 3,
    sheet: "sde",
    section: "Binary Search"
  },
  
  // Sliding Window
  {
    title: "Maximum Subarray",
    category: "Sliding Window",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/maximum-subarray/",
    order: 1,
    sheet: "sde",
    section: "Sliding Window"
  },
  {
    title: "Minimum Size Subarray Sum",
    category: "Sliding Window",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/minimum-size-subarray-sum/",
    order: 2,
    sheet: "sde",
    section: "Sliding Window"
  },
  {
    title: "Longest Substring Without Repeating Characters",
    category: "Sliding Window",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    order: 3,
    sheet: "sde",
    section: "Sliding Window"
  },
  
  // Two Pointers
  {
    title: "Two Sum II - Input Array Is Sorted",
    category: "Two Pointers",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    order: 1,
    sheet: "sde",
    section: "Two Pointers"
  },
  {
    title: "3Sum",
    category: "Two Pointers",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/3sum/",
    order: 2,
    sheet: "sde",
    section: "Two Pointers"
  },
  {
    title: "Container With Most Water",
    category: "Two Pointers",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/container-with-most-water/",
    order: 3,
    sheet: "sde",
    section: "Two Pointers"
  },
  
  // Bit Manipulation
  {
    title: "Single Number",
    category: "Bit Manipulation",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/single-number/",
    order: 1,
    sheet: "sde",
    section: "Bit Manipulation"
  },
  {
    title: "Counting Bits",
    category: "Bit Manipulation",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/counting-bits/",
    order: 2,
    sheet: "sde",
    section: "Bit Manipulation"
  },
  {
    title: "Reverse Bits",
    category: "Bit Manipulation",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/reverse-bits/",
    order: 3,
    sheet: "sde",
    section: "Bit Manipulation"
  },
  
  // Mathematics (mapped to Mathematics & Number Theory)
  {
    title: "Pow(x, n)",
    category: "Mathematics",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/powx-n/",
    order: 1,
    sheet: "sde",
    section: "Mathematics & Number Theory"
  },
  {
    title: "Factorial Trailing Zeroes",
    category: "Mathematics",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/factorial-trailing-zeroes/",
    order: 2,
    sheet: "sde",
    section: "Mathematics & Number Theory"
  },
  {
    title: "Excel Sheet Column Number",
    category: "Mathematics",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/excel-sheet-column-number/",
    order: 3,
    sheet: "sde",
    section: "Mathematics & Number Theory"
  },
  
  // Greedy Algorithms (mapped to Greedy)
  {
    title: "Jump Game",
    category: "Greedy",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/jump-game/",
    order: 1,
    sheet: "sde",
    section: "Greedy Algorithms"
  },
  {
    title: "Gas Station",
    category: "Greedy",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/gas-station/",
    order: 2,
    sheet: "sde",
    section: "Greedy Algorithms"
  },
  {
    title: "Partition Labels",
    category: "Greedy",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/partition-labels/",
    order: 3,
    sheet: "sde",
    section: "Greedy Algorithms"
  },
  
  // Dynamic Programming (DP)
  {
    title: "Climbing Stairs",
    category: "Dynamic Programming",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/climbing-stairs/",
    order: 1,
    sheet: "sde",
    section: "Dynamic Programming (DP)"
  },
  {
    title: "House Robber",
    category: "Dynamic Programming",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/house-robber/",
    order: 2,
    sheet: "sde",
    section: "Dynamic Programming (DP)"
  },
  {
    title: "Coin Change",
    category: "Dynamic Programming",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/coin-change/",
    order: 3,
    sheet: "sde",
    section: "Dynamic Programming (DP)"
  },
  {
    title: "Longest Increasing Subsequence",
    category: "Dynamic Programming",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/longest-increasing-subsequence/",
    order: 4,
    sheet: "sde",
    section: "Dynamic Programming (DP)"
  },
  
  // Graphs
  {
    title: "Number of Islands",
    category: "Graphs",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/number-of-islands/",
    order: 1,
    sheet: "sde",
    section: "Graphs"
  },
  {
    title: "Clone Graph",
    category: "Graphs",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/clone-graph/",
    order: 2,
    sheet: "sde",
    section: "Graphs"
  },
  {
    title: "Course Schedule",
    category: "Graphs",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/course-schedule/",
    order: 3,
    sheet: "sde",
    section: "Graphs"
  },
  {
    title: "Pacific Atlantic Water Flow",
    category: "Graphs",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    order: 4,
    sheet: "sde",
    section: "Graphs"
  },
  
  // Trees
  {
    title: "Maximum Depth of Binary Tree",
    category: "Trees",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    order: 1,
    sheet: "sde",
    section: "Trees"
  },
  {
    title: "Same Tree",
    category: "Trees",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/same-tree/",
    order: 2,
    sheet: "sde",
    section: "Trees"
  },
  {
    title: "Invert Binary Tree",
    category: "Trees",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/invert-binary-tree/",
    order: 3,
    sheet: "sde",
    section: "Trees"
  },
  {
    title: "Binary Tree Level Order Traversal",
    category: "Trees",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    order: 4,
    sheet: "sde",
    section: "Trees"
  },
  {
    title: "Validate Binary Search Tree",
    category: "Trees",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/validate-binary-search-tree/",
    order: 5,
    sheet: "sde",
    section: "Trees"
  },
  
  // Tries
  {
    title: "Implement Trie (Prefix Tree)",
    category: "Trie",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    order: 1,
    sheet: "sde",
    section: "Tries"
  },
  {
    title: "Word Search II",
    category: "Trie",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/word-search-ii/",
    order: 2,
    sheet: "sde",
    section: "Tries"
  },
  
  // Heaps / Priority Queue
  {
    title: "Kth Largest Element in an Array",
    category: "Heaps",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    order: 1,
    sheet: "sde",
    section: "Heaps / Priority Queue"
  },
  {
    title: "Top K Frequent Elements",
    category: "Heaps",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/top-k-frequent-elements/",
    order: 2,
    sheet: "sde",
    section: "Heaps / Priority Queue"
  },
  {
    title: "Find Median from Data Stream",
    category: "Heaps",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/find-median-from-data-stream/",
    order: 3,
    sheet: "sde",
    section: "Heaps / Priority Queue"
  },
  
  // Disjoint Set Union (Union-Find) - Map to Graphs
  {
    title: "Number of Provinces",
    category: "Graphs",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/number-of-provinces/",
    order: 1,
    sheet: "sde",
    section: "Disjoint Set Union (Union-Find)"
  },
  {
    title: "Redundant Connection",
    category: "Graphs",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/redundant-connection/",
    order: 2,
    sheet: "sde",
    section: "Disjoint Set Union (Union-Find)"
  },
  
  // Topological Sort - Map to Graphs
  {
    title: "Course Schedule II",
    category: "Graphs",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/course-schedule-ii/",
    order: 1,
    sheet: "sde",
    section: "Topological Sort"
  },
  {
    title: "Alien Dictionary",
    category: "Graphs",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/alien-dictionary/",
    order: 2,
    sheet: "sde",
    section: "Topological Sort"
  },
  
  // Segment Tree / Fenwick Tree - Map to Trees
  {
    title: "Range Sum Query - Mutable",
    category: "Trees",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/range-sum-query-mutable/",
    order: 1,
    sheet: "sde",
    section: "Segment Tree / Fenwick Tree"
  },
  {
    title: "Count of Smaller Numbers After Self",
    category: "Trees",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
    order: 2,
    sheet: "sde",
    section: "Segment Tree / Fenwick Tree"
  },
  
  // Monotonic Stack / Queue - Map to Stack & Queue
  {
    title: "Next Greater Element I",
    category: "Stack & Queue",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/next-greater-element-i/",
    order: 1,
    sheet: "sde",
    section: "Monotonic Stack / Queue"
  },
  {
    title: "Daily Temperatures",
    category: "Stack & Queue",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/daily-temperatures/",
    order: 2,
    sheet: "sde",
    section: "Monotonic Stack / Queue"
  },
  {
    title: "Largest Rectangle in Histogram",
    category: "Stack & Queue",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    order: 3,
    sheet: "sde",
    section: "Monotonic Stack / Queue"
  },
  
  // Matrix Problems - Map to Arrays
  {
    title: "Rotate Image",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/rotate-image/",
    order: 1,
    sheet: "sde",
    section: "Matrix Problems"
  },
  {
    title: "Spiral Matrix",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/spiral-matrix/",
    order: 2,
    sheet: "sde",
    section: "Matrix Problems"
  },
  {
    title: "Set Matrix Zeroes",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/set-matrix-zeroes/",
    order: 3,
    sheet: "sde",
    section: "Matrix Problems"
  },
  
  // Game Theory - Map to Dynamic Programming
  {
    title: "Nim Game",
    category: "Dynamic Programming",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/nim-game/",
    order: 1,
    sheet: "sde",
    section: "Game Theory"
  },
  {
    title: "Stone Game",
    category: "Dynamic Programming",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/stone-game/",
    order: 2,
    sheet: "sde",
    section: "Game Theory"
  },
  
  // Geometry - Map to Mathematics
  {
    title: "Max Points on a Line",
    category: "Mathematics",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/max-points-on-a-line/",
    order: 1,
    sheet: "sde",
    section: "Geometry"
  },
  {
    title: "Valid Square",
    category: "Mathematics",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/valid-square/",
    order: 2,
    sheet: "sde",
    section: "Geometry"
  },
  
  // Advanced Data Structures - Map to Hashing or other categories
  {
    title: "LFU Cache",
    category: "Hashing",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/lfu-cache/",
    order: 1,
    sheet: "sde",
    section: "Advanced Data Structures"
  },
  {
    title: "Design HashMap",
    category: "Hashing",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/design-hashmap/",
    order: 2,
    sheet: "sde",
    section: "Advanced Data Structures"
  },

  // Arrays - Additional problems to have a more comprehensive list
  {
    title: "Group Anagrams",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/group-anagrams/",
    order: 8,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Top K Frequent Elements",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/top-k-frequent-elements/",
    order: 9,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Valid Sudoku",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/valid-sudoku/",
    order: 10,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Find All Numbers Disappeared in an Array",
    category: "Arrays",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
    order: 11,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "3Sum",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/3sum/",
    order: 12,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Subarray Sum Equals K",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/subarray-sum-equals-k/",
    order: 13,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Sort Colors",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/sort-colors/",
    order: 14,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Majority Element",
    category: "Arrays",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/majority-element/",
    order: 15,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Majority Element II",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/majority-element-ii/",
    order: 16,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Insert Delete GetRandom O(1)",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/insert-delete-getrandom-o1/",
    order: 17,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "First Missing Positive",
    category: "Arrays",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/first-missing-positive/",
    order: 18,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Next Permutation",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/next-permutation/",
    order: 19,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Find First and Last Position of Element in Sorted Array",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
    order: 20,
    sheet: "sde",
    section: "Arrays"
  },
  {
    title: "Jump Game",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/jump-game/",
    order: 21,
    sheet: "sde", 
    section: "Arrays"
  },
  {
    title: "Merge Intervals",
    category: "Arrays",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/merge-intervals/",
    order: 22,
    sheet: "sde",
    section: "Arrays"
  },
  
  // Strings - Additional problems
  {
    title: "Group Anagrams",
    category: "Strings",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/group-anagrams/",
    order: 6,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "Longest Repeating Character Replacement",
    category: "Strings",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/longest-repeating-character-replacement/",
    order: 7,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "Minimum Window Substring",
    category: "Strings",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/minimum-window-substring/",
    order: 8,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "Valid Parentheses",
    category: "Strings",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/valid-parentheses/",
    order: 9,
    sheet: "sde",
    section: "Strings"
  },
  {
    title: "Palindromic Substrings",
    category: "Strings", 
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/palindromic-substrings/",
    order: 10,
    sheet: "sde",
    section: "Strings"
  },
  
  // Linked List - Additional problems
  {
    title: "Add Two Numbers",
    category: "Linked List",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/add-two-numbers/",
    order: 5,
    sheet: "sde",
    section: "Linked List"
  },
  {
    title: "Copy List with Random Pointer",
    category: "Linked List",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/copy-list-with-random-pointer/",
    order: 6,
    sheet: "sde",
    section: "Linked List"
  },
  {
    title: "LRU Cache",
    category: "Linked List",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/lru-cache/",
    order: 7,
    sheet: "sde",
    section: "Linked List"
  },
  {
    title: "Reorder List",
    category: "Linked List",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/reorder-list/",
    order: 8,
    sheet: "sde",
    section: "Linked List"
  },
  {
    title: "Merge k Sorted Lists",
    category: "Linked List",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/merge-k-sorted-lists/",
    order: 9,
    sheet: "sde",
    section: "Linked List"
  },

  // Additional Binary Search problems
  {
    title: "Koko Eating Bananas",
    category: "Binary Search",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/koko-eating-bananas/",
    order: 3,
    sheet: "sde",
    section: "Binary Search"
  },
  {
    title: "Time Based Key-Value Store",
    category: "Binary Search",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/time-based-key-value-store/",
    order: 4,
    sheet: "sde",
    section: "Binary Search"
  },
  {
    title: "Median of Two Sorted Arrays",
    category: "Binary Search",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    order: 5,
    sheet: "sde",
    section: "Binary Search"
  },

  // Additional Stack & Queue problems
  {
    title: "Daily Temperatures",
    category: "Stack & Queue",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/daily-temperatures/",
    order: 4,
    sheet: "sde",
    section: "Stack"
  },
  {
    title: "Car Fleet",
    category: "Stack & Queue",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/car-fleet/",
    order: 5,
    sheet: "sde",
    section: "Stack"
  },
  {
    title: "Largest Rectangle in Histogram",
    category: "Stack & Queue",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    order: 6,
    sheet: "sde",
    section: "Stack"
  },

  // Additional Trees problems
  {
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    category: "Trees",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    order: 6,
    sheet: "sde",
    section: "Trees"
  },
  {
    title: "Kth Smallest Element in a BST",
    category: "Trees",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    order: 7,
    sheet: "sde",
    section: "Trees"
  },
  {
    title: "Binary Tree Maximum Path Sum",
    category: "Trees",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    order: 8,
    sheet: "sde",
    section: "Trees"
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    category: "Trees",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    order: 9,
    sheet: "sde",
    section: "Trees"
  },

  // Additional Heaps problems
  {
    title: "Last Stone Weight",
    category: "Heaps",
    difficulty: "Easy",
    leetCodeLink: "https://leetcode.com/problems/last-stone-weight/",
    order: 4,
    sheet: "sde",
    section: "Heaps / Priority Queue"
  },
  {
    title: "K Closest Points to Origin",
    category: "Heaps",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/k-closest-points-to-origin/",
    order: 5,
    sheet: "sde",
    section: "Heaps / Priority Queue"
  },

  // Additional Graphs problems
  {
    title: "Word Ladder",
    category: "Graphs",
    difficulty: "Hard",
    leetCodeLink: "https://leetcode.com/problems/word-ladder/",
    order: 5,
    sheet: "sde",
    section: "Graphs"
  },
  {
    title: "Network Delay Time",
    category: "Graphs",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/network-delay-time/",
    order: 6,
    sheet: "sde",
    section: "Graphs"
  },
  {
    title: "Cheapest Flights Within K Stops",
    category: "Graphs",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    order: 7,
    sheet: "sde",
    section: "Graphs"
  },

  // Additional Dynamic Programming problems
  {
    title: "Word Break",
    category: "Dynamic Programming",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/word-break/",
    order: 5,
    sheet: "sde",
    section: "Dynamic Programming (DP)"
  },
  {
    title: "Unique Paths",
    category: "Dynamic Programming",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/unique-paths/",
    order: 6,
    sheet: "sde",
    section: "Dynamic Programming (DP)"
  },
  {
    title: "Decode Ways",
    category: "Dynamic Programming",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/decode-ways/",
    order: 7,
    sheet: "sde",
    section: "Dynamic Programming (DP)"
  },
  {
    title: "Target Sum",
    category: "Dynamic Programming",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/target-sum/",
    order: 8,
    sheet: "sde",
    section: "Dynamic Programming (DP)"
  },
  {
    title: "Palindrome Partitioning",
    category: "Dynamic Programming",
    difficulty: "Medium",
    leetCodeLink: "https://leetcode.com/problems/palindrome-partitioning/",
    order: 9,
    sheet: "sde",
    section: "Dynamic Programming (DP)"
  },
];

// Combine all problems
const sdeSheetProblems = [...initialProblems, ...additionalProblems, ...additionalProblems2, ...additionalProblems3];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing problems
    await SDESheetProblem.deleteMany({ sheet: 'sde' });
    console.log('Cleared existing SDE Sheet problems');
    
    // Insert new problems
    await SDESheetProblem.insertMany(sdeSheetProblems);
    console.log(`Successfully seeded ${sdeSheetProblems.length} SDE Sheet problems`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase(); 