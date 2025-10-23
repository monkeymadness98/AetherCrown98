#!/usr/bin/env python3
"""
Secret Rotation Script for AetherCrown98
Helps rotate API keys and secrets safely
"""

import os
import sys
import json
import subprocess
from datetime import datetime
from typing import Dict, List, Optional


class SecretRotator:
    """Manage secret rotation across services"""
    
    def __init__(self):
        """Initialize secret rotator"""
        self.rotation_log = "secret_rotation_log.json"
        self.load_rotation_history()
    
    def load_rotation_history(self):
        """Load rotation history from file"""
        if os.path.exists(self.rotation_log):
            with open(self.rotation_log, 'r') as f:
                self.history = json.load(f)
        else:
            self.history = {"rotations": []}
    
    def save_rotation_history(self):
        """Save rotation history to file"""
        with open(self.rotation_log, 'w') as f:
            json.dump(self.history, f, indent=2)
    
    def log_rotation(self, secret_name: str, service: str, status: str):
        """Log a secret rotation"""
        entry = {
            "secret_name": secret_name,
            "service": service,
            "timestamp": datetime.now().isoformat(),
            "status": status
        }
        self.history["rotations"].append(entry)
        self.save_rotation_history()
    
    def rotate_render_secrets(self, secrets: Dict[str, str]):
        """
        Rotate secrets in Render
        
        Args:
            secrets: Dictionary of {secret_name: new_value}
        """
        print("🔄 Rotating Render secrets...")
        
        render_api_key = os.getenv('RENDER_API_KEY')
        if not render_api_key:
            print("❌ RENDER_API_KEY not set")
            return False
        
        # In production, use Render API to update secrets
        # For now, provide instructions
        print("\n📋 To rotate Render secrets:")
        print("1. Go to https://dashboard.render.com")
        print("2. Select your service")
        print("3. Go to Environment tab")
        print("4. Update the following secrets:\n")
        
        for secret_name, new_value in secrets.items():
            masked_value = new_value[:4] + "..." + new_value[-4:]
            print(f"   {secret_name} = {masked_value}")
            self.log_rotation(secret_name, "render", "pending")
        
        print("\n5. Click 'Save Changes'")
        print("6. Redeploy the service\n")
        
        return True
    
    def rotate_vercel_secrets(self, secrets: Dict[str, str]):
        """
        Rotate secrets in Vercel
        
        Args:
            secrets: Dictionary of {secret_name: new_value}
        """
        print("🔄 Rotating Vercel secrets...")
        
        vercel_token = os.getenv('VERCEL_TOKEN')
        if not vercel_token:
            print("❌ VERCEL_TOKEN not set")
            return False
        
        # In production, use Vercel API to update secrets
        # For now, provide instructions
        print("\n📋 To rotate Vercel secrets:")
        print("1. Go to https://vercel.com/dashboard")
        print("2. Select your project")
        print("3. Go to Settings → Environment Variables")
        print("4. Update the following secrets:\n")
        
        for secret_name, new_value in secrets.items():
            masked_value = new_value[:4] + "..." + new_value[-4:]
            print(f"   {secret_name} = {masked_value}")
            self.log_rotation(secret_name, "vercel", "pending")
        
        print("\n5. Click 'Save' for each variable")
        print("6. Redeploy the project\n")
        
        return True
    
    def rotate_supabase_keys(self):
        """
        Rotate Supabase keys
        """
        print("🔄 Rotating Supabase keys...")
        
        print("\n📋 To rotate Supabase keys:")
        print("1. Go to https://supabase.com/dashboard")
        print("2. Select your project")
        print("3. Go to Project Settings → API")
        print("4. Click 'Reset' for service_role key (use with caution!)")
        print("5. Update the new key in:")
        print("   - Render environment variables")
        print("   - .env file locally")
        print("\n⚠️  WARNING: Resetting keys will invalidate all existing keys!")
        
        confirm = input("\nAre you sure you want to reset Supabase keys? (yes/no): ")
        if confirm.lower() == 'yes':
            self.log_rotation("SUPABASE_SERVICE_ROLE_KEY", "supabase", "pending")
            print("✅ Please complete the rotation in Supabase dashboard")
            return True
        else:
            print("❌ Rotation cancelled")
            return False
    
    def rotate_payment_keys(self, provider: str):
        """
        Rotate payment provider keys
        
        Args:
            provider: 'paypal' or 'stripe'
        """
        print(f"🔄 Rotating {provider.upper()} keys...")
        
        if provider == 'paypal':
            print("\n📋 To rotate PayPal keys:")
            print("1. Go to https://developer.paypal.com/dashboard")
            print("2. Go to Apps & Credentials")
            print("3. Select your app")
            print("4. Click 'Show' under Secret")
            print("5. Generate new secret (revokes old one)")
            print("6. Update in Render and Vercel\n")
            self.log_rotation("PAYPAL_SECRET", "paypal", "pending")
            
        elif provider == 'stripe':
            print("\n📋 To rotate Stripe keys:")
            print("1. Go to https://dashboard.stripe.com")
            print("2. Go to Developers → API keys")
            print("3. Click 'Roll' for the secret key")
            print("4. Confirm the roll (invalidates old key)")
            print("5. Update in Render and Vercel")
            print("\n⚠️  Old key stops working immediately!\n")
            self.log_rotation("STRIPE_SECRET_KEY", "stripe", "pending")
        
        return True
    
    def generate_new_secrets(self, length: int = 32) -> str:
        """
        Generate a new random secret
        
        Args:
            length: Length of the secret
            
        Returns:
            Generated secret
        """
        import secrets
        import string
        
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))
    
    def check_secret_age(self):
        """Check the age of secrets and recommend rotation"""
        print("🔍 Checking secret ages...\n")
        
        if not self.history["rotations"]:
            print("📅 No rotation history found.")
            print("   Recommendation: Rotate all secrets as a baseline.\n")
            return
        
        # Get last rotation for each secret
        last_rotations = {}
        for rotation in self.history["rotations"]:
            secret = rotation["secret_name"]
            timestamp = datetime.fromisoformat(rotation["timestamp"])
            
            if secret not in last_rotations or timestamp > last_rotations[secret]:
                last_rotations[secret] = timestamp
        
        # Check each secret
        now = datetime.now()
        recommendations = []
        
        for secret, last_rotation in last_rotations.items():
            days_old = (now - last_rotation).days
            
            if days_old > 90:
                recommendations.append(f"❌ {secret}: {days_old} days old (ROTATE NOW)")
            elif days_old > 60:
                recommendations.append(f"⚠️  {secret}: {days_old} days old (rotate soon)")
            else:
                recommendations.append(f"✅ {secret}: {days_old} days old (ok)")
        
        for rec in recommendations:
            print(rec)
        
        print("\n📌 Best Practice: Rotate secrets every 90 days")
    
    def interactive_rotation(self):
        """Interactive secret rotation wizard"""
        print("=" * 60)
        print("AetherCrown98 Secret Rotation Wizard")
        print("=" * 60)
        print()
        
        while True:
            print("\nWhat would you like to do?")
            print("1. Check secret ages")
            print("2. Rotate Render secrets")
            print("3. Rotate Vercel secrets")
            print("4. Rotate Supabase keys")
            print("5. Rotate PayPal keys")
            print("6. Rotate Stripe keys")
            print("7. Generate new random secret")
            print("8. View rotation history")
            print("9. Exit")
            
            choice = input("\nEnter choice (1-9): ").strip()
            
            if choice == '1':
                self.check_secret_age()
            
            elif choice == '2':
                secrets = {}
                print("\nEnter secrets to rotate (empty line to finish):")
                while True:
                    name = input("Secret name: ").strip()
                    if not name:
                        break
                    value = input("New value: ").strip()
                    secrets[name] = value
                
                if secrets:
                    self.rotate_render_secrets(secrets)
            
            elif choice == '3':
                secrets = {}
                print("\nEnter secrets to rotate (empty line to finish):")
                while True:
                    name = input("Secret name: ").strip()
                    if not name:
                        break
                    value = input("New value: ").strip()
                    secrets[name] = value
                
                if secrets:
                    self.rotate_vercel_secrets(secrets)
            
            elif choice == '4':
                self.rotate_supabase_keys()
            
            elif choice == '5':
                self.rotate_payment_keys('paypal')
            
            elif choice == '6':
                self.rotate_payment_keys('stripe')
            
            elif choice == '7':
                length = input("Secret length (default 32): ").strip()
                length = int(length) if length else 32
                secret = self.generate_new_secrets(length)
                print(f"\nGenerated secret: {secret}")
                print("⚠️  Save this securely! It won't be shown again.")
            
            elif choice == '8':
                print("\n📜 Rotation History:")
                for rotation in self.history["rotations"][-10:]:  # Last 10
                    print(f"  {rotation['timestamp']}: {rotation['secret_name']} ({rotation['service']}) - {rotation['status']}")
            
            elif choice == '9':
                print("\n👋 Goodbye!")
                break
            
            else:
                print("Invalid choice. Please try again.")


def main():
    """Main entry point"""
    rotator = SecretRotator()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == 'check':
            rotator.check_secret_age()
        elif command == 'history':
            print(json.dumps(rotator.history, indent=2))
        else:
            print(f"Unknown command: {command}")
            print("Usage: rotate_secrets.py [check|history]")
    else:
        # Interactive mode
        rotator.interactive_rotation()


if __name__ == "__main__":
    main()
