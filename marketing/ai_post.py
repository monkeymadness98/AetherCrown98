"""
AI-Powered Marketing Automation Module
Automatically generates and posts content to Twitter, LinkedIn, and Instagram
"""
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import tweepy
from linkedin_api import Linkedin
from instagrapi import Client as InstaClient
import httpx
from enum import Enum

class Platform(str, Enum):
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    INSTAGRAM = "instagram"

class MarketingCampaign:
    """Manages marketing campaigns across multiple platforms"""
    
    def __init__(self):
        # Twitter/X API credentials
        self.twitter_api_key = os.getenv("TWITTER_API_KEY")
        self.twitter_api_secret = os.getenv("TWITTER_API_SECRET")
        self.twitter_access_token = os.getenv("TWITTER_ACCESS_TOKEN")
        self.twitter_access_secret = os.getenv("TWITTER_ACCESS_SECRET")
        self.twitter_bearer_token = os.getenv("TWITTER_BEARER_TOKEN")
        
        # LinkedIn credentials
        self.linkedin_email = os.getenv("LINKEDIN_EMAIL")
        self.linkedin_password = os.getenv("LINKEDIN_PASSWORD")
        
        # Instagram credentials
        self.instagram_username = os.getenv("INSTAGRAM_USERNAME")
        self.instagram_password = os.getenv("INSTAGRAM_PASSWORD")
        
        # Supabase for tracking
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")
        
        # Initialize clients
        self._init_clients()
    
    def _init_clients(self):
        """Initialize API clients for each platform"""
        # Twitter client
        if all([self.twitter_api_key, self.twitter_api_secret, 
                self.twitter_access_token, self.twitter_access_secret]):
            auth = tweepy.OAuth1UserHandler(
                self.twitter_api_key,
                self.twitter_api_secret,
                self.twitter_access_token,
                self.twitter_access_secret
            )
            self.twitter_client = tweepy.API(auth)
            self.twitter_v2_client = tweepy.Client(
                bearer_token=self.twitter_bearer_token,
                consumer_key=self.twitter_api_key,
                consumer_secret=self.twitter_api_secret,
                access_token=self.twitter_access_token,
                access_token_secret=self.twitter_access_secret
            )
        else:
            self.twitter_client = None
            self.twitter_v2_client = None
        
        # LinkedIn client
        if self.linkedin_email and self.linkedin_password:
            try:
                self.linkedin_client = Linkedin(
                    self.linkedin_email,
                    self.linkedin_password
                )
            except Exception:
                self.linkedin_client = None
        else:
            self.linkedin_client = None
        
        # Instagram client
        if self.instagram_username and self.instagram_password:
            self.instagram_client = InstaClient()
            try:
                self.instagram_client.login(
                    self.instagram_username,
                    self.instagram_password
                )
            except Exception:
                self.instagram_client = None
        else:
            self.instagram_client = None
    
    async def generate_ai_content(self, metrics: Dict) -> str:
        """
        Generate AI-powered marketing content based on metrics
        
        Args:
            metrics: Dictionary containing revenue, transactions, growth data
            
        Returns:
            Generated marketing content
        """
        revenue = metrics.get("revenue", 0)
        transactions = metrics.get("transactions", 0)
        growth = metrics.get("growth_rate", 0)
        
        # AI-generated content (simplified - integrate with OpenAI/Claude in production)
        content = f"""🚀 Weekly AetherCrown98 Update

💰 Revenue: ${revenue:,.2f}
📊 Transactions: {transactions}
📈 Growth: {growth}%

Our AI-driven empire continues to expand! 
Autonomous business operations at their finest.

#AI #Automation #BusinessGrowth #AetherCrown98
"""
        return content
    
    async def post_to_twitter(self, content: str) -> Optional[Dict]:
        """
        Post content to Twitter/X
        
        Args:
            content: Text content to post
            
        Returns:
            Response data or None if failed
        """
        if not self.twitter_v2_client:
            print("Twitter client not initialized")
            return None
        
        try:
            response = self.twitter_v2_client.create_tweet(text=content)
            return {
                "platform": Platform.TWITTER,
                "post_id": response.data["id"],
                "status": "success",
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            print(f"Twitter post failed: {e}")
            return None
    
    async def post_to_linkedin(self, content: str) -> Optional[Dict]:
        """
        Post content to LinkedIn
        
        Args:
            content: Text content to post
            
        Returns:
            Response data or None if failed
        """
        if not self.linkedin_client:
            print("LinkedIn client not initialized")
            return None
        
        try:
            # Note: linkedin-api is unofficial, production should use official API
            response = self.linkedin_client.post_text(content)
            return {
                "platform": Platform.LINKEDIN,
                "post_id": response.get("id", "unknown"),
                "status": "success",
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            print(f"LinkedIn post failed: {e}")
            return None
    
    async def post_to_instagram(self, content: str, image_path: Optional[str] = None) -> Optional[Dict]:
        """
        Post content to Instagram
        
        Args:
            content: Caption text
            image_path: Path to image file (required for Instagram)
            
        Returns:
            Response data or None if failed
        """
        if not self.instagram_client or not image_path:
            print("Instagram client not initialized or no image provided")
            return None
        
        try:
            media = self.instagram_client.photo_upload(image_path, content)
            return {
                "platform": Platform.INSTAGRAM,
                "post_id": media.id,
                "status": "success",
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            print(f"Instagram post failed: {e}")
            return None
    
    async def track_campaign(self, campaign_data: Dict):
        """
        Track campaign in Supabase marketing_campaigns table
        
        Args:
            campaign_data: Campaign information to store
        """
        if not self.supabase_url or not self.supabase_key:
            print("Supabase not configured")
            return
        
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "apikey": self.supabase_key,
                    "Authorization": f"Bearer {self.supabase_key}",
                    "Content-Type": "application/json"
                }
                
                response = await client.post(
                    f"{self.supabase_url}/rest/v1/marketing_campaigns",
                    json=campaign_data,
                    headers=headers
                )
                
                if response.status_code in [200, 201]:
                    print("Campaign tracked successfully")
                else:
                    print(f"Campaign tracking failed: {response.status_code}")
        except Exception as e:
            print(f"Campaign tracking error: {e}")
    
    async def run_weekly_campaign(self, metrics: Dict):
        """
        Execute weekly marketing campaign across all platforms
        
        Args:
            metrics: Business metrics for content generation
        """
        # Generate AI content
        content = await self.generate_ai_content(metrics)
        
        # Post to all platforms
        results = []
        
        twitter_result = await self.post_to_twitter(content)
        if twitter_result:
            results.append(twitter_result)
        
        linkedin_result = await self.post_to_linkedin(content)
        if linkedin_result:
            results.append(linkedin_result)
        
        # Track campaign
        campaign_data = {
            "campaign_name": f"weekly_update_{datetime.utcnow().strftime('%Y%m%d')}",
            "content": content,
            "platforms": [r["platform"] for r in results],
            "status": "completed",
            "metrics": metrics,
            "results": results,
            "created_at": datetime.utcnow().isoformat()
        }
        
        await self.track_campaign(campaign_data)
        
        return {
            "success": True,
            "content": content,
            "results": results
        }

# CLI interface for running campaigns
async def main():
    """Main entry point for campaign execution"""
    campaign = MarketingCampaign()
    
    # Example metrics (fetch from database in production)
    metrics = {
        "revenue": 15234.50,
        "transactions": 142,
        "growth_rate": 23.5
    }
    
    result = await campaign.run_weekly_campaign(metrics)
    print(f"Campaign completed: {result}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
