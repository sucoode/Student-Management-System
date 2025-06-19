import express from 'express';

import{
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    //syncCodeforcesData,
    getSubmissionsById,
    updateToggleReminder
} from '../controllers/studentControllers.js'


const router=express.Router();

router.get('/',getStudent);
router.get('/:id',getStudentById);
router.get('/:id/submissions',getSubmissionsById);
//router.post('/:id/sync-codeforces',syncCodeforcesData)
router.post('/',createStudent);
router.put('/:id',updateStudent);
router.delete('/:id',deleteStudent);
router.put('/:id/reminder',updateToggleReminder);
export default router;