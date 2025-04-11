// src/data/seedData.js

// Pickup Partners Seed Data
const partnersSeed = [
    {
      name: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul.sharma@example.com",
      address: "123 Main Street, Mumbai, MH",
      status: "active",
      paymentType: "fixed",
      paymentAmount: 200,
      totalOrders: 45,
      completedOrders: 42,
      pendingOrders: 3,
      location: {
        lat: 19.0760,
        lng: 72.8777
      }
    },
    {
      name: "Priya Patel",
      phone: "8765432109",
      email: "priya.patel@example.com",
      address: "456 Park Avenue, Delhi, DL",
      status: "active",
      paymentType: "commission",
      paymentAmount: 15,
      totalOrders: 62,
      completedOrders: 59,
      pendingOrders: 3,
      location: {
        lat: 28.7041,
        lng: 77.1025
      }
    },
    {
      name: "Amit Kumar",
      phone: "7654321098",
      email: "amit.kumar@example.com",
      address: "789 Lake View, Bangalore, KA",
      status: "inactive",
      paymentType: "fixed",
      paymentAmount: 150,
      totalOrders: 28,
      completedOrders: 25,
      pendingOrders: 3,
      location: {
        lat: 12.9716,
        lng: 77.5946
      }
    },
    {
      name: "Sneha Gupta",
      phone: "6543210987",
      email: "sneha.gupta@example.com",
      address: "101 Hill Road, Chennai, TN",
      status: "active",
      paymentType: "commission",
      paymentAmount: 20,
      totalOrders: 37,
      completedOrders: 35,
      pendingOrders: 2,
      location: {
        lat: 13.0827,
        lng: 80.2707
      }
    },
    {
      name: "Vikram Singh",
      phone: "5432109876",
      email: "vikram.singh@example.com",
      address: "202 River View, Kolkata, WB",
      status: "active",
      paymentType: "fixed",
      paymentAmount: 180,
      totalOrders: 51,
      completedOrders: 48,
      pendingOrders: 3,
      location: {
        lat: 22.5726,
        lng: 88.3639
      }
    }
  ];
  
  module.exports = {
    partnersSeed
  };