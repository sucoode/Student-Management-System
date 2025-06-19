import mongoose from 'mongoose';

const cronConfigSchema=new mongoose.Schema({
    time:{type:String, default:'0 2 * *'},
});

export default mongoose.model('CronConfig', cronConfigSchema);