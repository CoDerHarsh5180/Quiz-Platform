import mongoose from 'mongoose';

const { Schema } = mongoose;

const answerSchema = new Schema({
  questionId:  { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  sectionId:   { type: Schema.Types.ObjectId, ref: 'Section',  required: true },
  selected:    [String],            // option ids (supports multi-correct)
  numeric:     Number,              // for numerical-type questions
  ansText:     String,              // for text-type questions
  markedForReview: { type: Boolean, default: false },
  visited:     { type: Boolean, default: false },

  // filled at submit time (snapshot, so later teacher edits don't change results)
  result:      { type: String, enum: ['correct', 'wrong', 'skipped'] },

  correctAnswer: Schema.Types.Mixed,
  topic: String, difficulty: String,
}, { _id: false });

const testAttemptSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  testId:    { type: Schema.Types.ObjectId, ref: 'TestStructure', required: true },
  testVersion: Number,
  attemptNo: { type: Number, default: 1 },

  status: { type: String, enum: ['in_progress', 'submitted'], default: 'in_progress' },
  startedAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },     // server-computed
  submittedAt: Date,
  timeTakenSec: Number,

  answers: [answerSchema],

  // ---- result + analysis (filled on submit) ----
  score: Number, maxScore: Number,
  correctCount: Number, wrongCount: Number, skippedCount: Number,
  accuracy: Number,
}, { timestamps: true });

// one student's history, newest first
testAttemptSchema.index({ studentId: 1, createdAt: -1 });

// no duplicate attempt numbers
testAttemptSchema.index({ studentId: 1, testId: 1, attemptNo: 1 }, { unique: true });

// only ONE in-progress attempt per student per test
testAttemptSchema.index({ studentId: 1, testId: 1 },
  { unique: true, partialFilterExpression: { status: 'in_progress' } });

  
// leaderboard
testAttemptSchema.index({ testId: 1, status: 1, score: -1, timeTakenSec: 1 });

export const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);