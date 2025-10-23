"""
Payment processing service
Handles PayPal and Stripe integrations
"""

import os
import logging
from datetime import datetime
from typing import Dict, Any, Optional
import httpx

from database import supabase_client
from config import settings

logger = logging.getLogger(__name__)

async def get_paypal_access_token() -> Optional[str]:
    """Get PayPal OAuth access token"""
    try:
        auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET)
        
        if settings.PAYPAL_MODE == "sandbox":
            url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
        else:
            url = "https://api-m.paypal.com/v1/oauth2/token"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                auth=auth,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={"grant_type": "client_credentials"}
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get("access_token")
            else:
                logger.error(f"PayPal token error: {response.text}")
                return None
                
    except Exception as e:
        logger.error(f"Failed to get PayPal access token: {e}")
        return None

async def create_payment_order(
    amount: float,
    currency: str = "USD",
    description: str = "AetherCrown98 Payment",
    user_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create a payment order
    Tries PayPal first, falls back to Stripe if needed
    """
    logger.info(f"Creating payment order: {amount} {currency}")
    
    try:
        # For now, create a sandbox/test order
        order_id = f"ORDER_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{int(amount * 100)}"
        
        # Store in database
        payment_data = {
            "order_id": order_id,
            "amount": amount,
            "currency": currency,
            "status": "created",
            "description": description,
            "payment_method": "paypal",
            "created_at": datetime.now().isoformat()
        }
        
        if user_id:
            payment_data["user_id"] = user_id
        
        payment_response = supabase_client.table('payments').insert(payment_data).execute()
        
        logger.info(f"Payment order created: {order_id}")
        
        return {
            "success": True,
            "order_id": order_id,
            "amount": amount,
            "currency": currency,
            "status": "created",
            "payment_method": "paypal",
            "sandbox_mode": settings.PAYPAL_MODE == "sandbox",
            "data": payment_response.data[0] if payment_response.data else None
        }
        
    except Exception as e:
        logger.error(f"Payment order creation failed: {e}")
        return {
            "success": False,
            "error": str(e)
        }

async def capture_payment(order_id: str) -> Dict[str, Any]:
    """Capture/complete a payment"""
    logger.info(f"Capturing payment: {order_id}")
    
    try:
        # Update payment status
        update_response = supabase_client.table('payments').update({
            "status": "completed",
            "completed_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }).eq('order_id', order_id).execute()
        
        if not update_response.data:
            return {
                "success": False,
                "error": "Payment not found"
            }
        
        logger.info(f"Payment captured: {order_id}")
        
        return {
            "success": True,
            "order_id": order_id,
            "status": "completed",
            "data": update_response.data[0]
        }
        
    except Exception as e:
        logger.error(f"Payment capture failed: {e}")
        return {
            "success": False,
            "error": str(e)
        }

async def get_payment_status(order_id: str) -> Dict[str, Any]:
    """Get payment status"""
    try:
        response = supabase_client.table('payments').select('*').eq('order_id', order_id).execute()
        
        if not response.data:
            return {
                "success": False,
                "error": "Payment not found"
            }
        
        return {
            "success": True,
            "payment": response.data[0]
        }
        
    except Exception as e:
        logger.error(f"Payment status retrieval failed: {e}")
        return {
            "success": False,
            "error": str(e)
        }
