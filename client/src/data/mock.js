
export const initialAlerts = [
  {
    id: 1,
    title: "Critical Flood Alert",
    location: "Riverside Area",
    message: "Water levels are rising rapidly. Move to safer locations.",
    severity: "Critical",
    time: "5 min ago"
  },
  {
    id: 2,
    title: "Heavy Rainfall Warning",
    location: "East Zone",
    message: "Heavy rainfall expected in the next few hours.",
    severity: "Warning",
    time: "15 min ago"
  },
  {
    id: 3,
    title: "Weather Advisory",
    location: "North Zone",
    message: "Avoid travelling through low-lying roads.",
    severity: "Advisory",
    time: "1 hour ago"
  }
];

export const initialCenters = [
  {
    id: 1,
    name: "Central School Shelter",
    location: "Central Area",
    capacity: 500,
    available: 180,
    lat: 12.9716,
    lng: 77.5946,
    status: "Open"
  },
  {
    id: 2,
    name: "Community Relief Center",
    location: "East Zone",
    capacity: 300,
    available: 90,
    lat: 12.9816,
    lng: 77.6146,
    status: "Open"
  },
  {
    id: 3,
    name: "Government School Shelter",
    location: "North Zone",
    capacity: 250,
    available: 0,
    lat: 13.0216,
    lng: 77.5846,
    status: "Full"
  }
];

export const initialReports = [
  {
    id: 101,
    title: "Water entering residential area",
    location: "Riverside Area",
    description: "Flood water has entered nearby houses.",
    severity: "Critical",
    status: "Pending",
    image: "",
    requestTeam: true,
    lat: 12.9616,
    lng: 77.6046,
    date: "Today"
  },
  {
    id: 102,
    title: "Road completely flooded",
    location: "East Zone",
    description: "Vehicles cannot pass through this road.",
    severity: "High",
    status: "In Progress",
    image: "",
    requestTeam: true,
    lat: 12.9916,
    lng: 77.6246,
    date: "Today"
  }
];

export const initialTasks = [
  {
    id: 201,
    title: "Distribute Food Packets",
    location: "Riverside Area",
    description: "Distribute food packets to 30 affected families.",
    priority: "High",
    status: "Assigned",
    proof: "",
    date: "Today"
  },
  {
    id: 202,
    title: "Supply Drinking Water",
    location: "East Zone",
    description: "Deliver drinking water to affected residents.",
    priority: "Medium",
    status: "Accepted",
    proof: "",
    date: "Today"
  },
  {
    id: 203,
    title: "Assist Elderly Residents",
    location: "Central Area",
    description: "Help elderly residents reach the relief shelter.",
    priority: "High",
    status: "Assigned",
    proof: "",
    date: "Today"
  }
];
