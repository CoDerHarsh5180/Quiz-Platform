import { Structure } from "../models/structure.models.js";
import mongoose from "mongoose";

export async function getTestJson(testId) {
  const testPayload = await Structure.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(testId) } },

    // 1. Join Sections that belong to this Structure
    {
      $lookup: {
        from: "sections", 
        localField: "_id",
        foreignField: "testId",
        as: "sectionDoc"
      }
    },
    { $unwind: { path: "$sectionDoc", preserveNullAndEmptyArrays: true } },

    // 2. Join Questions that belong to each Section
    {
      $lookup: {
        from: "questions", 
        localField: "sectionDoc._id",
        foreignField: "section",
        as: "questionDoc"
      }
    },
    // Unwind questions so we can group them by their individual subjects
    { $unwind: { path: "$questionDoc", preserveNullAndEmptyArrays: true } },

    // 3. First Grouping: Group Questions by Structure + Subject + Section
    {
      $group: {
        _id: {
          structureId: "$_id",
          subject: "$questionDoc.subject", // Deriving subject from the question
          sectionId: "$sectionDoc._id"
        },
        // Preserve Structure details
        title: { $first: "$name" },
        subjectsArray: { $first: "$subjects" }, 
        durationHours: { $first: "$timeDuration" },
        totalMarks: { $first: "$totalMarks" },
        
        // Preserve Section details 
        sectionDetails: { $first: "$sectionDoc" },
        
        // Push the unwound questions into this specific Subject/Section block
        questions: { $push: "$questionDoc" }
      }
    },

    // 4. Second Grouping: Group Sections under their respective Subjects
    {
      $group: {
        _id: {
          structureId: "$_id.structureId",
          subject: "$_id.subject"
        },
        title: { $first: "$title" },
        subjectsArray: { $first: "$subjectsArray" },
        durationHours: { $first: "$durationHours" },
        totalMarks: { $first: "$totalMarks" },
        
        // Push the sections (merging the grouped questions back inside them)
        sections: {
          $push: {
            $mergeObjects: ["$sectionDetails", { questions: "$questions" }]
          }
        }
      }
    },

    // 5. Final Grouping: Roll all Subjects back into the single Structure
    {
      $group: {
        _id: "$_id.structureId",
        title: { $first: "$title" },
        subjectsArray: { $first: "$subjectsArray" }, 
        durationHours: { $first: "$durationHours" },
        totalMarks: { $first: "$totalMarks" },
        
        // Assemble the final Subjects array
        subjects: {
          $push: {
            subjectName: "$_id.subject",
            sections: "$sections"
          }
        }
      }
    }
  ]);

  // Return the first element since aggregation returns an array
  return testPayload[0] || null; 
}