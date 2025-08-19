const sampleProperties = [
    {
        title: "Harmony Luxury Villa",
        description: "Beautiful modern apartment in the heart of downtown",
        price: 250000,
        location: "New York, NY",
        bedrooms: 2,
        bathrooms: 2,
        images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
        isFeatured: true
    },
    {
        title: "Luxury Beach Villa",
        description: "Stunning beachfront villa with ocean views",
        price: 1200000,
        location: "Miami, FL",
        bedrooms: 4,
        bathrooms: 3,
        images: ["https://example.com/beach1.jpg"],
        isFeatured: true
    },
    {
        title: "Lekki Luxury Apartment",
        description: "Modern 3-bedroom apartment with stunning city views in Lekki Phase 1",
        price: 85000000,
        location: "Lekki, Lagos",
        bedrooms: 3,
        bathrooms: 3,
        images: ["https://example.com/lekki1.jpg"],
        isFeatured: true
    },
    {
        title: "Victoria Island Penthouse",
        description: "Exclusive penthouse with panoramic ocean views and premium amenities",
        price: 250000000,
        location: "Victoria Island, Lagos",
        bedrooms: 4,
        bathrooms: 4,
        images: ["https://example.com/vi1.jpg"],
        isFeatured: true
    },
    {
        title: "Abuja Diplomatic Residence",
        description: "Spacious diplomatic residence in Maitama with lush gardens and security",
        price: 180000000,
        location: "Maitama, Abuja",
        bedrooms: 5,
        bathrooms: 4,
        images: ["https://example.com/abuja1.jpg"],
        isFeatured: false
    },
    {
        title: "Ikeja Commercial Plaza",
        description: "Prime commercial property suitable for offices and retail businesses",
        price: 320000000,
        location: "Ikeja, Lagos",
        bedrooms: 0,
        bathrooms: 6,
        images: ["https://example.com/ikeja1.jpg"],
        isFeatured: true
    },
    {
        title: "Port Harcourt Waterfront Estate",
        description: "Beautiful waterfront property with boat access and modern facilities",
        price: 95000000,
        location: "Port Harcourt, Rivers",
        bedrooms: 3,
        bathrooms: 2,
        images: ["https://example.com/ph1.jpg"],
        isFeatured: false
    },
    {
        title: "Asokoro Luxury Villa",
        description: "Premium villa in Asokoro with swimming pool and 24/7 security",
        price: 300000000,
        location: "Asokoro, Abuja",
        bedrooms: 6,
        bathrooms: 5,
        images: ["https://example.com/asokoro1.jpg"],
        isFeatured: true
    },
    {
        title: "Surulere Family Home",
        description: "Cozy family home in peaceful Surulere neighborhood",
        price: 45000000,
        location: "Surulere, Lagos",
        bedrooms: 3,
        bathrooms: 2,
        images: ["https://example.com/surulere1.jpg"],
        isFeatured: false
    },
    {
        title: "Kano Traditional Compound",
        description: "Traditional family compound with multiple units and courtyard",
        price: 65000000,
        location: "Kano City, Kano",
        bedrooms: 4,
        bathrooms: 3,
        images: ["https://example.com/kano1.jpg"],
        isFeatured: false
    },
    {
        title: "Banana Island Mansion",
        description: "Ultra-luxury mansion on exclusive Banana Island with private jetty",
        price: 850000000,
        location: "Banana Island, Lagos",
        bedrooms: 8,
        bathrooms: 7,
        images: ["https://example.com/banana1.jpg"],
        isFeatured: true
    },
    {
        title: "GRA Ibadan Bungalow",
        description: "Charming colonial-style bungalow in Government Reserved Area",
        price: 55000000,
        location: "Ibadan, Oyo",
        bedrooms: 3,
        bathrooms: 2,
        images: ["https://example.com/ibadan1.jpg"],
        isFeatured: false
    },
    {
        title: "Wuse 2 Commercial Complex",
        description: "Modern commercial complex in prime Wuse 2 location",
        price: 420000000,
        location: "Wuse 2, Abuja",
        bedrooms: 0,
        bathrooms: 8,
        images: ["https://example.com/wuse1.jpg"],
        isFeatured: true
    },
    {
        title: "Calabar Resort Property",
        description: "Beautiful resort-style property near Tinapa with tourist potential",
        price: 120000000,
        location: "Calabar, Cross River",
        bedrooms: 4,
        bathrooms: 3,
        images: ["https://example.com/calabar1.jpg"],
        isFeatured: false
    }
];

const propertyDatabase = async () => {
    try {
        await PROPERTY.deleteMany({});
        await PROPERTY.insertMany(sampleProperties);
        console.log("Sample properties added successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};