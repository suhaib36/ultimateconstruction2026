export type ProjectCategory = 
  | 'Kitchen & Bath Remodeling'
  | 'Room Additions'
  | 'ADUs & Garage Conversions'
  | 'Casitas & Guest Houses'
  | 'Patio Covers'
  | 'Concrete Patios & Driveways'
  | 'Walkways & Hardscape'
  | 'Retaining & Garden Walls'
  | 'Architectural Design'
  | 'Commercial Construction';

export type ProjectStatus = 'Planning' | 'In Progress' | 'Inspection' | 'On Hold' | 'Completed';

export type LeadStatus = 
  | 'New'
  | 'Contacted'
  | 'Site Visit Scheduled'
  | 'Estimate in Progress'
  | 'Estimate Sent'
  | 'Converted'
  | 'Lost';

export type ChangeOrderStatus = 'Draft' | 'Sent for Approval' | 'Approved' | 'Rejected';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type DocumentCategory = 
  | 'Contracts'
  | 'Estimates'
  | 'Permits'
  | 'Architectural Plans'
  | 'Inspection Reports'
  | 'Invoices'
  | 'Other Documents';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  phone: string;
  email: string;
  assignedProjectIds: string[];
  availability: 'Active on Site' | 'Available' | 'In Transit' | 'On Leave';
  tradeSpecialty: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  assignedTo: string; // TeamMember ID or name
  dueDate: string;
  priority: Priority;
  completed: boolean;
  category?: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  notes?: string;
}

export interface DailyUpdate {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  authorName: string;
  authorRole: string;
  workCompleted: string;
  workPlannedTomorrow: string;
  issuesOrDelays?: string;
  materialsRequired?: string;
  weather: {
    temp: string;
    condition: string;
  };
  photos: {
    url: string;
    caption: string;
  }[];
  additionalNotes?: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  category: DocumentCategory;
  uploadDate: string;
  uploadedBy: string;
  fileSize: string;
  fileType: string;
  downloadUrl?: string;
  notes?: string;
}

export interface ChangeOrder {
  id: string;
  orderNumber: string;
  projectId: string;
  projectName: string;
  clientName: string;
  title: string;
  description: string;
  reason: 'Client Request' | 'Unforeseen Site Condition' | 'City / Code Requirement' | 'Architectural Modification';
  laborCost: number;
  materialCost: number;
  subcontractorCost: number;
  otherCost: number;
  totalCost: number;
  originalProjectTotal: number;
  revisedProjectTotal: number;
  status: ChangeOrderStatus;
  requestedDate: string;
  approvedDate?: string;
  notes?: string;
  clientSignature?: string;
}

export interface EstimateLineItem {
  id: string;
  category: 'Labor' | 'Material' | 'Equipment / Sub' | 'Permits & Fees';
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  total: number;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  leadId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectAddress: string;
  projectType: ProjectCategory;
  scopeOfWork: string;
  items: EstimateLineItem[];
  subtotal: number;
  contingencyPercent: number;
  contingencyAmount: number;
  totalEstimatedCost: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Declined';
  createdAt: string;
  validUntil: string;
  notes: string;
}

export interface Lead {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  projectType: ProjectCategory;
  location: string;
  inquiryDate: string;
  status: LeadStatus;
  budgetRange: string;
  notes: {
    id: string;
    text: string;
    date: string;
    author: string;
  }[];
  scheduledVisit?: {
    date: string;
    time: string;
    notes: string;
  };
  estimateId?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  activeProjectIds: string[];
  completedProjectIds: string[];
  totalSpent: number;
  lastCommunication: string;
  portalAccessCode: string;
  notes?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  type: 'Site Visit' | 'Inspection' | 'Milestone' | 'Team Assignment' | 'Material Delivery';
  date: string; // YYYY-MM-DD
  time: string;
  assignedTo?: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Pending Confirmation';
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  category: ProjectCategory;
  location: string; // e.g. "Riverside, CA"
  address: string;
  assignedTeamIds: string[];
  startDate: string;
  targetCompletion: string;
  budget: number;
  amountSpent: number;
  progress: number; // 0-100
  status: ProjectStatus;
  description: string;
  squareFootage?: number;
  permitNumber?: string;
  coverImage: string;
  milestones: ProjectMilestone[];
  tasks: ProjectTask[];
}

export interface CommunicationMessage {
  id: string;
  projectId: string;
  sender: 'Nancy Paramo' | 'Homeowner' | 'Site Foreman';
  senderRole: string;
  timestamp: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'change_order' | 'estimate' | 'site_update' | 'milestone' | 'task';
  read: boolean;
  linkTab?: string;
  projectId?: string;
}
