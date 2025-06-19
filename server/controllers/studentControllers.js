import Student from '../models/Student.js';
import { fetchContestsWithUnsolved, fetchRatingInfo } from '../utils/codeforces.js';
import { fetchSubmissions } from '../utils/codeforces.js';
export const getStudent=async (req,res)=>{
    //console.log("Student Got called")
    const students=await Student.find();
    res.status(200).json(students);
};

export const updateToggleReminder=async(req,res)=>{
    const {id}=req.params;
    const {enabled}=req.body;
    try{
        const student =await Student.findById(id);
        if(!student){
            return res.status(404).json({ message: 'Student not found' });
        }

        student.reminder={
            ...student.reminder,
            enabled:enabled,
        };
        await student.save();
        res.status(200).json({reminder:student.reminder});
    }
    catch(err){
        console.error('Error updating reminder:',err.message);
    }
}

export const getStudentById=async(req,res)=>{
    const {id}=req.params;
    const student=await Student.findById(id);
    
    if(!student){
        return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
}
export const getSubmissionsById = async (req, res) => {
  console.log("📥 Submissions fetch requested for student ID:", req.params.id);

  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const { submissions } = await fetchSubmissions(student.codeforcesHandle);
    res.status(200).json(submissions);

  } catch (err) {
    console.error('❌ Error in getSubmissionsById:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createStudent= async (req,res)=>{
      try {
    const { name, email, phone, codeforcesHandle } = req.body;
    console.log("Entered");
    const { currentRating, maxRating } = await fetchRatingInfo(codeforcesHandle);
    console.log("Fetched Request:1");
    const contests=await fetchContestsWithUnsolved(codeforcesHandle);
    console.log("Fetched Request:2");
    console.log(contests);
    console.log(codeforcesHandle);
    const newStudent = new Student({
      name,
      email,
      phone,
      codeforcesHandle,
      currentRating,
      maxRating,
      contests,
      lastSyncedAt: new Date()
    });
    await newStudent.save();
    res.status(200).json(newStudent);
  } catch (err) {
    console.error('Failed to create student:', err.message);
    res.status(500).json({ message: 'Failed to create student' });
  }
}

export const updateStudent =async(req,res)=>{
    const {id}=req.params;
    const oldStudent=await Student.findById(id);
    const updated= await Student.findByIdAndUpdate(id,req.body,{new:true});

    if(oldStudent.codeforcesHandle!==req.body.codeforcesHandle){
        try{
            const {currentRating, maxRating} = await fetchRatingInfo(req.body.codeforcesHandle);
            const contests=await fetchContestsWithUnsolved(req.body.codeforcesHandle);
            console.log(`Contest's data: ${contests}`);
            updated.contests = contests;
            updated.currentRating = currentRating;
            updated.maxRating = maxRating;
            updated.lastSyncedAt = new Date();
            await updated.save();
        }
        catch(err){
            console.error('CF Sync failed after handle change', err.message);
        }
    }

    res.status(200).json(updated);
}

export const deleteStudent=async(req,res)=>{
    const {id}=req.params;
    await Student.findByIdAndDelete(id);
    res.status(200).json({message:'Deleted succesfully'});
};

// export const syncCodeforcesData=async(req,res)=>{
//     const {id}=req.params;
//     try{
//         const student=await Student.findById(id);
//         if(!student) return res.status(404).json({ message: 'Student not found' });
//         const {contests,currentRating,maxRating}=await fetchCFContests(student.codeforcesHandle);
//         student.contests=contests;
//         student.currentRating=currentRating;
//         student.maxRating=maxRating;
//         student.lastSyncedAt= new Date();
//         await student.save();
//         res.json({message:'Codeforces data synced succesfully',contests});
//     }
//     catch(err){
//         console.error(err);
//         res.status(500).json({ message: 'Sync failed' });
//     }
// }

