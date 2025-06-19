import express from 'express';
import { updateCronJob, getCurrentCronExpression} from '../utils/cron.js'

const router = express.Router();

router.post('/update-cron', (req, res) => {
  const { frequency } = req.body;

  // Basic examples
  const cronMap = {
    'daily': '0 2 * * *',
    'hourly': '0 * * * *',
    'everyMinute': '* * * * *'
  };
    
  const expression = cronMap[frequency] || frequency;

  try {
    updateCronJob(expression);
    res.json({ message: 'Cron job updated successfully', frequency: expression });
  } catch (err) {
    res.status(500).json({ message: 'Cron update failed', error: err.message });
  }
});

router.get('/current-cron', (req, res) => {
  res.json({ expression: getCurrentCronExpression() });
});


export default router;
