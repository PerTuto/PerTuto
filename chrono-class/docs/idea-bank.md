# 💡 ChronoClass Idea Bank

This document tracks future enhancements, AI features, and architectural improvements for the ChronoClass platform.

## 🎙️ AI & Voice
- [ ] **Voice Feedback (TTS)**: Integrate Google Cloud Text-to-Speech so the Gemini Voice Assistant can speak responses back to the user.
- [ ] **Proactive Voice Notifications**: Assistant notifies teacher of upcoming conflicts via audio during the morning briefing.
- [ ] **Multilingual Support**: AI-driven translation for dashboard and assignments to support global students.

## 📅 Scheduling & Intelligence
- [x] **Smart Conflict Auto-Resolve**: (Implemented) AI suggests alternative slots and populates the form in one click.
- [ ] **Intelligent Batch Rescheduling**: If a teacher is sick, AI suggests a new week-long schedule for all affected classes.
- [ ] **Student Preference Mapping**: AI analyzes student historical attendance to suggest times they are most likely to attend.

## 🎓 Student Engagement
- [ ] **AI Assignment Feedback**: Grade student submissions using Genkit and provide per-line constructive feedback.
- [ ] **Predictive Progress Tracking**: AI identifies students "at risk" of falling behind based on attendance and assignment scores.
- [ ] **Personalized Learning Paths**: AI suggests additional courses or resources to students based on their performance gaps.

## 📹 Attendance & Verification
- [ ] **Production Facial Recognition**: Replace the current simulation with a real TensorFlow.js or OpenCV integration for live video attendance.
- [ ] **Emotional Engagement Analysis**: AI analyzes student faces during class to provide teachers with "Classroom Vibe" reports.

## 🛠️ Infrastructure & Integrations
- [ ] **Robust GCal Deletion**: Implement full bidirectional sync where deleting in GCal also updates ChronoClass.
- [ ] **Discord/Slack Notifications**: Bot that pings students 10 minutes before a class or assignment due date.
- [ ] **Mobile App**: React Native wrapper for the dashboard with native push notifications.

## 📊 Analytics
- [ ] **Tenant Growth Insights**: For "Super Users," AI reports on which courses are most profitable vs. least engaged.
- [ ] **Teacher Efficiency Metrics**: Insights into time spent on grading vs. teaching.
