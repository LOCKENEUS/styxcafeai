#!/usr/bin/env python3
"""
Script to create super admin user in the database
Usage: python create_superadmin.py
"""
import asyncio
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_superadmin():
    """Create super admin user"""
    
    # Super admin credentials
    SUPERADMIN_EMAIL = "styxcafe@gmail.com"
    SUPERADMIN_PASSWORD = "10101984#rR"
    SUPERADMIN_NAME = "Styx Cafe Super Admin"
    
    # Connect to MongoDB
    DB_URL = os.getenv("DB_URL", "mongodb://localhost:27017/styxcafe")
    print(f"Connecting to MongoDB: {DB_URL}")
    
    client = AsyncIOMotorClient(DB_URL)
    db = client.get_database()
    
    try:
        # Check if super admin already exists
        existing = await db.superadmins.find_one({"email": SUPERADMIN_EMAIL})
        if existing:
            print(f"❌ Super admin with email {SUPERADMIN_EMAIL} already exists")
            print(f"   ID: {existing['_id']}")
            print(f"   Name: {existing.get('name', 'N/A')}")
            
            # Ask if user wants to update password
            response = input("\nDo you want to update the password? (yes/no): ")
            if response.lower() in ['yes', 'y']:
                # Update password
                hashed_password = pwd_context.hash(SUPERADMIN_PASSWORD)
                await db.superadmins.update_one(
                    {"email": SUPERADMIN_EMAIL},
                    {
                        "$set": {
                            "password": hashed_password,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                print(f"✅ Password updated successfully for {SUPERADMIN_EMAIL}")
            else:
                print("No changes made.")
            return
        
        # Hash password
        hashed_password = pwd_context.hash(SUPERADMIN_PASSWORD)
        
        # Create super admin document
        superadmin = {
            "_id": str(uuid.uuid4()),
            "email": SUPERADMIN_EMAIL,
            "password": hashed_password,
            "name": SUPERADMIN_NAME,
            "role": "superadmin",
            "is_active": True,
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert into database
        result = await db.superadmins.insert_one(superadmin)
        
        print("✅ Super admin created successfully!")
        print(f"\n📧 Email: {SUPERADMIN_EMAIL}")
        print(f"🔑 Password: {SUPERADMIN_PASSWORD}")
        print(f"👤 Name: {SUPERADMIN_NAME}")
        print(f"🆔 ID: {superadmin['_id']}")
        print(f"\n🌐 Login URL: https://admin.styxcafe.in/superadmin/login")
        
    except Exception as e:
        print(f"❌ Error creating super admin: {str(e)}")
        sys.exit(1)
    finally:
        client.close()
        print("\n✅ MongoDB connection closed")

if __name__ == "__main__":
    asyncio.run(create_superadmin())
