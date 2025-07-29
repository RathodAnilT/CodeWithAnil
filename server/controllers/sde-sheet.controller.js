const SDESheetProblem = require('../models/SDESheetProblem');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all SDE Sheet problems
// @route   GET /api/sde-sheet/problems
// @access  Public
exports.getSDESheetProblems = async (req, res, next) => {
  try {
    console.log('🔍 Received request for SDE Sheet problems:', req.query);
    
    // Build query - always fetch all SDE sheet problems
    const query = { sheet: 'sde' };
    
    console.log('📋 Executing query:', query);
    
    // Find all problems matching the query with no limit
    const problems = await SDESheetProblem.find(query).lean();
    
    console.log(`✅ Found ${problems.length} problems from database`);
    
    // Log first few problems for debugging
    if (problems.length > 0) {
      console.log('📝 Sample problem:', problems[0]);
    }

    // Return flat array of problems with required fields
    const formattedProblems = problems.map(problem => ({
      _id: problem._id,
      title: problem.title || 'Untitled Problem',
      category: problem.category || 'Uncategorized',
      difficulty: problem.difficulty || 'Medium',
      leetCodeLink: problem.leetCodeLink || '',
      section: problem.section || problem.category || 'Uncategorized',
      status: 'unsolved',
      bookmarked: false,
      order: problem.order || 0
    }));

    console.log('✅ Total formatted problems:', formattedProblems.length);
    console.log('✅ Sections represented:', [...new Set(formattedProblems.map(p => p.section))]);
    
    // Return flat array of problems
    return res.status(200).json(formattedProblems);
  } catch (err) {
    console.error('❌ Error in getSDESheetProblems:', err);
    next(err);
  }
};

// @desc    Get user's SDE Sheet progress
// @route   GET /api/sde-sheet/progress
// @access  Private
exports.getUserProgress = async (req, res, next) => {
  try {
    const { sheet = 'sde' } = req.query;
    
    // Get user with populated sheet progress
    const user = await User.findById(req.user.id).populate({
      path: 'sheetProgress.problemId',
      match: { sheet },
      select: 'title difficulty category order section leetCodeLink gfgLink'
    });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Filter out null problemId values (happens when the sheet doesn't match)
    const progress = user.sheetProgress.filter(p => p.problemId);

    // Get all problems for the sheet
    const allProblems = await SDESheetProblem.find({ sheet }).sort({ section: 1, order: 1 });

    // Calculate statistics
    const totalProblems = allProblems.length;
    const solvedProblems = progress.filter(p => p.status === 'solved').length;
    const inProgressProblems = progress.filter(p => p.status === 'in_progress').length;
    
    // Group problems by section with progress
    const sections = {};
    allProblems.forEach(problem => {
      if (!sections[problem.section]) {
        sections[problem.section] = {
          name: problem.section,
          problems: [],
          total: 0,
          solved: 0
        };
      }
      
      // Find user progress for this problem
      const userProgress = progress.find(
        p => p.problemId && p.problemId._id.toString() === problem._id.toString()
      );
      
      const problemWithProgress = {
        ...problem.toObject(),
        status: userProgress ? userProgress.status : 'unsolved',
        isBookmarked: userProgress ? userProgress.isBookmarked : false,
        notes: userProgress ? userProgress.notes : '',
        lastAttempted: userProgress ? userProgress.lastAttempted : null,
        solvedAt: userProgress ? userProgress.solvedAt : null
      };
      
      sections[problem.section].problems.push(problemWithProgress);
      sections[problem.section].total++;
      
      if (userProgress && userProgress.status === 'solved') {
        sections[problem.section].solved++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          total: totalProblems,
          solved: solvedProblems,
          inProgress: inProgressProblems,
          completion: totalProblems ? Math.round((solvedProblems / totalProblems) * 100) : 0
        },
        sections,
        progress
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user's progress on a problem
// @route   PUT /api/sde-sheet/:problemId/progress
// @access  Private
exports.updateProblemProgress = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { status, isBookmarked, notes } = req.body;
    
    // Check if problem exists
    const problem = await SDESheetProblem.findById(problemId);
    
    if (!problem) {
      return next(new ErrorResponse(`Problem not found with id of ${problemId}`, 404));
    }
    
    // Find the user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Find the progress record in the user's progress array
    const progressIndex = user.sheetProgress.findIndex(
      p => p.problemId && p.problemId.toString() === problemId
    );
    
    const now = new Date();
    
    if (progressIndex !== -1) {
      // Update existing progress
      if (status) {
        user.sheetProgress[progressIndex].status = status;
        user.sheetProgress[progressIndex].lastAttempted = now;
        
        // If marked as solved, update solvedAt
        if (status === 'solved' && !user.sheetProgress[progressIndex].solvedAt) {
          user.sheetProgress[progressIndex].solvedAt = now;
          
          // Update activity calendar for solve
          const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
          const currentCount = user.activity.get(today) || 0;
          user.activity.set(today, currentCount + 1);
        }
      }
      
      if (isBookmarked !== undefined) {
        user.sheetProgress[progressIndex].isBookmarked = isBookmarked;
      }
      
      if (notes !== undefined) {
        user.sheetProgress[progressIndex].notes = notes;
      }
    } else {
      // Create new progress record
      const newProgress = {
        problemId,
        lastAttempted: now
      };
      
      if (status) {
        newProgress.status = status;
        
        // If marked as solved, update solvedAt
        if (status === 'solved') {
          newProgress.solvedAt = now;
          
          // Update activity calendar for solve
          const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
          const currentCount = user.activity.get(today) || 0;
          user.activity.set(today, currentCount + 1);
        }
      }
      
      if (isBookmarked !== undefined) {
        newProgress.isBookmarked = isBookmarked;
      }
      
      if (notes !== undefined) {
        newProgress.notes = notes;
      }
      
      user.sheetProgress.push(newProgress);
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        problem,
        progress: user.sheetProgress.find(p => p.problemId.toString() === problemId)
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user's progress on a problem
// @route   DELETE /api/sde-sheet/:problemId/progress
// @access  Private
exports.deleteProblemProgress = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    
    // Check if problem exists
    const problem = await SDESheetProblem.findById(problemId);
    
    if (!problem) {
      return next(new ErrorResponse(`Problem not found with id of ${problemId}`, 404));
    }
    
    // Find the user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Find the progress record in the user's progress array
    const progressIndex = user.sheetProgress.findIndex(
      p => p.problemId && p.problemId.toString() === problemId
    );
    
    if (progressIndex !== -1) {
      // Remove the progress entry
      user.sheetProgress.splice(progressIndex, 1);
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookmarked problems
// @route   GET /api/sde-sheet/bookmarks
// @access  Private
exports.getBookmarkedProblems = async (req, res, next) => {
  try {
    const { sheet = 'sde' } = req.query;
    
    // Get user with populated sheet progress
    const user = await User.findById(req.user.id).populate({
      path: 'sheetProgress.problemId',
      match: { sheet },
      select: 'title difficulty category order section leetCodeLink gfgLink'
    });
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Filter bookmarked problems
    const bookmarkedProblems = user.sheetProgress
      .filter(p => p.isBookmarked && p.problemId)
      .map(p => ({
        ...p.problemId.toObject(),
        status: p.status,
        isBookmarked: p.isBookmarked,
        notes: p.notes,
        lastAttempted: p.lastAttempted,
        solvedAt: p.solvedAt
      }));
    
    res.status(200).json({
      success: true,
      count: bookmarkedProblems.length,
      data: bookmarkedProblems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new SDE Sheet problem (admin only)
// @route   POST /api/sde-sheet
// @access  Private (Admin)
exports.createSDESheetProblem = async (req, res, next) => {
  try {
    const problem = await SDESheetProblem.create(req.body);
    
    res.status(201).json({
      success: true,
      data: problem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update an SDE Sheet problem (admin only)
// @route   PUT /api/sde-sheet/:id
// @access  Private (Admin)
exports.updateSDESheetProblem = async (req, res, next) => {
  try {
    const problem = await SDESheetProblem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!problem) {
      return next(new ErrorResponse(`Problem not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user's bookmark status on a problem
// @route   PUT /api/sde-sheet/progress/:problemId/bookmark
// @access  Private
exports.updateBookmark = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    
    // Check if problem exists
    const problem = await SDESheetProblem.findById(problemId);
    
    if (!problem) {
      return next(new ErrorResponse(`Problem not found with id of ${problemId}`, 404));
    }
    
    // Find the user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Find the progress record in the user's progress array
    const progressIndex = user.sheetProgress.findIndex(
      p => p.problemId && p.problemId.toString() === problemId
    );
    
    const now = new Date();
    
    if (progressIndex !== -1) {
      // Toggle bookmark status
      user.sheetProgress[progressIndex].isBookmarked = !user.sheetProgress[progressIndex].isBookmarked;
      user.sheetProgress[progressIndex].lastAttempted = now;
    } else {
      // Create new progress record with bookmark
      user.sheetProgress.push({
        problemId,
        status: 'unsolved',
        isBookmarked: true,
        lastAttempted: now
      });
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        problem,
        progress: user.sheetProgress.find(p => p.problemId.toString() === problemId)
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user's notes on a problem
// @route   PUT /api/sde-sheet/progress/:problemId/note
// @access  Private
exports.updateNote = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { note } = req.body;
    
    // Check if problem exists
    const problem = await SDESheetProblem.findById(problemId);
    
    if (!problem) {
      return next(new ErrorResponse(`Problem not found with id of ${problemId}`, 404));
    }
    
    // Find the user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Find the progress record in the user's progress array
    const progressIndex = user.sheetProgress.findIndex(
      p => p.problemId && p.problemId.toString() === problemId
    );
    
    const now = new Date();
    
    if (progressIndex !== -1) {
      // Update notes
      user.sheetProgress[progressIndex].notes = note;
      user.sheetProgress[progressIndex].lastAttempted = now;
    } else {
      // Create new progress record with notes
      user.sheetProgress.push({
        problemId,
        status: 'unsolved',
        notes: note,
        lastAttempted: now
      });
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        problem,
        progress: user.sheetProgress.find(p => p.problemId.toString() === problemId)
      }
    });
  } catch (err) {
    next(err);
  }
}; 