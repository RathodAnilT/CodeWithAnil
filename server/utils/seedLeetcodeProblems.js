const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SDESheetProblem = require('../models/SDESheetProblem');

// Load environment variables
dotenv.config();

// LeetCode problems by category
const leetcodeProblems = {
  // Arrays category - 60 problems
  "Arrays": [
    { title: "Two Sum", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/two-sum/", category: "Arrays", section: "Arrays" },
    { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", category: "Arrays", section: "Arrays" },
    { title: "Contains Duplicate", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/contains-duplicate/", category: "Arrays", section: "Arrays" },
    { title: "Product of Array Except Self", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/product-of-array-except-self/", category: "Arrays", section: "Arrays" },
    { title: "Maximum Subarray", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/maximum-subarray/", category: "Arrays", section: "Arrays" },
    { title: "Maximum Product Subarray", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/maximum-product-subarray/", category: "Arrays", section: "Arrays" },
    { title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", category: "Arrays", section: "Arrays" },
    { title: "Search in Rotated Sorted Array", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/search-in-rotated-sorted-array/", category: "Arrays", section: "Arrays" },
    { title: "3Sum", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/3sum/", category: "Arrays", section: "Arrays" },
    { title: "Container With Most Water", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/container-with-most-water/", category: "Arrays", section: "Arrays" },
    { title: "Move Zeroes", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/move-zeroes/", category: "Arrays", section: "Arrays" },
    { title: "Rotate Array", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/rotate-array/", category: "Arrays", section: "Arrays" },
    { title: "Find the Duplicate Number", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/find-the-duplicate-number/", category: "Arrays", section: "Arrays" },
    { title: "Majority Element", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/majority-element/", category: "Arrays", section: "Arrays" },
    { title: "Single Number", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/single-number/", category: "Arrays", section: "Arrays" },
    { title: "Next Permutation", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/next-permutation/", category: "Arrays", section: "Arrays" },
    { title: "Combination Sum", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/combination-sum/", category: "Arrays", section: "Arrays" },
    { title: "Pascal's Triangle", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/pascals-triangle/", category: "Arrays", section: "Arrays" },
    { title: "Sort Colors", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/sort-colors/", category: "Arrays", section: "Arrays" },
    { title: "First Missing Positive", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/first-missing-positive/", category: "Arrays", section: "Arrays" },
    { title: "Largest Rectangle in Histogram", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/largest-rectangle-in-histogram/", category: "Arrays", section: "Arrays" },
    { title: "4Sum", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/4sum/", category: "Arrays", section: "Arrays" },
    { title: "Game of Life", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/game-of-life/", category: "Arrays", section: "Arrays" },
    { title: "Insert Delete GetRandom O(1)", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/insert-delete-getrandom-o1/", category: "Arrays", section: "Arrays" },
    { title: "Kth Largest Element in an Array", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/kth-largest-element-in-an-array/", category: "Arrays", section: "Arrays" },
    { title: "Find All Numbers Disappeared in an Array", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/", category: "Arrays", section: "Arrays" },
    { title: "Maximum Size Subarray Sum Equals k", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/", category: "Arrays", section: "Arrays" },
    { title: "Subarray Sum Equals K", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/subarray-sum-equals-k/", category: "Arrays", section: "Arrays" },
    { title: "Range Sum Query - Immutable", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/range-sum-query-immutable/", category: "Arrays", section: "Arrays" },
    { title: "Trapping Rain Water", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/trapping-rain-water/", category: "Arrays", section: "Arrays" },
    { title: "Merge Intervals", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/merge-intervals/", category: "Arrays", section: "Arrays" },
    { title: "Insert Interval", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/insert-interval/", category: "Arrays", section: "Arrays" },
    { title: "Non-overlapping Intervals", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/non-overlapping-intervals/", category: "Arrays", section: "Arrays" },
    { title: "Meeting Rooms II", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/meeting-rooms-ii/", category: "Arrays", section: "Arrays" },
    { title: "Rearrange Array Elements by Sign", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/rearrange-array-elements-by-sign/", category: "Arrays", section: "Arrays" },
    { title: "Plus One", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/plus-one/", category: "Arrays", section: "Arrays" },
    { title: "Missing Number", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/missing-number/", category: "Arrays", section: "Arrays" },
    { title: "Set Matrix Zeroes", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/set-matrix-zeroes/", category: "Arrays", section: "Arrays" },
    { title: "Spiral Matrix", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/spiral-matrix/", category: "Arrays", section: "Arrays" },
    { title: "Rotate Image", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/rotate-image/", category: "Arrays", section: "Arrays" },
    { title: "Count of Smaller Numbers After Self", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/", category: "Arrays", section: "Arrays" },
    { title: "Merge Sorted Array", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/merge-sorted-array/", category: "Arrays", section: "Arrays" },
    { title: "Max Value of Equation", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/max-value-of-equation/", category: "Arrays", section: "Arrays" },
    { title: "Maximum Gap", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/maximum-gap/", category: "Arrays", section: "Arrays" },
    { title: "Shuffle an Array", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/shuffle-an-array/", category: "Arrays", section: "Arrays" },
    { title: "Jump Game", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/jump-game/", category: "Arrays", section: "Arrays" },
    { title: "Jump Game II", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/jump-game-ii/", category: "Arrays", section: "Arrays" },
    { title: "H-Index", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/h-index/", category: "Arrays", section: "Arrays" },
    { title: "Median of Two Sorted Arrays", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/median-of-two-sorted-arrays/", category: "Arrays", section: "Arrays" },
    { title: "Sliding Window Maximum", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/sliding-window-maximum/", category: "Arrays", section: "Arrays" },
    { title: "Number of Islands", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/number-of-islands/", category: "Arrays", section: "Arrays" },
    { title: "Surrounded Regions", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/surrounded-regions/", category: "Arrays", section: "Arrays" },
    { title: "Pacific Atlantic Water Flow", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/pacific-atlantic-water-flow/", category: "Arrays", section: "Arrays" },
    { title: "Max Area of Island", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/max-area-of-island/", category: "Arrays", section: "Arrays" },
    { title: "Word Search", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/word-search/", category: "Arrays", section: "Arrays" },
    { title: "Game of Life", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/game-of-life/", category: "Arrays", section: "Arrays" },
    { title: "Sudoku Solver", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/sudoku-solver/", category: "Arrays", section: "Arrays" },
    { title: "Valid Sudoku", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/valid-sudoku/", category: "Arrays", section: "Arrays" },
    { title: "Product of Array Except Self", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/product-of-array-except-self/", category: "Arrays", section: "Arrays" },
  ],

  // Strings category - 60 problems
  "Strings": [
    { title: "Valid Anagram", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/valid-anagram/", category: "Strings", section: "Strings" },
    { title: "Valid Parentheses", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/valid-parentheses/", category: "Strings", section: "Strings" },
    { title: "Valid Palindrome", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/valid-palindrome/", category: "Strings", section: "Strings" },
    { title: "Longest Palindromic Substring", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/longest-palindromic-substring/", category: "Strings", section: "Strings" },
    { title: "Longest Repeating Character Replacement", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/longest-repeating-character-replacement/", category: "Strings", section: "Strings" },
    { title: "Find All Anagrams in a String", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/find-all-anagrams-in-a-string/", category: "Strings", section: "Strings" },
    { title: "Minimum Window Substring", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/minimum-window-substring/", category: "Strings", section: "Strings" },
    { title: "Group Anagrams", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/group-anagrams/", category: "Strings", section: "Strings" },
    { title: "Encode and Decode Strings", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/encode-and-decode-strings/", category: "Strings", section: "Strings" },
    { title: "Add Strings", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/add-strings/", category: "Strings", section: "Strings" },
    { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", category: "Strings", section: "Strings" },
    { title: "Palindromic Substrings", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/palindromic-substrings/", category: "Strings", section: "Strings" },
    { title: "String to Integer (atoi)", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/string-to-integer-atoi/", category: "Strings", section: "Strings" },
    { title: "Count and Say", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/count-and-say/", category: "Strings", section: "Strings" },
    { title: "Reverse String", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/reverse-string/", category: "Strings", section: "Strings" },
    { title: "Reverse Words in a String", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/reverse-words-in-a-string/", category: "Strings", section: "Strings" },
    { title: "ZigZag Conversion", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/zigzag-conversion/", category: "Strings", section: "Strings" },
    { title: "Integer to Roman", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/integer-to-roman/", category: "Strings", section: "Strings" },
    { title: "Roman to Integer", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/roman-to-integer/", category: "Strings", section: "Strings" },
    { title: "Implement strStr()", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/implement-strstr/", category: "Strings", section: "Strings" },
    { title: "Letter Combinations of a Phone Number", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", category: "Strings", section: "Strings" },
    { title: "Generate Parentheses", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/generate-parentheses/", category: "Strings", section: "Strings" },
    { title: "Longest Valid Parentheses", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/longest-valid-parentheses/", category: "Strings", section: "Strings" },
    { title: "Simplify Path", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/simplify-path/", category: "Strings", section: "Strings" },
    { title: "Text Justification", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/text-justification/", category: "Strings", section: "Strings" },
    { title: "Word Break", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/word-break/", category: "Strings", section: "Strings" },
    { title: "Word Break II", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/word-break-ii/", category: "Strings", section: "Strings" },
    { title: "Implement Trie (Prefix Tree)", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/implement-trie-prefix-tree/", category: "Strings", section: "Strings" },
    { title: "Longest Common Prefix", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/longest-common-prefix/", category: "Strings", section: "Strings" },
    { title: "Decode Ways", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/decode-ways/", category: "Strings", section: "Strings" },
    { title: "Regular Expression Matching", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/regular-expression-matching/", category: "Strings", section: "Strings" },
    { title: "Wildcard Matching", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/wildcard-matching/", category: "Strings", section: "Strings" },
    { title: "One Edit Distance", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/one-edit-distance/", category: "Strings", section: "Strings" },
    { title: "Distinct Subsequences", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/distinct-subsequences/", category: "Strings", section: "Strings" },
    { title: "Interleaving String", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/interleaving-string/", category: "Strings", section: "Strings" },
    { title: "Isomorphic Strings", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/isomorphic-strings/", category: "Strings", section: "Strings" },
    { title: "Word Pattern", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/word-pattern/", category: "Strings", section: "Strings" },
    { title: "Palindrome Pairs", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/palindrome-pairs/", category: "Strings", section: "Strings" },
    { title: "Shortest Palindrome", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/shortest-palindrome/", category: "Strings", section: "Strings" },
    { title: "Multiply Strings", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/multiply-strings/", category: "Strings", section: "Strings" },
    { title: "Basic Calculator", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/basic-calculator/", category: "Strings", section: "Strings" },
    { title: "Basic Calculator II", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/basic-calculator-ii/", category: "Strings", section: "Strings" },
    { title: "Basic Calculator III", difficulty: "Hard", leetCodeLink: "https://leetcode.com/problems/basic-calculator-iii/", category: "Strings", section: "Strings" },
    { title: "Rabin-Karp Algorithm", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/repeated-string-match/", category: "Strings", section: "Strings" },
    { title: "Repeated String Match", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/repeated-string-match/", category: "Strings", section: "Strings" },
    { title: "String Compression", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/string-compression/", category: "Strings", section: "Strings" },
    { title: "Reorganize String", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/reorganize-string/", category: "Strings", section: "Strings" },
    { title: "Longest Substring with At Most K Distinct Characters", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/", category: "Strings", section: "Strings" },
    { title: "Smallest Subsequence of Distinct Characters", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/", category: "Strings", section: "Strings" },
    { title: "Implement strStr()", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/implement-strstr/", category: "Strings", section: "Strings" },
    { title: "Longest Happy String", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/longest-happy-string/", category: "Strings", section: "Strings" },
    { title: "Minimum Remove to Make Valid Parentheses", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/", category: "Strings", section: "Strings" },
    { title: "Expressive Words", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/expressive-words/", category: "Strings", section: "Strings" },
    { title: "Backspace String Compare", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/backspace-string-compare/", category: "Strings", section: "Strings" },
    { title: "Compare Version Numbers", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/compare-version-numbers/", category: "Strings", section: "Strings" },
    { title: "Longest Word in Dictionary", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/longest-word-in-dictionary/", category: "Strings", section: "Strings" },
    { title: "Custom Sort String", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/custom-sort-string/", category: "Strings", section: "Strings" },
    { title: "Maximum Length of a Concatenated String with Unique Characters", difficulty: "Medium", leetCodeLink: "https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/", category: "Strings", section: "Strings" },
    { title: "Shortest Distance to a Character", difficulty: "Easy", leetCodeLink: "https://leetcode.com/problems/shortest-distance-to-a-character/", category: "Strings", section: "Strings" },
  ],
};

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codewithanil', {
      dbName: 'codewithanil'
    });
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

// Seed database with problems
async function seedDatabase() {
  try {
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      console.error('Failed to connect to database. Aborting seed operation.');
      process.exit(1);
    }

    // Clear existing problems in the categories
    const categories = Object.keys(leetcodeProblems);
    console.log(`Clearing existing problems for categories: ${categories.join(', ')}`);
    await SDESheetProblem.deleteMany({ category: { $in: categories } });

    // Add problems for each category
    let totalProblems = 0;
    let order = 1;

    for (const category of categories) {
      console.log(`Adding ${leetcodeProblems[category].length} problems for category: ${category}`);

      // Prepare problems with order
      const problemsWithOrder = leetcodeProblems[category].map((problem, index) => ({
        ...problem,
        order: order + index,
        sheet: 'leetcode'
      }));

      // Insert problems
      const result = await SDESheetProblem.insertMany(problemsWithOrder);
      
      totalProblems += result.length;
      order += problemsWithOrder.length;
      
      console.log(`✅ Added ${result.length} problems for ${category}`);
    }

    console.log(`\n🎉 Seed completed! Added a total of ${totalProblems} problems.`);
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Execute the seed function
seedDatabase(); 