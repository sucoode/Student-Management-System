import cron from 'node-cron';
import Student from '../models/Student.js';
import { fetchRatingInfo,fetchContestsWithUnsolved,fetchSubmissions } from './codeforces.js';
import { sendReminderEmail } from './sendEmail.js';
let scheduledTask = null;
let currentCronExpression = '0 2 * * *'; // Default: 2 AM every day


export const startCronJob = (cronExpression = currentCronExpression) => {
  if (scheduledTask) scheduledTask.stop();

  scheduledTask = cron.schedule(cronExpression, async () => {
    console.log('⏰ Cron Job Running: Fetching CF Data...');
    const students = await Student.find();
    for (const student of students) {
      try {
        const {currentRating, maxRating} = await fetchRatingInfo(student.codeforcesHandle);
        const {contests}=await fetchContestsWithUnsolved(student.codeforcesHandle);
        student.contests = contests;
        student.currentRating = currentRating;
        student.maxRating = maxRating;
        student.lastSyncedAt = new Date();

        const {submissions}=await fetchSubmissions(student.codeforcesHandle);
        const recentSubs = submissions.filter(sub => new Date(sub.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      
      if (student.reminder.enabled && recentSubs.length === 0) {
        console.log(`${student.name} is Inactive`);
        await sendReminderEmail(student);
        student.reminder.count += 1;
        student.reminder.lastRemindedAt =new Date();
      }
      else{
        console.log(`${student.name} is Active`);
      }

        await student.save();
      } catch (err) {
        console.error(`Error syncing ${student.codeforcesHandle}:`, err.message);
      }
    }
  });

  scheduledTask.start();
  currentCronExpression = cronExpression;
};

export const updateCronJob = (newExpression) => {
  startCronJob(newExpression);
};

export const getCurrentCronExpression = () => currentCronExpression;
