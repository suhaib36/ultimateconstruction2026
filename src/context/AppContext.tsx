import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  Lead, 
  Estimate, 
  TeamMember, 
  DailyUpdate, 
  DocumentItem, 
  ChangeOrder, 
  Client, 
  ScheduleEvent,
  CommunicationMessage,
  NotificationItem,
  ProjectTask,
  ProjectMilestone
} from '../types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_LEADS, 
  INITIAL_ESTIMATES, 
  INITIAL_TEAM, 
  INITIAL_DAILY_UPDATES, 
  INITIAL_DOCUMENTS, 
  INITIAL_CHANGE_ORDERS, 
  INITIAL_CLIENTS, 
  INITIAL_SCHEDULE_EVENTS, 
  INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

export type NavigationTab = 
  | 'dashboard'
  | 'leads'
  | 'projects'
  | 'schedule'
  | 'updates'
  | 'team'
  | 'documents'
  | 'changeorders'
  | 'clients'
  | 'settings';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & View
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  isHomeownerPortal: boolean;
  setIsHomeownerPortal: (active: boolean) => void;
  activeHomeownerProjectId: string;
  setActiveHomeownerProjectId: (id: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data
  projects: Project[];
  leads: Lead[];
  estimates: Estimate[];
  team: TeamMember[];
  dailyUpdates: DailyUpdate[];
  documents: DocumentItem[];
  changeOrders: ChangeOrder[];
  clients: Client[];
  scheduleEvents: ScheduleEvent[];
  messages: CommunicationMessage[];
  notifications: NotificationItem[];
  toasts: ToastMessage[];

  // Toast actions
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Project Actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  addTask: (projectId: string, task: Omit<ProjectTask, 'id' | 'projectId'>) => void;
  updateMilestoneStatus: (projectId: string, milestoneId: string, status: 'Completed' | 'In Progress' | 'Upcoming') => void;

  // Lead Actions
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (lead: Lead) => void;
  addLeadNote: (leadId: string, text: string) => void;
  scheduleLeadVisit: (leadId: string, date: string, time: string, notes: string) => void;
  convertLeadToProject: (leadId: string) => void;

  // Estimate Actions
  addEstimate: (estimate: Omit<Estimate, 'id'>) => void;
  updateEstimateStatus: (estimateId: string, status: 'Draft' | 'Sent' | 'Approved' | 'Declined') => void;

  // Daily Update Actions
  addDailyUpdate: (update: Omit<DailyUpdate, 'id' | 'createdAt'>) => void;

  // Schedule Actions
  addScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  updateScheduleEvent: (event: ScheduleEvent) => void;
  deleteScheduleEvent: (id: string) => void;

  // Team Actions
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (member: TeamMember) => void;

  // Document Actions
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  deleteDocument: (id: string) => void;

  // Change Order Actions
  addChangeOrder: (changeOrder: Omit<ChangeOrder, 'id'>) => void;
  updateChangeOrderStatus: (id: string, status: ChangeOrder['status'], signature?: string) => void;

  // Client Actions
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;

  // Communication Actions
  sendMessage: (projectId: string, content: string, sender: 'Nancy Paramo' | 'Homeowner' | 'Site Foreman') => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isHomeownerPortal, setIsHomeownerPortal] = useState<boolean>(false);
  const [activeHomeownerProjectId, setActiveHomeownerProjectId] = useState<string>('proj-2');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Domain State with LocalStorage cache fallback
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('uc_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('uc_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [estimates, setEstimates] = useState<Estimate[]>(() => {
    const saved = localStorage.getItem('uc_estimates');
    return saved ? JSON.parse(saved) : INITIAL_ESTIMATES;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('uc_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [dailyUpdates, setDailyUpdates] = useState<DailyUpdate[]>(() => {
    const saved = localStorage.getItem('uc_updates');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_UPDATES;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('uc_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(() => {
    const saved = localStorage.getItem('uc_changeorders');
    return saved ? JSON.parse(saved) : INITIAL_CHANGE_ORDERS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('uc_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('uc_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_EVENTS;
  });

  const [messages, setMessages] = useState<CommunicationMessage[]>(() => {
    const saved = localStorage.getItem('uc_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('uc_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize to LocalStorage
  useEffect(() => {
    localStorage.setItem('uc_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('uc_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('uc_estimates', JSON.stringify(estimates));
  }, [estimates]);

  useEffect(() => {
    localStorage.setItem('uc_changeorders', JSON.stringify(changeOrders));
  }, [changeOrders]);

  useEffect(() => {
    localStorage.setItem('uc_updates', JSON.stringify(dailyUpdates));
  }, [dailyUpdates]);

  useEffect(() => {
    localStorage.setItem('uc_schedule', JSON.stringify(scheduleEvents));
  }, [scheduleEvents]);

  useEffect(() => {
    localStorage.setItem('uc_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('uc_messages', JSON.stringify(messages));
  }, [messages]);

  // Toast handler
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts(prev => [newToast, ...prev]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Projects
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`
    };
    setProjects(prev => [newProject, ...prev]);
    showToast('Project Created', `Project "${newProject.name}" has been added to active pipeline.`);
  };

  const updateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast('Project Updated', `Project "${updated.name}" details saved.`);
  };

  const toggleTask = (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;
      const updatedTasks = project.tasks.map(task => {
        if (task.id === taskId) {
          const completed = !task.completed;
          showToast(
            completed ? 'Task Completed' : 'Task Reopened', 
            `"${task.title}" updated for ${project.name}.`,
            'info'
          );
          return { ...task, completed };
        }
        return task;
      });
      // Recalculate progress slightly based on completed tasks
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const taskFactor = updatedTasks.length ? Math.round((completedCount / updatedTasks.length) * 15) : 0;
      const baseProgress = Math.min(95, Math.max(10, project.progress));
      return {
        ...project,
        tasks: updatedTasks
      };
    }));
  };

  const addTask = (projectId: string, taskData: Omit<ProjectTask, 'id' | 'projectId'>) => {
    const newTask: ProjectTask = {
      ...taskData,
      id: `t-${Date.now()}`,
      projectId
    };
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, tasks: [...p.tasks, newTask] };
    }));
    showToast('Task Added', `"${newTask.title}" added to project board.`);
  };

  const updateMilestoneStatus = (projectId: string, milestoneId: string, status: 'Completed' | 'In Progress' | 'Upcoming') => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedMilestones = p.milestones.map(m => m.id === milestoneId ? { ...m, status } : m);
      const completedCount = updatedMilestones.filter(m => m.status === 'Completed').length;
      const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
      return { ...p, milestones: updatedMilestones, progress: newProgress };
    }));
    showToast('Milestone Updated', `Milestone marked as ${status}.`);
  };

  // Leads
  const addLead = (leadData: Omit<Lead, 'id'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`
    };
    setLeads(prev => [newLead, ...prev]);
    showToast('Lead Added', `New prospective client "${newLead.clientName}" registered.`);
  };

  const updateLead = (updated: Lead) => {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
    showToast('Lead Updated', `Lead "${updated.clientName}" status updated.`);
  };

  const addLeadNote = (leadId: string, text: string) => {
    const note = {
      id: `ln-${Date.now()}`,
      text,
      date: new Date().toISOString().split('T')[0],
      author: 'Nancy Paramo'
    };
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes: [note, ...l.notes] } : l));
    showToast('Note Added', 'Conversation note appended to lead record.');
  };

  const scheduleLeadVisit = (leadId: string, date: string, time: string, notes: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l;
      return {
        ...l,
        status: 'Site Visit Scheduled',
        scheduledVisit: { date, time, notes }
      };
    }));

    // Also add to schedule events
    const targetLead = leads.find(l => l.id === leadId);
    if (targetLead) {
      const newEvent: ScheduleEvent = {
        id: `evt-${Date.now()}`,
        title: `Site Consultation: ${targetLead.clientName}`,
        projectId: 'leads',
        projectName: `${targetLead.projectType} (${targetLead.location})`,
        type: 'Site Visit',
        date,
        time,
        assignedTo: 'Nancy Paramo',
        location: targetLead.location,
        status: 'Scheduled',
        notes: notes || 'Initial project scope evaluation and measurements.'
      };
      setScheduleEvents(prev => [newEvent, ...prev]);
    }

    showToast('Site Visit Scheduled', `Visit confirmed for ${date} at ${time}. Added to calendar.`);
  };

  const convertLeadToProject = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // Check if client exists or create one
    let clientId = `client-${Date.now()}`;
    const newClient: Client = {
      id: clientId,
      name: lead.clientName,
      email: lead.email,
      phone: lead.phone,
      address: lead.location,
      city: lead.location,
      activeProjectIds: [],
      completedProjectIds: [],
      totalSpent: 0,
      lastCommunication: new Date().toISOString().split('T')[0],
      portalAccessCode: `UC-SOCAL-${Math.floor(100 + Math.random() * 900)}`
    };
    setClients(prev => [newClient, ...prev]);

    // Create Project
    const newProjectId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: newProjectId,
      name: `${lead.clientName.split(' ')[0]} – ${lead.projectType}`,
      clientId: clientId,
      clientName: lead.clientName,
      clientEmail: lead.email,
      clientPhone: lead.phone,
      category: lead.projectType,
      location: lead.location,
      address: lead.location,
      assignedTeamIds: ['team-1', 'team-2'],
      startDate: new Date().toISOString().split('T')[0],
      targetCompletion: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: 65000,
      amountSpent: 0,
      progress: 5,
      status: 'Planning',
      description: `Converted from lead inquiry. Scope: ${lead.projectType}.`,
      coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
      milestones: [
        { id: `m-${Date.now()}-1`, projectId: newProjectId, title: 'Contract Execution & Retainer', date: new Date().toISOString().split('T')[0], status: 'In Progress' },
        { id: `m-${Date.now()}-2`, projectId: newProjectId, title: 'Architectural Drawings & Engineering', date: '2026-11-20', status: 'Upcoming' },
        { id: `m-${Date.now()}-3`, projectId: newProjectId, title: 'Permit Submission to City Hall', date: '2026-12-01', status: 'Upcoming' },
        { id: `m-${Date.now()}-4`, projectId: newProjectId, title: 'Construction Groundbreak', date: '2026-12-15', status: 'Upcoming' }
      ],
      tasks: [
        { id: `t-${Date.now()}-1`, projectId: newProjectId, title: 'Draft standard prime construction contract', assignedTo: 'Nancy Paramo', dueDate: '2026-11-10', priority: 'High', completed: false },
        { id: `t-${Date.now()}-2`, projectId: newProjectId, title: 'Create digital project folder and invite client to portal', assignedTo: 'Sofia Rodriguez', dueDate: '2026-11-11', priority: 'Medium', completed: false }
      ]
    };

    setProjects(prev => [newProject, ...prev]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'Converted' } : l));
    setSelectedProjectId(newProjectId);
    setCurrentTab('projects');
    showToast('Lead Converted to Project', `Successfully converted "${lead.clientName}" into an active project.`);
  };

  // Estimates
  const addEstimate = (estimateData: Omit<Estimate, 'id'>) => {
    const newEstimate: Estimate = {
      ...estimateData,
      id: `est-${Date.now()}`
    };
    setEstimates(prev => [newEstimate, ...prev]);
    showToast('Estimate Generated', `Estimate ${newEstimate.estimateNumber} created ($${newEstimate.totalEstimatedCost.toLocaleString()}).`);
  };

  const updateEstimateStatus = (estimateId: string, status: 'Draft' | 'Sent' | 'Approved' | 'Declined') => {
    setEstimates(prev => prev.map(e => e.id === estimateId ? { ...e, status } : e));
    showToast('Estimate Status Changed', `Estimate updated to "${status}".`);
  };

  // Daily Updates
  const addDailyUpdate = (updateData: Omit<DailyUpdate, 'id' | 'createdAt'>) => {
    const newUpdate: DailyUpdate = {
      ...updateData,
      id: `upd-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setDailyUpdates(prev => [newUpdate, ...prev]);
    showToast('Daily Site Update Logged', `Field report published for ${newUpdate.projectName}.`);
  };

  // Schedule Events
  const addScheduleEvent = (eventData: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...eventData,
      id: `evt-${Date.now()}`
    };
    setScheduleEvents(prev => [newEvent, ...prev]);
    showToast('Event Scheduled', `"${newEvent.title}" on ${newEvent.date} at ${newEvent.time}.`);
  };

  const updateScheduleEvent = (event: ScheduleEvent) => {
    setScheduleEvents(prev => prev.map(e => e.id === event.id ? event : e));
    showToast('Event Updated', `Calendar event details updated.`);
  };

  const deleteScheduleEvent = (id: string) => {
    setScheduleEvents(prev => prev.filter(e => e.id !== id));
    showToast('Event Removed', `Calendar appointment deleted.`, 'info');
  };

  // Team Members
  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `team-${Date.now()}`
    };
    setTeam(prev => [...prev, newMember]);
    showToast('Team Member Added', `${newMember.name} (${newMember.role}) joined directory.`);
  };

  const updateTeamMember = (member: TeamMember) => {
    setTeam(prev => prev.map(m => m.id === member.id ? member : m));
    showToast('Team Member Updated', `Profile updated for ${member.name}.`);
  };

  // Documents
  const addDocument = (docData: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
    showToast('Document Uploaded', `"${newDoc.name}" filed under ${newDoc.category}.`);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    showToast('Document Deleted', 'File record removed from repository.', 'info');
  };

  // Change Orders
  const addChangeOrder = (coData: Omit<ChangeOrder, 'id'>) => {
    const newCO: ChangeOrder = {
      ...coData,
      id: `co-${Date.now()}`
    };
    setChangeOrders(prev => [newCO, ...prev]);
    // Also notify
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Change Order Drafted',
      message: `${newCO.orderNumber} for ${newCO.projectName} ($${newCO.totalCost.toLocaleString()}).`,
      timestamp: 'Just now',
      type: 'change_order',
      read: false,
      linkTab: 'changeorders',
      projectId: newCO.projectId
    };
    setNotifications(prev => [notif, ...prev]);
    showToast('Change Order Created', `${newCO.orderNumber} ($${newCO.totalCost.toLocaleString()}) created.`);
  };

  const updateChangeOrderStatus = (id: string, status: ChangeOrder['status'], signature?: string) => {
    setChangeOrders(prev => prev.map(co => {
      if (co.id !== id) return co;
      const updated: ChangeOrder = {
        ...co,
        status,
        approvedDate: status === 'Approved' ? new Date().toISOString().split('T')[0] : co.approvedDate,
        clientSignature: signature || co.clientSignature
      };

      // If approved, update project budget
      if (status === 'Approved') {
        setProjects(allProj => allProj.map(p => {
          if (p.id === co.projectId) {
            return {
              ...p,
              budget: p.budget + co.totalCost
            };
          }
          return p;
        }));
      }

      return updated;
    }));

    showToast('Change Order Updated', `Status changed to "${status}".`, status === 'Approved' ? 'success' : 'info');
  };

  // Clients
  const addClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`
    };
    setClients(prev => [newClient, ...prev]);
    showToast('Client Registered', `${newClient.name} added to client directory.`);
  };

  const updateClient = (client: Client) => {
    setClients(prev => prev.map(c => c.id === client.id ? client : c));
    showToast('Client Profile Saved', `Client record updated for ${client.name}.`);
  };

  // Messaging
  const sendMessage = (projectId: string, content: string, sender: 'Nancy Paramo' | 'Homeowner' | 'Site Foreman') => {
    const senderRole = sender === 'Nancy Paramo' ? 'General Contractor & Owner' : sender === 'Homeowner' ? 'Homeowner' : 'Lead Project Foreman';
    const newMsg: CommunicationMessage = {
      id: `msg-${Date.now()}`,
      projectId,
      sender,
      senderRole,
      timestamp: new Date().toISOString(),
      content,
      isRead: true
    };
    setMessages(prev => [...prev, newMsg]);
    showToast('Message Sent', `Your message was delivered.`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications Cleared', 'All alerts marked as read.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedProjectId,
        setSelectedProjectId,
        isHomeownerPortal,
        setIsHomeownerPortal,
        activeHomeownerProjectId,
        setActiveHomeownerProjectId,
        searchQuery,
        setSearchQuery,
        projects,
        leads,
        estimates,
        team,
        dailyUpdates,
        documents,
        changeOrders,
        clients,
        scheduleEvents,
        messages,
        notifications,
        toasts,
        showToast,
        dismissToast,
        addProject,
        updateProject,
        toggleTask,
        addTask,
        updateMilestoneStatus,
        addLead,
        updateLead,
        addLeadNote,
        scheduleLeadVisit,
        convertLeadToProject,
        addEstimate,
        updateEstimateStatus,
        addDailyUpdate,
        addScheduleEvent,
        updateScheduleEvent,
        deleteScheduleEvent,
        addTeamMember,
        updateTeamMember,
        addDocument,
        deleteDocument,
        addChangeOrder,
        updateChangeOrderStatus,
        addClient,
        updateClient,
        sendMessage,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
