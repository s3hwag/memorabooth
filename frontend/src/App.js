import { useState, useEffect } from "react";
import "@/App.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, Camera, Sparkles, Users, Heart, Award, Mail, Phone, Instagram } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "",
    event_date: "",
    booth_type: "",
    package_type: "",
    location: "",
    message: ""
  });

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'booths', 'gallery', 'activations', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/bookings`, bookingData);
      toast.success("Booking inquiry submitted! We'll contact you within 24 hours.");
      setShowBookingForm(false);
      setBookingData({
        name: "",
        email: "",
        phone: "",
        event_type: "",
        event_date: "",
        booth_type: "",
        package_type: "",
        location: "",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
      console.error(error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/contact`, contactData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setContactData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openBookingForm = (boothType, packageType = "", location = "") => {
    setSelectedBooth(boothType);
    setBookingData({
      ...bookingData,
      booth_type: boothType,
      package_type: packageType,
      location: location
    });
    setShowBookingForm(true);
  };

  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-futura font-bold tracking-wide text-gray-900">
              MEMORABOOTH
            </div>
            <div className="hidden lg:flex items-center gap-8">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'booths', label: 'Our Booths' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'activations', label: 'Brand Activations' },
                { id: 'contact', label: 'Contact' }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className={`transition-colors font-medium ${
                    activeSection === item.id 
                      ? 'text-pink-600 border-b-2 border-pink-600 pb-1' 
                      : 'text-gray-700 hover:text-pink-600'
                  }`}
                  data-testid={`nav-${item.id}-btn`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" data-testid="hero-section">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://customer-assets.emergentagent.com/job_forever-photos-4/artifacts/ss76e5gt_Homepage.jpeg" 
            alt="Photo booth memories"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-white/85"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <span className="text-pink-600 font-script text-2xl md:text-3xl italic">capture the moment</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight">
            Chennai's Leading Photobooth Experience
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 font-light max-w-4xl mx-auto leading-relaxed">
            Experience an exquisite blend of elegance, where cherished memories intertwine with cherished keepsakes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => scrollToSection('booths')} 
              size="lg" 
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-12 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all"
              data-testid="hero-explore-btn"
            >
              Explore Our Booths
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')} 
              size="lg" 
              variant="outline" 
              className="border-2 border-gray-900 text-gray-900 px-12 py-7 text-lg rounded-full hover:bg-gray-900 hover:text-white transition-all"
              data-testid="hero-contact-btn"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-white" data-testid="about-section">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Creating Memories, One Snapshot at a Time
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Welcome to Chennai's premier photobooth experience! We specialize in bringing joy, laughter, and unforgettable moments to every occasion. Whether it's a casual mall visit, a special date, or a grand wedding celebration, our photobooths are designed to capture the magic of your moments.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                From our accessible mall booths (Brownie & Butterscotch) to our premium event series (Vanilla), we offer photobooth experiences for every need and budget. Each booth is equipped with high-quality cameras, professional lighting, and instant printing technology.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-8 h-8 text-pink-600" />
                  </div>
                  <p className="font-bold text-2xl text-gray-900">10,000+</p>
                  <p className="text-sm text-gray-600">Photos Captured</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="font-bold text-2xl text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="font-bold text-2xl text-gray-900">100+</p>
                  <p className="text-sm text-gray-600">Events Covered</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1762644220492-128b26914af1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Photo booth strips"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-pink-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
                <p className="font-display text-3xl font-bold">Redefining</p>
                <p className="text-lg font-light">Event Memories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Booths Section */}
      <section id="booths" className="py-24 px-6 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" data-testid="booths-section">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-7xl font-bold text-gray-900 mb-4">
              Our Photobooths
            </h2>
            <p className="text-xl text-gray-600 font-light">Choose the perfect booth for your moment</p>
          </div>

          {/* Mall Booths */}
          <div className="mb-20">
            <h3 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">Walk-in Mall Booths</h3>
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Brownie Photobooth */}
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-none" data-testid="brownie-booth-card">
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_forever-photos-4/artifacts/aaeu6ab1_Brownie.PNG" 
                    alt="Brownie Photobooth"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-display text-3xl font-bold mb-2">Brownie Photobooth</h3>
                    <p className="text-gray-100">Sweet memories, simple fun</p>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Our friendly Brownie booth offers a delightful photobooth experience perfect for spontaneous fun. Step in, strike a pose, and walk out with instant memories – it's that simple!
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Camera className="w-5 h-5 text-amber-600" />
                      <span>Enclosed booth for privacy</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <span>Instant 2-strip prints</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Users className="w-5 h-5 text-amber-600" />
                      <span>Great for friends, families & casual visits</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold">BSR Mall, Thuraipakkam</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl border-2 border-amber-300 text-center">
                    <p className="text-gray-600 text-sm mb-1">Strips starting at</p>
                    <p className="font-bold text-3xl text-amber-700">₹199</p>
                  </div>
                </CardContent>
              </Card>

              {/* Butterscotch Photobooth */}
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-none" data-testid="butterscotch-booth-card">
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_forever-photos-4/artifacts/9x1q1t37_Butterscotch.PNG" 
                    alt="Butterscotch Photobooth"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-display text-3xl font-bold mb-2">Butterscotch Photobooth</h3>
                    <p className="text-gray-100">Premium moments, perfect lighting</p>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Elevate your photobooth experience with Butterscotch! Featuring premium lighting and enhanced quality, it's perfect for dates, special outings, and creating share-worthy social media content.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Camera className="w-5 h-5 text-yellow-600" />
                      <span>Enclosed booth with premium setup</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                      <span>Premium lighting for better photos</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Heart className="w-5 h-5 text-yellow-600" />
                      <span>Perfect for outings, dates & social sharing</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold">Grand Square Mall, Velachery</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border-2 border-yellow-300 text-center">
                    <p className="text-gray-600 text-sm mb-1">Strips starting at</p>
                    <p className="font-bold text-3xl text-yellow-700">₹249</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Vanilla Event Series */}
          <div>
            <div className="text-center mb-12">
              <h3 className="font-display text-4xl font-bold text-gray-900 mb-4">Vanilla Photobooths</h3>
              <p className="text-xl text-gray-600">Premium Event Series</p>
              <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
                Premium enclosed event-series photobooths for weddings, parties & brand activations
              </p>
            </div>

            {/* Vanilla Image Slider */}
            <div className="mb-12">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {[
                    "https://images.unsplash.com/photo-1698235301688-6b5b79dac3d5?crop=entropy&cs=srgb&fm=jpg&q=85",
                    "https://images.unsplash.com/photo-1627580158782-ecd7b8a16326?crop=entropy&cs=srgb&fm=jpg&q=85",
                    "https://images.pexels.com/photos/3271951/pexels-photo-3271951.jpeg",
                    "https://images.unsplash.com/photo-1686853021307-e9e5b01cb85e?crop=entropy&cs=srgb&fm=jpg&q=85",
                    "https://images.pexels.com/photos/28588977/pexels-photo-28588977.jpeg"
                  ].map((img, idx) => (
                    <div key={idx} className="flex-shrink-0 w-full snap-center aspect-video">
                      <img 
                        src={img} 
                        alt={`Vanilla Photobooth ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-center text-gray-600 mt-4 text-sm">← Swipe to see more →</p>
            </div>

            {/* Vanilla Ideal For */}
            <Card className="mb-12 border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <h4 className="font-display text-2xl font-bold text-gray-900 mb-6 text-center">Ideal For</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
                    <Heart className="w-12 h-12 text-pink-600 mx-auto mb-3" />
                    <p className="font-bold text-gray-900">Weddings & Receptions</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
                    <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <p className="font-bold text-gray-900">Birthdays & Private Celebrations</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl">
                    <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="font-bold text-gray-900">Corporate Events & Brand Activations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vanilla Packages */}
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Classic Package */}
              <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-gray-200" data-testid="vanilla-classic-card">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h4 className="font-display text-2xl font-bold text-gray-900 mb-2">Classic Package</h4>
                    <p className="text-gray-600">3 Hours</p>
                    <p className="text-sm text-gray-500 mt-2">Ideal for intimate gatherings and house parties</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-pink-600 mt-0.5" />
                      <span className="text-gray-700">3 hours of booth time</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Camera className="w-5 h-5 text-pink-600 mt-0.5" />
                      <span className="text-gray-700">Unlimited photo sessions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-pink-600 mt-0.5" />
                      <span className="text-gray-700">Instant 2x6" or 4x6" prints</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-pink-600 mt-0.5" />
                      <span className="text-gray-700">On-screen live preview</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-pink-600 mt-0.5" />
                      <span className="text-gray-700">Standard print design with date</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="w-5 h-5 text-pink-600 mt-0.5" />
                      <span className="text-gray-700">On-site booth attendant</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl mb-6 border-2 border-pink-200">
                    <p className="text-center">
                      <span className="text-sm text-gray-600 block mb-1">Starting from</span>
                      <span className="font-bold text-3xl text-pink-700">₹30,000</span>
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => openBookingForm('Vanilla Photobooths', 'Classic Package (3 Hours)', '')} 
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-6 text-lg rounded-full"
                    data-testid="vanilla-classic-book-btn"
                  >
                    Book Classic
                  </Button>
                </CardContent>
              </Card>

              {/* Deluxe Package */}
              <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-4 border-purple-400 shadow-xl scale-105" data-testid="vanilla-deluxe-card">
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 font-bold">
                  MOST POPULAR
                </div>
                <CardContent className="p-8 pt-12">
                  <div className="text-center mb-6">
                    <h4 className="font-display text-2xl font-bold text-gray-900 mb-2">Deluxe Package</h4>
                    <p className="text-gray-600">5 Hours</p>
                    <p className="text-sm text-gray-500 mt-2">Perfect for weddings, receptions & larger parties</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                      <span className="text-gray-700">5 hours of booth time</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Camera className="w-5 h-5 text-purple-600 mt-0.5" />
                      <span className="text-gray-700">Unlimited photo sessions & prints</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                      <span className="text-gray-700"><strong>Custom print design</strong> to match your theme</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                      <span className="text-gray-700">Landscape / portrait options</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                      <span className="text-gray-700"><strong>Instant Digital Downloads</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                      <span className="text-gray-700">On-site booth attendant</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl mb-6 border-2 border-purple-400">
                    <p className="text-center">
                      <span className="text-sm text-gray-600 block mb-1">Starting from</span>
                      <span className="font-bold text-3xl text-purple-700">₹40,000</span>
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => openBookingForm('Vanilla Photobooths', 'Deluxe Package (5 Hours)', '')} 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg rounded-full shadow-lg"
                    data-testid="vanilla-deluxe-book-btn"
                  >
                    Book Deluxe
                  </Button>
                </CardContent>
              </Card>

              {/* Premium Package */}
              <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-gray-200" data-testid="vanilla-premium-card">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h4 className="font-display text-2xl font-bold text-gray-900 mb-2">Premium Package</h4>
                    <p className="text-gray-600">Full Day</p>
                    <p className="text-sm text-gray-500 mt-2">Best for big weddings, sangeets, corporate events</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-gray-700"><strong>24 hours</strong> of booth time</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-gray-700"><strong>Complete custom booth wrapping</strong> tailored to your theme</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-gray-700">Premium props set (themed props)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-gray-700">Branded digital overlay for sharing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-gray-700">Priority setup time & extended support</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Camera className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-gray-700 text-sm">Everything in Deluxe, plus premium features</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6 border-2 border-blue-200">
                    <p className="text-center">
                      <span className="text-sm text-gray-600 block mb-1">Starting from</span>
                      <span className="font-bold text-3xl text-blue-700">₹60,000</span>
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => openBookingForm('Vanilla Photobooths', 'Premium Package (Full Day)', '')} 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg rounded-full"
                    data-testid="vanilla-premium-book-btn"
                  >
                    Book Premium
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-6 bg-white" data-testid="gallery-section">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-7xl font-bold text-gray-900 mb-4">
              Gallery
            </h2>
            <p className="text-xl text-gray-600 font-light">Moments captured, memories created</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://customer-assets.emergentagent.com/job_forever-photos-4/artifacts/sj2xxxst_IMG_2543%202.jpg",
              "https://customer-assets.emergentagent.com/job_forever-photos-4/artifacts/g6ez0wmu_IMG_2544%202.jpg",
              "https://customer-assets.emergentagent.com/job_forever-photos-4/artifacts/cue8wou9_IMG_2553%202.jpg",
              "https://customer-assets.emergentagent.com/job_forever-photos-4/artifacts/k1gromee_IMG_2554%202.jpg"
            ].map((img, idx) => (
              <div key={idx} className="aspect-square overflow-hidden rounded-2xl group cursor-pointer" data-testid={`gallery-img-${idx}`}>
                <img 
                  src={img} 
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Activations */}
      <section id="activations" className="py-24 px-6 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100" data-testid="activations-section">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Brand Activations
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Elevate your brand presence with our custom photobooth experiences. Perfect for product launches, corporate events, marketing campaigns, and experiential brand activations.
            </p>
          </div>

          <div className="mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                <Award className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Custom Branding</h3>
                <p className="text-gray-700">Complete booth wrapping with your brand colors, logos, and messaging</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                <Sparkles className="w-10 h-10 text-pink-600 mb-3" />
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Digital Integration</h3>
                <p className="text-gray-700">Branded digital overlays, instant social sharing, and QR code galleries</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                <Users className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Event Support</h3>
                <p className="text-gray-700">Dedicated team for setup, operation, and real-time support throughout your event</p>
              </div>
            </div>
          </div>

          {/* Our Brand Activation Clients */}
          <div className="mb-16">
            <h3 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">Our Brand Activation Clients</h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((idx) => (
                  <div key={idx} className="text-center" data-testid={`client-${idx}`}>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 h-24 flex items-center justify-center hover:shadow-lg transition-shadow">
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Activation Testimonials */}
          <div className="mb-12">
            <h3 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">What Brands Say</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-none shadow-lg" data-testid="brand-testimonial-1">
                <CardContent className="p-6">
                  <div className="text-purple-600 text-3xl mb-3">"</div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The photobooth at our product launch was a huge hit! Custom branding was spot-on, and guests loved sharing photos instantly on social media.
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-gray-900">Priya Mehta</p>
                    <p className="text-sm text-gray-600">Marketing Head, Tech Startup</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-none shadow-lg" data-testid="brand-testimonial-2">
                <CardContent className="p-6">
                  <div className="text-pink-600 text-3xl mb-3">"</div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Professional team and seamless execution. Our corporate event engagement tripled with the photobooth activation. Highly recommend for brand events!
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-gray-900">Rajesh Kumar</p>
                    <p className="text-sm text-gray-600">Event Manager, Fortune 500 Company</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-none shadow-lg" data-testid="brand-testimonial-3">
                <CardContent className="p-6">
                  <div className="text-blue-600 text-3xl mb-3">"</div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    From custom booth wrapping to digital galleries, everything was perfect. Best ROI we've had for any experiential marketing campaign.
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-gray-900">Ananya Sharma</p>
                    <p className="text-sm text-gray-600">Brand Director, Fashion Label</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => scrollToSection('contact')} 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-7 text-lg rounded-full shadow-xl"
              data-testid="activations-contact-btn"
            >
              Discuss Your Brand Activation
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-white" data-testid="contact-section">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-7xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 font-light">Let's create something memorable together</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-display text-3xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Our Locations</p>
                    <p className="text-gray-600">Brownie: BSR Mall, Thuraipakkam</p>
                    <p className="text-gray-600">Butterscotch: Grand Square Mall, Velachery</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Phone</p>
                    <p className="text-gray-600">+91 7550154640</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Email</p>
                    <p className="text-gray-600">admin@memorabooth.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl">
                <h4 className="font-display text-2xl font-bold text-gray-900 mb-4">Connect With Us</h4>
                <div className="flex gap-4">
                  <a href="https://instagram.com/memoraboothchennai" target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-full hover:scale-110 transition-transform shadow-md">
                    <Instagram className="w-6 h-6 text-pink-600" />
                  </a>
                  <a href="mailto:admin@memorabooth.com" className="bg-white p-4 rounded-full hover:scale-110 transition-transform shadow-md">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <Card className="border-none shadow-xl">
                <CardContent className="p-8">
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="contact-name">Name *</Label>
                      <Input 
                        id="contact-name"
                        required
                        value={contactData.name}
                        onChange={(e) => setContactData({...contactData, name: e.target.value})}
                        className="mt-2"
                        data-testid="contact-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email *</Label>
                      <Input 
                        id="contact-email"
                        type="email"
                        required
                        value={contactData.email}
                        onChange={(e) => setContactData({...contactData, email: e.target.value})}
                        className="mt-2"
                        data-testid="contact-email-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Phone</Label>
                      <Input 
                        id="contact-phone"
                        type="tel"
                        value={contactData.phone}
                        onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                        className="mt-2"
                        data-testid="contact-phone-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-message">Message *</Label>
                      <Textarea 
                        id="contact-message"
                        required
                        value={contactData.message}
                        onChange={(e) => setContactData({...contactData, message: e.target.value})}
                        className="mt-2 min-h-[120px]"
                        data-testid="contact-message-input"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-6 text-lg rounded-full"
                      data-testid="contact-submit-btn"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6" data-testid="footer">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="font-futura text-2xl font-bold mb-4 tracking-wide">MEMORABOOTH</h3>
              <p className="text-gray-400">Creating unforgettable memories across Chennai</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Mall Booths</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Brownie (BSR Mall)</li>
                <li>Butterscotch (Grand Square)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Event Booths</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Vanilla Classic</li>
                <li>Vanilla Deluxe</li>
                <li>Vanilla Premium</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white">About</button></li>
                <li><button onClick={() => scrollToSection('gallery')} className="hover:text-white">Gallery</button></li>
                <li><button onClick={() => scrollToSection('activations')} className="hover:text-white">Brand Activations</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white">Contact</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <button onClick={() => setShowPrivacyPolicy(true)} className="text-gray-400 hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => setShowTerms(true)} className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</button>
              <button onClick={() => setShowRefundPolicy(true)} className="text-gray-400 hover:text-white transition-colors">Refund Policy</button>
            </div>
            <p className="text-center text-gray-500">© 2024 Memorabooth. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-testid="booking-modal">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-display text-3xl font-bold text-gray-900">Book Your Photobooth</h2>
                  {selectedBooth && (
                    <p className="text-gray-600 mt-1">{selectedBooth}</p>
                  )}
                </div>
                <button 
                  onClick={() => setShowBookingForm(false)} 
                  className="text-gray-500 hover:text-gray-900 text-3xl leading-none"
                  data-testid="close-modal-btn"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name"
                    required
                    value={bookingData.name}
                    onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                    className="mt-2"
                    data-testid="booking-name-input"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email"
                      type="email"
                      required
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      className="mt-2"
                      data-testid="booking-email-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone"
                      type="tel"
                      required
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      className="mt-2"
                      data-testid="booking-phone-input"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event_type">Event Type *</Label>
                    <Input 
                      id="event_type"
                      placeholder="e.g., Wedding, Birthday, Corporate"
                      required
                      value={bookingData.event_type}
                      onChange={(e) => setBookingData({...bookingData, event_type: e.target.value})}
                      className="mt-2"
                      data-testid="booking-event-type-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="event_date">Event Date *</Label>
                    <Input 
                      id="event_date"
                      type="date"
                      required
                      value={bookingData.event_date}
                      onChange={(e) => setBookingData({...bookingData, event_date: e.target.value})}
                      className="mt-2"
                      data-testid="booking-date-input"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">Additional Details</Label>
                  <Textarea 
                    id="message"
                    placeholder="Tell us more about your event or special requirements..."
                    value={bookingData.message}
                    onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
                    className="mt-2 min-h-[100px]"
                    data-testid="booking-message-input"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-6 text-lg rounded-full"
                    data-testid="submit-booking-btn"
                  >
                    Submit Booking Inquiry
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowBookingForm(false)}
                    className="px-8 py-6 rounded-full"
                    data-testid="cancel-booking-btn"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-testid="privacy-modal">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-3xl font-bold text-gray-900">Privacy Policy</h2>
                <button onClick={() => setShowPrivacyPolicy(false)} className="text-gray-500 hover:text-gray-900 text-3xl leading-none">×</button>
              </div>
              
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Complete Security for Users</h3>
                  <p>At Memora Photobooth, we prioritize your privacy and data security above all else. We are committed to providing a completely secure experience for all our users.</p>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">No Data Storage Policy</h3>
                  <p className="mb-2">We do not store any personal data on our systems. This includes:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Photos taken during your event</li>
                    <li>Personal information shared during booking</li>
                    <li>Contact details beyond what's necessary for service delivery</li>
                    <li>Payment information (processed securely through third-party providers)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Photo Privacy</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>All photos are printed instantly and given directly to you</li>
                    <li>No digital copies are retained on our equipment</li>
                    <li>Photos are not uploaded to any cloud services or online platforms</li>
                    <li>You have full ownership and control of all images taken</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Information Collection</h3>
                  <p className="mb-2">We only collect minimal information necessary to provide our services:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Contact information for booking confirmation</li>
                    <li>Event details for service delivery</li>
                    <li>Payment information (processed securely and not stored)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Data Security</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>All equipment is reset after each event</li>
                    <li>No permanent storage devices retain any customer data</li>
                    <li>Communication is handled through secure channels</li>
                    <li>We follow industry best practices for data protection</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Third-Party Services</h3>
                  <p>We may use third-party payment processors for transactions. These services have their own privacy policies and security measures. We do not share any additional personal information with third parties.</p>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Contact</h3>
                  <p>If you have any questions about our privacy practices, please contact us at admin@memorabooth.com or +91 7550154640.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-testid="terms-modal">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-3xl font-bold text-gray-900">Terms and Conditions</h2>
                <button onClick={() => setShowTerms(false)} className="text-gray-500 hover:text-gray-900 text-3xl leading-none">×</button>
              </div>
              
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">1. Service Agreement</h3>
                  <p>By booking Memora Photobooth services, you agree to these terms and conditions. Our photobooth rental service provides high-quality photo experiences for events, parties, and business use.</p>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">2. Booking and Payment</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Bookings are confirmed upon receipt of payment</li>
                    <li>Payment can be made via cash, UPI, or bank transfer</li>
                    <li>Pricing is as displayed on our website and may vary based on location and event requirements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">3. Client Responsibilities</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Provide adequate space and power supply for photobooth setup</li>
                    <li>Ensure safe handling of equipment by guests</li>
                    <li>Notify us of any special requirements or venue restrictions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">4. Liability</h3>
                  <p>Memora Photobooth is not liable for any damages to personal property or injuries during the event. Clients are responsible for guest behavior around equipment.</p>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">5. Equipment</h3>
                  <p>All equipment remains the property of Memora Photobooth. Any damage to equipment will be charged to the client at replacement cost.</p>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">6. Force Majeure</h3>
                  <p>We are not liable for delays or cancellations due to circumstances beyond our control, including weather, natural disasters, or government restrictions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Refund Policy Modal */}
      {showRefundPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-testid="refund-modal">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-3xl font-bold text-gray-900">Refunds & Cancellations</h2>
                <button onClick={() => setShowRefundPolicy(false)} className="text-gray-500 hover:text-gray-900 text-3xl leading-none">×</button>
              </div>
              
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Cancellation Policy</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>42 hours before event:</strong> Full refund processed the same day</li>
                    <li><strong>24 hours before event:</strong> 50% refund processed the same day</li>
                    <li><strong>Less than 24 hours:</strong> 25% refund</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Refund Process</h3>
                  <p className="mb-2">Our streamlined refund process ensures quick processing:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Contact us via phone (+91 7550154640) or email (admin@memorabooth.com)</li>
                    <li>Provide your payment reference and reason</li>
                    <li>Refund is processed immediately during business hours</li>
                    <li>Money is returned via the same payment method used for booking</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Service Issues</h3>
                  <p className="mb-2">If we're unable to provide the service as promised:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Full refund is processed</li>
                    <li>Immediate processing of refund</li>
                    <li>Priority booking for future events</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Refund Timeline</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>UPI/Digital Payments:</strong> Instant to 2 hours</li>
                    <li><strong>Bank Transfer:</strong> Same day (within business hours)</li>
                    <li><strong>Cash Payments:</strong> Immediate cash refund</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Contact for Cancellations</h3>
                  <p className="mb-2">For all cancellation requests:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Phone: +91 7550154640 (fastest response)</li>
                    <li>Email: admin@memorabooth.com</li>
                    <li>Business Hours: 9 AM - 7 PM (7 days a week)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default App;