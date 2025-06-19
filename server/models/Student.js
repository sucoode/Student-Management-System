import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  contestId: {
    type: Number,
    required: true
  },
  contestName: {
    type: String,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  oldRating: {
    type: Number,
    required: true
  },
  newRating: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  unsolvedProblems:{
    type:Number,
    required:true,
    default:-1
  }
});

const studentSchema=new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    codeforcesHandle:String,
    currentRating:Number,
    maxRating:Number,
    lastSyncedAt:Date,
    reminder: {
      enabled: { type: Boolean, default: true },         // admin can disable
      count: { type: Number, default: 0 },                // times email sent
      lastRemindedAt: { type: Date, default: null },      // for tracking
    },
    contests:[contestSchema]
});

export default mongoose.model('Student',studentSchema);