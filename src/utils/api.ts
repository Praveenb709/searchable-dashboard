
// Simulated API calls for demonstration
// In a real application, these would be actual API calls to your backend

import { toast } from "sonner";

// Type definitions
export type District = {
  id: string;
  name: string;
};

export type Mandal = {
  id: string;
  name: string;
  districtId: string;
};

export type SearchField = 
  | "village" 
  | "doorNumber" 
  | "streetName" 
  | "customerName" 
  | "fatherName" 
  | "nomineeName" 
  | "mobile" 
  | "localAddress" 
  | "dob";

export type SearchParams = {
  district?: string;
  mandal?: string;
  searchField?: SearchField;
  searchTerm?: string;
  page: number;
  pageSize: number;
};

export type DataItem = {
  id: string;
  village: string;
  doorNumber: string;
  streetName: string;
  customerName: string;
  fatherName: string;
  nomineeName: string;
  mobile: string;
  localAddress: string;
  dob: string;
  district: string;
  mandal: string;
};

export type SearchResults = {
  data: DataItem[];
  total: number;
};

// Mock data for demonstration
const mockDistricts: District[] = [
  { id: "d1", name: "Hyderabad" },
  { id: "d2", name: "Rangareddy" },
  { id: "d3", name: "Medchal" },
  { id: "d4", name: "Visakhapatnam" },
  { id: "d5", name: "Vijayawada" },
];

const mockMandals: Mandal[] = [
  { id: "m1", name: "Secunderabad", districtId: "d1" },
  { id: "m2", name: "Khairatabad", districtId: "d1" },
  { id: "m3", name: "L.B. Nagar", districtId: "d1" },
  { id: "m4", name: "Kukatpally", districtId: "d2" },
  { id: "m5", name: "Gachibowli", districtId: "d2" },
  { id: "m6", name: "Quthbullapur", districtId: "d3" },
  { id: "m7", name: "Medchal", districtId: "d3" },
  { id: "m8", name: "Bheemunipatnam", districtId: "d4" },
  { id: "m9", name: "Anandapuram", districtId: "d4" },
  { id: "m10", name: "Vijayawada Central", districtId: "d5" },
  { id: "m11", name: "Vijayawada East", districtId: "d5" },
];

// Generate 100 mock data items for our search results
const generateMockData = (): DataItem[] => {
  const data: DataItem[] = [];
  const villages = ["Gachibowli", "Madhapur", "Kondapur", "Kukatpally", "Miyapur", "Hitech City", "Jubilee Hills"];
  const streets = ["Main Road", "Temple Street", "Gandhi Road", "Nehru Street", "Market Road", "Circle Street"];
  const firstNames = ["Raj", "Priya", "Amit", "Neha", "Suresh", "Rani", "Kiran", "Ananya", "Vikram", "Meena"];
  const lastNames = ["Kumar", "Sharma", "Reddy", "Patel", "Singh", "Rao", "Gupta", "Verma", "Joshi", "Das"];

  for (let i = 1; i <= 100; i++) {
    const districtIdx = Math.floor(Math.random() * mockDistricts.length);
    const district = mockDistricts[districtIdx];
    
    const filteredMandals = mockMandals.filter(m => m.districtId === district.id);
    const mandalIdx = Math.floor(Math.random() * filteredMandals.length);
    const mandal = filteredMandals[mandalIdx];
    
    const villageName = villages[Math.floor(Math.random() * villages.length)];
    const streetName = streets[Math.floor(Math.random() * streets.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    const doorNumber = `${Math.floor(Math.random() * 999) + 1}`;
    const mobile = `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
    
    // Generate a random date between 1950 and 2000
    const year = 1950 + Math.floor(Math.random() * 50);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const dob = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    
    data.push({
      id: `id-${i}`,
      village: villageName,
      doorNumber: doorNumber,
      streetName: streetName,
      customerName: `${firstName} ${lastName}`,
      fatherName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastName}`,
      nomineeName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      mobile: mobile,
      localAddress: `${doorNumber}, ${streetName}, ${villageName}`,
      dob: dob,
      district: district.name,
      mandal: mandal.name,
    });
  }
  
  return data;
};

const mockData = generateMockData();

// Simulated API delay to show loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const fetchDistricts = async (): Promise<District[]> => {
  try {
    // Simulate API call
    await delay(800);
    return mockDistricts;
  } catch (error) {
    toast.error("Failed to fetch districts");
    console.error("Error fetching districts:", error);
    throw error;
  }
};

export const fetchMandals = async (districtId?: string): Promise<Mandal[]> => {
  try {
    // Simulate API call
    await delay(800);
    
    if (!districtId) {
      return mockMandals;
    }
    
    return mockMandals.filter(mandal => mandal.districtId === districtId);
  } catch (error) {
    toast.error("Failed to fetch mandals");
    console.error("Error fetching mandals:", error);
    throw error;
  }
};

export const searchData = async (params: SearchParams): Promise<SearchResults> => {
  try {
    // Simulate API call
    await delay(1200);
    
    let filteredData = [...mockData];
    
    // Filter by district if specified
    if (params.district) {
      filteredData = filteredData.filter(item => 
        item.district === mockDistricts.find(d => d.id === params.district)?.name
      );
    }
    
    // Filter by mandal if specified
    if (params.mandal) {
      filteredData = filteredData.filter(item => 
        item.mandal === mockMandals.find(m => m.id === params.mandal)?.name
      );
    }
    
    // Filter by search term if specified
    if (params.searchField && params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      
      filteredData = filteredData.filter(item => {
        switch(params.searchField) {
          case "village":
            return item.village.toLowerCase().includes(term);
          case "doorNumber":
            return item.doorNumber.toLowerCase().includes(term);
          case "streetName":
            return item.streetName.toLowerCase().includes(term);
          case "customerName":
            return item.customerName.toLowerCase().includes(term);
          case "fatherName":
            return item.fatherName.toLowerCase().includes(term);
          case "nomineeName":
            return item.nomineeName.toLowerCase().includes(term);
          case "mobile":
            return item.mobile.toLowerCase().includes(term);
          case "localAddress":
            return item.localAddress.toLowerCase().includes(term);
          case "dob":
            return item.dob.toLowerCase().includes(term);
          default:
            return false;
        }
      });
    }
    
    // Calculate pagination
    const total = filteredData.length;
    const startIndex = (params.page - 1) * params.pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + params.pageSize);
    
    return {
      data: paginatedData,
      total: total
    };
  } catch (error) {
    toast.error("Search failed");
    console.error("Error during search:", error);
    throw error;
  }
};

// Get available search fields
export const getSearchFields = (): { label: string; value: SearchField }[] => {
  return [
    { label: "Village", value: "village" },
    { label: "Door Number", value: "doorNumber" },
    { label: "Street Name", value: "streetName" },
    { label: "Customer Name", value: "customerName" },
    { label: "Father Name", value: "fatherName" },
    { label: "Nominee Name", value: "nomineeName" },
    { label: "Mobile", value: "mobile" },
    { label: "Local Address", value: "localAddress" },
    { label: "Date of Birth", value: "dob" },
  ];
};
