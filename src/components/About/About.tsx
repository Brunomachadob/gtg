import React from 'react';
import { Info, Target, Clock, TrendingUp, Calendar, Zap, CheckCircle, Settings, BarChart3 } from 'lucide-react';
import './About.css';

export function About() {
  return (
    <div className="about-page">
      {/* Page Header */}
      <div className="about-header">
        <h1 className="about-title">Grease the Groove</h1>
        <p className="about-subtitle">
          Master your bodyweight exercises through frequent, submaximal practice
        </p>
      </div>

      {/* Main Content Cards */}
      <div className="about-content">
        <div className="about-card">
          <div className="card-header">
            <div className="card-icon">
              <Info size={24} />
            </div>
            <h2 className="card-title">What is Grease the Groove?</h2>
          </div>
          <div className="card-content">
            <p>
              <strong>Grease the Groove (GTG)</strong> is a training method developed by Pavel Tsatsouline
              that focuses on practicing a movement frequently throughout the day at submaximal intensity.
              Instead of doing exhausting sets to failure, you perform multiple easy sets spread across
              the entire day.
            </p>
            <p>
              The key principle is <em>"practice makes permanent"</em> - by performing the exercise often
              but never to exhaustion, you develop neural pathways and strength without fatigue, leading
              to remarkable improvements in performance.
            </p>
          </div>
        </div>

        <div className="about-card power-card">
          <div className="card-header">
            <div className="card-icon">
              <Zap size={24} />
            </div>
            <h2 className="card-title">How Does GTG Work?</h2>
          </div>
          <div className="card-content">
            <p>GTG works through several key principles:</p>
            <ul>
              <li>Frequent practice builds neural pathways</li>
              <li>Submaximal intensity prevents fatigue</li>
              <li>Consistent repetition improves motor patterns</li>
              <li>High volume with low stress maximizes adaptation</li>
            </ul>
            <p>
              By staying fresh and practicing often, your nervous system learns to recruit muscles
              more efficiently, leading to strength gains without the stress of traditional training.
            </p>
          </div>
        </div>

        <div className="about-card green-card">
          <div className="card-header">
            <div className="card-icon">
              <TrendingUp size={24} />
            </div>
            <h2 className="card-title">Benefits of GTG</h2>
          </div>
          <div className="card-content">
            <p>This method offers unique advantages:</p>
            <ul>
              <li>Rapid strength gains without fatigue</li>
              <li>Improved movement quality and technique</li>
              <li>Can be done anywhere, anytime</li>
              <li>Builds consistency and habit formation</li>
              <li>Minimal time commitment per session</li>
            </ul>
            <p>
              Perfect for busy schedules - just a few minutes several times throughout your day
              can lead to remarkable improvements in your pull-ups and dips.
            </p>
          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="about-card purple-card">
          <div className="card-header">
            <div className="card-icon">
              <Target size={24} />
            </div>
            <h2 className="card-title">Pro Tips</h2>
          </div>
          <div className="card-content">
            <p>Master your GTG training with these expert recommendations from experienced practitioners
              who have achieved remarkable results using this method.</p>
            <ul>
              <li>Start with 50-70% of your max reps to avoid fatigue</li>
              <li>Space sets at least 15-30 minutes apart</li>
              <li>Focus on perfect form over high numbers</li>
              <li>Test your max every 2-3 weeks to track progress</li>
              <li>Listen to your body - skip sets if you feel tired</li>
              <li>Consistency beats intensity - aim for daily practice</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="how-to-use-section">
        <div className="section-header">
          <h2 className="section-title">How to Use This App</h2>
          <p className="section-subtitle">Follow these simple steps to start your GTG journey</p>
        </div>

        <div className="instructions-grid">
          <div className="instruction-card">
            <div className="instruction-header">
              <div className="instruction-number">1</div>
              <h3 className="instruction-title">Set Your Schedule</h3>
            </div>
            <div className="instruction-content">
              Configure which exercises to do on which days. You can alternate between pull-ups and dips,
              or focus on one exercise at a time. Include rest days for recovery.
            </div>
          </div>

          <div className="instruction-card">
            <div className="instruction-header">
              <div className="instruction-number">2</div>
              <h3 className="instruction-title">Configure Your Settings</h3>
            </div>
            <div className="instruction-content">
              Set your current max reps for each exercise, your target goals, daily set count, and
              reminder intervals. The app will help you stay consistent with gentle notifications.
            </div>
          </div>

          <div className="instruction-card">
            <div className="instruction-header">
              <div className="instruction-number">3</div>
              <h3 className="instruction-title">Perform Your Sets</h3>
            </div>
            <div className="instruction-content">
              Throughout the day, when reminded, perform easy sets at about 50-80% of your max.
              Never go to failure - stay fresh and strong for the next set.
            </div>
          </div>

          <div className="instruction-card">
            <div className="instruction-header">
              <div className="instruction-number">4</div>
              <h3 className="instruction-title">Track Your Progress</h3>
            </div>
            <div className="instruction-content">
              Log each set in the app and watch your statistics grow. Update your max reps regularly
              as you get stronger, and celebrate your consistent progress.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
