
A MERN stack project to track and visualize Codeforces performance of students.


### 1. Student Table View
- Add/edit/delete students
- View current & max Codeforces rating
- Export all students to CSV
- View individual student profiles
- Shows last updated sync time

### 2. Student Profile
- Contest History: filters (30/90/365 days), rating graph, rank, rating change, unsolved problems
- Problem Solving Stats: filters (7/30/90 days), bar chart, heatmap, average stats

### 3. Codeforces Sync
- Daily cron job fetches latest data (default: 2 AM)
- UI to change cron frequency and time
- Re-fetches on CF handle update

### 4. Inactivity Detection
- Detects students inactive for 7+ days
- Sends reminder email (mock/demo)
- Tracks count of reminders sent
- Option to disable reminders per student

---

## ⚙️ Tech Stack

- **Frontend:** React, Recharts
- **Backend:** Express.js, Node.js, MongoDB, Node-Cron
- **APIs:** Codeforces API
- **Styling:** Plain CSS 

---

## 🧪 How to Run

```bash
# Backend
cd server
npm install
node index.js

# Frontend
cd client
npm install
npm start
