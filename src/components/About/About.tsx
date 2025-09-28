import React from 'react';
import { Info, Target, Clock, TrendingUp, Calendar, Zap } from 'lucide-react';
import './About.css';

export function About() {
  return (
    <div className="about-page">
      <div className="about-content">
        <div className="about-inner">
          {/* Hero Section */}
          <div className="about-hero">
            <div className="hero-icon">
              <Target className="text-blue-600" size={48} />
            </div>
            <h1>Grease the Groove</h1>
            <p className="hero-subtitle">
              Master your bodyweight exercises through frequent, submaximal practice
            </p>
          </div>

          {/* What is GTG Section */}
          <div className="about-section">
            <div className="section-header">
              <Info className="text-green-600" size={24} />
              <h2>What is Grease the Groove?</h2>
            </div>
            <div className="content-card">
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

          {/* How it Works Section */}
          <div className="about-section">
            <div className="section-header">
              <Zap className="text-yellow-600" size={24} />
              <h2>How Does GTG Work?</h2>
            </div>
            <div className="principles-grid">
              <div className="principle-card">
                <div className="principle-icon">
                  <TrendingUp className="text-blue-500" size={32} />
                </div>
                <h3>Neural Adaptation</h3>
                <p>
                  Frequent practice improves motor patterns and neural efficiency,
                  making movements smoother and stronger over time.
                </p>
              </div>
              <div className="principle-card">
                <div className="principle-icon">
                  <Clock className="text-green-500" size={32} />
                </div>
                <h3>No Fatigue</h3>
                <p>
                  By staying well below your maximum, you avoid fatigue and can
                  practice multiple times per day without overtraining.
                </p>
              </div>
              <div className="principle-card">
                <div className="principle-icon">
                  <Calendar className="text-purple-500" size={32} />
                </div>
                <h3>Consistency</h3>
                <p>
                  Daily practice builds habits and creates consistent stimulus
                  for adaptation without the need for lengthy workouts.
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-side sections: How to Use App + Pro Tips */}
          <div className="side-by-side-sections">
            {/* How to Use This App Section */}
            <div className="about-section side-by-side-section">
              <div className="section-header">
                <Target className="text-orange-600" size={24} />
                <h2>How to Use This App</h2>
              </div>
              <div className="steps-container">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Configure Your Schedule</h3>
                    <p>
                      Set up your weekly exercise routine in the Config page. Choose which
                      exercises to practice each day and how many sets you want to complete.
                    </p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Set Your Intensity</h3>
                    <p>
                      For each set, aim for about 50-70% of your maximum reps. If you can
                      do 10 pull-ups max, do 5-7 reps per set. Stay fresh and comfortable.
                    </p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Spread Throughout the Day</h3>
                    <p>
                      Use the optional reminder system to space your sets throughout the day.
                      Aim for at least 15-30 minutes between sets to avoid fatigue.
                    </p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Track Your Progress</h3>
                    <p>
                      Log each set in the Today page and monitor your consistency in the
                      Statistics page. Focus on completing your daily minimum consistently.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips Section */}
            <div className="about-section side-by-side-section">
              <div className="section-header">
                <Zap className="text-red-600" size={24} />
                <h2>Pro Tips</h2>
              </div>
              <div className="tips-grid">
                <div className="tip-card">
                  <h4>Start Conservative</h4>
                  <p>Begin with fewer sets than you think you can handle. It's better to succeed consistently than to burn out.</p>
                </div>
                <div className="tip-card">
                  <h4>Never Go to Failure</h4>
                  <p>Each set should feel easy. If you're struggling or breathing hard, reduce the reps per set.</p>
                </div>
                <div className="tip-card">
                  <h4>Be Consistent</h4>
                  <p>Daily practice is more important than perfect sessions. Aim for your minimum sets every day.</p>
                </div>
                <div className="tip-card">
                  <h4>Include Rest Days</h4>
                  <p>Schedule 1-2 complete rest days per week to allow for full recovery and prevent overuse.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="about-footer">
            <p>
              <strong>Remember:</strong> Grease the Groove is about building strength through practice,
              not exhaustion. Stay consistent, stay fresh, and watch your performance improve over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
