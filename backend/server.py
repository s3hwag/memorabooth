from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class BookingInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    event_type: str
    event_date: str
    booth_type: str
    package_type: Optional[str] = None
    location: Optional[str] = None
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookingInquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    event_type: str
    event_date: str
    booth_type: str
    package_type: Optional[str] = None
    location: Optional[str] = None
    message: Optional[str] = None

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class NewsletterSubscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsletterSubscriptionCreate(BaseModel):
    email: EmailStr


# Email Sending Function
async def send_booking_email(booking: BookingInquiry):
    """Send booking notification email"""
    try:
        # Email configuration
        sender_email = "noreply@memorabooth.com"
        receiver_email = "sehwagvijay@memorabooth.com"
        
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = f"New Booking Inquiry - {booking.booth_type}"
        message["From"] = sender_email
        message["To"] = receiver_email
        
        # Create HTML content
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #e91e63;">New Booking Inquiry</h2>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <h3>Customer Details:</h3>
                    <p><strong>Name:</strong> {booking.name}</p>
                    <p><strong>Email:</strong> {booking.email}</p>
                    <p><strong>Phone:</strong> {booking.phone}</p>
                    
                    <h3>Event Details:</h3>
                    <p><strong>Event Type:</strong> {booking.event_type}</p>
                    <p><strong>Event Date:</strong> {booking.event_date}</p>
                    <p><strong>Booth Type:</strong> {booking.booth_type}</p>
                    {f'<p><strong>Package Type:</strong> {booking.package_type}</p>' if booking.package_type else ''}
                    {f'<p><strong>Location:</strong> {booking.location}</p>' if booking.location else ''}
                    
                    {f'<h3>Additional Message:</h3><p>{booking.message}</p>' if booking.message else ''}
                    
                    <p style="margin-top: 20px;"><strong>Inquiry ID:</strong> {booking.id}</p>
                    <p><strong>Submitted At:</strong> {booking.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
                </div>
            </body>
        </html>
        """
        
        # Attach HTML content
        html_part = MIMEText(html_content, "html")
        message.attach(html_part)
        
        # Note: In production, you would use proper SMTP configuration
        # For now, we'll log the email content
        logger.info(f"Email notification would be sent for booking {booking.id}")
        logger.info(f"To: {receiver_email}, Subject: {message['Subject']}")
        
        # In production environment, uncomment and configure SMTP:
        # with smtplib.SMTP('smtp.gmail.com', 587) as server:
        #     server.starttls()
        #     server.login(sender_email, os.environ.get('EMAIL_PASSWORD'))
        #     server.send_message(message)
        
    except Exception as e:
        logger.error(f"Failed to send email notification: {str(e)}")


async def send_contact_email(contact: ContactMessage):
    """Send contact form notification email"""
    try:
        sender_email = "noreply@memorabooth.com"
        receiver_email = "sehwagvijay@memorabooth.com"
        
        message = MIMEMultipart("alternative")
        message["Subject"] = f"New Contact Message from {contact.name}"
        message["From"] = sender_email
        message["To"] = receiver_email
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #e91e63;">New Contact Message</h2>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <p><strong>Name:</strong> {contact.name}</p>
                    <p><strong>Email:</strong> {contact.email}</p>
                    {f'<p><strong>Phone:</strong> {contact.phone}</p>' if contact.phone else ''}
                    
                    <h3>Message:</h3>
                    <p style="background-color: white; padding: 15px; border-left: 4px solid #e91e63;">
                        {contact.message}
                    </p>
                    
                    <p style="margin-top: 20px;"><strong>Message ID:</strong> {contact.id}</p>
                    <p><strong>Submitted At:</strong> {contact.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
                </div>
            </body>
        </html>
        """
        
        html_part = MIMEText(html_content, "html")
        message.attach(html_part)
        
        logger.info(f"Email notification would be sent for contact message {contact.id}")
        logger.info(f"To: {receiver_email}, Subject: {message['Subject']}")
        
    except Exception as e:
        logger.error(f"Failed to send email notification: {str(e)}")


# Routes
@api_router.get("/")
async def root():
    return {"message": "Chennai Photobooth Studio API"}

@api_router.post("/bookings", response_model=BookingInquiry)
async def create_booking(input: BookingInquiryCreate, background_tasks: BackgroundTasks):
    booking_dict = input.model_dump()
    booking_obj = BookingInquiry(**booking_dict)
    
    doc = booking_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.bookings.insert_one(doc)
    
    # Send email notification in background
    background_tasks.add_task(send_booking_email, booking_obj)
    
    return booking_obj

@api_router.get("/bookings", response_model=List[BookingInquiry])
async def get_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    
    for booking in bookings:
        if isinstance(booking['timestamp'], str):
            booking['timestamp'] = datetime.fromisoformat(booking['timestamp'])
    
    return bookings

@api_router.post("/contact", response_model=ContactMessage)
async def create_contact(input: ContactMessageCreate, background_tasks: BackgroundTasks):
    contact_dict = input.model_dump()
    contact_obj = ContactMessage(**contact_dict)
    
    doc = contact_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.contacts.insert_one(doc)
    
    # Send email notification in background
    background_tasks.add_task(send_contact_email, contact_obj)
    
    return contact_obj

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contacts():
    contacts = await db.contacts.find({}, {"_id": 0}).to_list(1000)
    
    for contact in contacts:
        if isinstance(contact['timestamp'], str):
            contact['timestamp'] = datetime.fromisoformat(contact['timestamp'])
    
    return contacts

@api_router.post("/newsletter", response_model=NewsletterSubscription)
async def subscribe_newsletter(input: NewsletterSubscriptionCreate):
    # Check if email already exists
    existing = await db.newsletter.find_one({"email": input.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already subscribed")
    
    sub_dict = input.model_dump()
    sub_obj = NewsletterSubscription(**sub_dict)
    
    doc = sub_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.newsletter.insert_one(doc)
    return sub_obj


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()