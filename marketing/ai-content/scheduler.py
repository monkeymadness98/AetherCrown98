#!/usr/bin/env python3
"""
Content Scheduler for AetherCrown98
Automates content publishing on a weekly cadence
"""

import os
import json
import schedule
import time
from datetime import datetime, timedelta
from typing import Dict, List
from generate_post import ContentGenerator


class ContentScheduler:
    """Automate content generation and publishing"""
    
    def __init__(self):
        """Initialize scheduler"""
        self.generator = ContentGenerator()
        self.schedule_file = "schedule.json"
        self.load_schedule()
    
    def load_schedule(self):
        """Load publishing schedule from file"""
        if os.path.exists(self.schedule_file):
            with open(self.schedule_file, 'r') as f:
                self.schedule_data = json.load(f)
        else:
            # Default weekly schedule
            self.schedule_data = {
                "blog_posts": {
                    "frequency": "weekly",
                    "day": "monday",
                    "time": "09:00"
                },
                "social_posts": {
                    "frequency": "3_per_week",
                    "days": ["monday", "wednesday", "friday"],
                    "time": "10:00"
                },
                "email_campaigns": {
                    "frequency": "biweekly",
                    "day": "thursday",
                    "time": "14:00"
                }
            }
            self.save_schedule()
    
    def save_schedule(self):
        """Save schedule to file"""
        with open(self.schedule_file, 'w') as f:
            json.dump(self.schedule_data, f, indent=2)
    
    def generate_weekly_blog(self):
        """Generate and queue weekly blog post"""
        print(f"[{datetime.now()}] Generating weekly blog post...")
        
        topics = [
            "AI-Driven Business Automation: Best Practices",
            "5 Ways to Boost Productivity with AetherCrown98",
            "The Future of Business Intelligence",
            "From Manual to Automated: A Business Transformation Guide",
            "How to Scale Your Business with AI"
        ]
        
        # Rotate through topics
        week_num = datetime.now().isocalendar()[1]
        topic = topics[week_num % len(topics)]
        
        try:
            blog = self.generator.generate_blog_post(
                topic=topic,
                keywords=["AI", "automation", "business", "efficiency"],
                tone="professional",
                length="medium"
            )
            
            # Save to output directory
            timestamp = datetime.now().strftime("%Y%m%d")
            filename = f"blog_{timestamp}.json"
            self.generator.save_content(blog, filename, "../output/blogs")
            
            print(f"✅ Blog post generated: {blog['title']}")
            
        except Exception as e:
            print(f"❌ Error generating blog post: {e}")
    
    def generate_social_content(self):
        """Generate social media posts"""
        print(f"[{datetime.now()}] Generating social media posts...")
        
        topics = [
            "New feature announcement",
            "Customer success story",
            "Industry insights",
            "Product tips and tricks",
            "Company milestone"
        ]
        
        day_num = datetime.now().weekday()
        topic = topics[day_num % len(topics)]
        
        try:
            # Generate for multiple platforms
            platforms = ["twitter", "linkedin", "facebook"]
            posts = {}
            
            for platform in platforms:
                post = self.generator.generate_social_post(
                    platform=platform,
                    topic=topic,
                    include_hashtags=True
                )
                posts[platform] = post
                print(f"✅ {platform}: {post[:50]}...")
            
            # Save posts
            timestamp = datetime.now().strftime("%Y%m%d_%H%M")
            filename = f"social_{timestamp}.json"
            self.generator.save_content(posts, filename, "../output/social")
            
        except Exception as e:
            print(f"❌ Error generating social posts: {e}")
    
    def generate_email_campaign(self):
        """Generate email campaign"""
        print(f"[{datetime.now()}] Generating email campaign...")
        
        campaigns = [
            {"type": "nurture", "audience": "trial users in week 1"},
            {"type": "promotion", "audience": "active free tier users"},
            {"type": "re-engagement", "audience": "inactive users"},
            {"type": "welcome", "audience": "new signups"}
        ]
        
        week_num = datetime.now().isocalendar()[1]
        campaign = campaigns[week_num % len(campaigns)]
        
        try:
            email = self.generator.generate_email_campaign(
                campaign_type=campaign["type"],
                audience=campaign["audience"]
            )
            
            # Save email
            timestamp = datetime.now().strftime("%Y%m%d")
            filename = f"email_{campaign['type']}_{timestamp}.json"
            self.generator.save_content(email, filename, "../output/emails")
            
            print(f"✅ Email campaign generated: {email['subject']}")
            
        except Exception as e:
            print(f"❌ Error generating email campaign: {e}")
    
    def setup_schedule(self):
        """Set up the publishing schedule"""
        print("Setting up content publishing schedule...")
        
        # Blog posts - every Monday at 9 AM
        schedule.every().monday.at("09:00").do(self.generate_weekly_blog)
        
        # Social posts - Monday, Wednesday, Friday at 10 AM
        schedule.every().monday.at("10:00").do(self.generate_social_content)
        schedule.every().wednesday.at("10:00").do(self.generate_social_content)
        schedule.every().friday.at("10:00").do(self.generate_social_content)
        
        # Email campaigns - every other Thursday at 2 PM
        # (In production, implement proper bi-weekly logic)
        schedule.every().thursday.at("14:00").do(self.generate_email_campaign)
        
        print("✅ Schedule configured successfully!")
        print("\nScheduled tasks:")
        print("- Blog posts: Every Monday at 9:00 AM")
        print("- Social posts: Mon/Wed/Fri at 10:00 AM")
        print("- Email campaigns: Every Thursday at 2:00 PM")
    
    def run(self):
        """Run the scheduler"""
        self.setup_schedule()
        
        print("\n🚀 Content scheduler started!")
        print("Press Ctrl+C to stop\n")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
                
        except KeyboardInterrupt:
            print("\n\nScheduler stopped by user")


def main():
    """Main entry point"""
    print("=" * 50)
    print("AetherCrown98 Content Scheduler")
    print("=" * 50)
    print()
    
    # Check for OpenAI API key
    if not os.getenv('OPENAI_API_KEY'):
        print("⚠️  WARNING: OPENAI_API_KEY not set")
        print("Set it with: export OPENAI_API_KEY='your-key-here'")
        print()
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            return
    
    scheduler = ContentScheduler()
    
    # Optionally generate content immediately for testing
    print("\nGenerate content now for testing? (y/n): ", end='')
    response = input()
    
    if response.lower() == 'y':
        print("\nGenerating test content...")
        scheduler.generate_weekly_blog()
        scheduler.generate_social_content()
        scheduler.generate_email_campaign()
        print("\n✅ Test content generated!")
    
    print("\nStart scheduler? (y/n): ", end='')
    response = input()
    
    if response.lower() == 'y':
        scheduler.run()
    else:
        print("Scheduler not started")


if __name__ == "__main__":
    main()
