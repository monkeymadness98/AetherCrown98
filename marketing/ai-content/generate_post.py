#!/usr/bin/env python3
"""
AI Content Generation Script for AetherCrown98
Uses OpenAI API to generate marketing content
"""

import os
import json
from datetime import datetime
from typing import Dict, List, Optional

# Requires: pip install openai
try:
    import openai
except ImportError:
    print("OpenAI library not installed. Install with: pip install openai")
    exit(1)


class ContentGenerator:
    """Generate marketing content using OpenAI API"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize content generator
        
        Args:
            api_key: OpenAI API key (defaults to OPENAI_API_KEY env var)
        """
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key not provided")
        
        openai.api_key = self.api_key
    
    def generate_blog_post(
        self,
        topic: str,
        keywords: List[str],
        tone: str = "professional",
        length: str = "medium"
    ) -> Dict[str, str]:
        """
        Generate a blog post
        
        Args:
            topic: Main topic of the blog post
            keywords: List of keywords to include
            tone: Writing tone (professional, casual, technical)
            length: Post length (short, medium, long)
        
        Returns:
            Dict with title, content, and metadata
        """
        word_counts = {
            "short": "500-700",
            "medium": "1000-1500",
            "long": "2000-3000"
        }
        
        prompt = f"""
        Write a {tone} blog post about {topic} for AetherCrown98, 
        an AI-driven business automation platform.
        
        Requirements:
        - Length: {word_counts.get(length, "1000-1500")} words
        - Include these keywords naturally: {', '.join(keywords)}
        - Include an engaging title
        - Add a meta description (150-160 characters)
        - Structure with clear sections and headers
        - Include a call-to-action at the end
        - Make it SEO-friendly
        
        Format the response as JSON with keys: title, meta_description, content
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert content writer specializing in SaaS marketing."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=3000
            )
            
            content = response.choices[0].message.content
            result = json.loads(content)
            
            result['generated_at'] = datetime.now().isoformat()
            result['topic'] = topic
            result['keywords'] = keywords
            
            return result
            
        except Exception as e:
            print(f"Error generating blog post: {e}")
            raise
    
    def generate_social_post(
        self,
        platform: str,
        topic: str,
        include_hashtags: bool = True
    ) -> str:
        """
        Generate a social media post
        
        Args:
            platform: Social platform (twitter, linkedin, facebook)
            topic: Topic or announcement to post about
            include_hashtags: Whether to include hashtags
        
        Returns:
            Generated social media post text
        """
        char_limits = {
            "twitter": 280,
            "linkedin": 3000,
            "facebook": 500
        }
        
        prompt = f"""
        Write a {platform} post about {topic} for AetherCrown98.
        
        Requirements:
        - Maximum {char_limits.get(platform, 280)} characters
        - Engaging and attention-grabbing
        - Include a call-to-action
        {"- Include relevant hashtags" if include_hashtags else ""}
        - Match the tone of {platform}
        
        Return only the post text, no additional formatting.
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a social media marketing expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=200
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating social post: {e}")
            raise
    
    def generate_email_campaign(
        self,
        campaign_type: str,
        audience: str
    ) -> Dict[str, str]:
        """
        Generate email campaign content
        
        Args:
            campaign_type: Type of email (welcome, nurture, promotion, re-engagement)
            audience: Target audience description
        
        Returns:
            Dict with subject, preview_text, and body
        """
        prompt = f"""
        Create a {campaign_type} email for AetherCrown98 targeting {audience}.
        
        Requirements:
        - Compelling subject line (under 60 characters)
        - Preview text (40-90 characters)
        - Email body with clear structure
        - Strong call-to-action
        - Professional but friendly tone
        - Include personalization placeholders like {{first_name}}
        
        Format as JSON with keys: subject, preview_text, body
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert email marketer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            content = response.choices[0].message.content
            result = json.loads(content)
            
            result['campaign_type'] = campaign_type
            result['audience'] = audience
            result['generated_at'] = datetime.now().isoformat()
            
            return result
            
        except Exception as e:
            print(f"Error generating email campaign: {e}")
            raise
    
    def save_content(self, content: Dict, filename: str, output_dir: str = "../output"):
        """
        Save generated content to file
        
        Args:
            content: Content dictionary to save
            filename: Output filename
            output_dir: Directory to save to
        """
        os.makedirs(output_dir, exist_ok=True)
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w') as f:
            json.dump(content, f, indent=2)
        
        print(f"Content saved to: {filepath}")


def main():
    """Example usage"""
    
    # Initialize generator
    try:
        generator = ContentGenerator()
    except ValueError as e:
        print(f"Error: {e}")
        print("Set OPENAI_API_KEY environment variable or pass api_key parameter")
        return
    
    # Example 1: Generate blog post
    print("Generating blog post...")
    blog = generator.generate_blog_post(
        topic="How AI Automation Can Transform Your Business",
        keywords=["AI automation", "business efficiency", "productivity"],
        tone="professional",
        length="medium"
    )
    generator.save_content(blog, "blog_ai_automation.json")
    print(f"Title: {blog['title']}\n")
    
    # Example 2: Generate social posts
    print("Generating social media posts...")
    platforms = ["twitter", "linkedin"]
    for platform in platforms:
        post = generator.generate_social_post(
            platform=platform,
            topic="Launch of AetherCrown98 Pro plan with new features",
            include_hashtags=True
        )
        print(f"\n{platform.upper()}:")
        print(post)
    
    # Example 3: Generate email campaign
    print("\n\nGenerating email campaign...")
    email = generator.generate_email_campaign(
        campaign_type="welcome",
        audience="new trial users"
    )
    generator.save_content(email, "email_welcome.json")
    print(f"Subject: {email['subject']}")


if __name__ == "__main__":
    main()
