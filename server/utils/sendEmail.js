import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


export const sendReminderEmail=async(student)=>{
    try{
        const transporter=nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
          }
        });

        const mailOptions={
            form:process.env.EMAIL_USER,
            to:student.email,
            subject:'Keep Practising on Codeforces!',
            text:`Hi ${student.name},\n\nIt looks like you haven’t submitted any problems on Codeforces in the past week. Get back on track and keep learning!\n\nGood luck!\n TLE Team `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Remainder email sent to ${student.email}`);
    }
    catch (err){
        console.log('Email error: ',err);
    }
};