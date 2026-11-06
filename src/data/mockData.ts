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
  NotificationItem
} from '../types';

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Nancy Paramo',
    role: 'Owner & General Contractor',
    phone: '(951) 609-7164',
    email: 'nancy@unlimited-construction.com',
    assignedProjectIds: ['proj-1', 'proj-2', 'proj-3', 'proj-4', 'proj-5', 'proj-6'],
    availability: 'Active on Site',
    tradeSpecialty: 'General Contracting • License #1040445',
  },
  {
    id: 'team-2',
    name: 'Carlos Mendez',
    role: 'Senior Project Manager & Master Carpenter',
    phone: '(951) 420-8831',
    email: 'carlos@unlimited-construction.com',
    assignedProjectIds: ['proj-1', 'proj-2'],
    availability: 'Active on Site',
    tradeSpecialty: 'Custom Cabinetry & Framing',
  },
  {
    id: 'team-3',
    name: 'Mateo Rivera',
    role: 'Concrete & Hardscape Foreman',
    phone: '(951) 318-9042',
    email: 'mateo@unlimited-construction.com',
    assignedProjectIds: ['proj-3', 'proj-5'],
    availability: 'In Transit',
    tradeSpecialty: 'Foundations, Decorative Stamped Concrete',
  },
  {
    id: 'team-4',
    name: 'Javier Gutierrez',
    role: 'Framing & Drywall Lead',
    phone: '(951) 505-1278',
    email: 'javier@unlimited-construction.com',
    assignedProjectIds: ['proj-2', 'proj-6'],
    availability: 'Active on Site',
    tradeSpecialty: 'Structural Framing & Drywall Finish',
  },
  {
    id: 'team-5',
    name: 'Sofia Rodriguez',
    role: 'Architectural Designer & Permit Expediter',
    phone: '(951) 782-4419',
    email: 'sofia@unlimited-construction.com',
    assignedProjectIds: ['proj-2', 'proj-4', 'proj-6'],
    availability: 'Available',
    tradeSpecialty: '3D CAD Blueprints & Municipal Permitting',
  },
  {
    id: 'team-6',
    name: 'David Chen',
    role: 'MEP Specialist (Electrical & Plumbing)',
    phone: '(909) 819-3302',
    email: 'david@unlimited-construction.com',
    assignedProjectIds: ['proj-1', 'proj-4'],
    availability: 'Available',
    tradeSpecialty: 'Title 24 Electrical & Rough Plumbing',
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'David & Sarah Johnson',
    email: 'david.johnson@gmail.com',
    phone: '(951) 829-1402',
    address: '32190 Meadows Glen Way',
    city: 'Temecula, CA 92592',
    activeProjectIds: ['proj-1'],
    completedProjectIds: [],
    totalSpent: 87500,
    lastCommunication: '2026-11-05',
    portalAccessCode: 'UC-TEM-892',
    notes: 'Homeowner requested custom quartz waterfall island and brass hardware upgrades.'
  },
  {
    id: 'client-2',
    name: 'Elena & Marco Martinez',
    email: 'elena.martinez@outlook.com',
    phone: '(951) 640-7719',
    address: '5420 Victoria Ave',
    city: 'Riverside, CA 92506',
    activeProjectIds: ['proj-2'],
    completedProjectIds: [],
    totalSpent: 245000,
    lastCommunication: '2026-11-06',
    portalAccessCode: 'UC-RIV-441',
    notes: 'Detached 750 sq.ft ADU for aging parents. Focus on zero-threshold shower and French door patio.'
  },
  {
    id: 'client-3',
    name: 'Robert Williams',
    email: 'rwilliams.socal@yahoo.com',
    phone: '(951) 279-8830',
    address: '1480 Foothill Pkwy',
    city: 'Corona, CA 92882',
    activeProjectIds: ['proj-3'],
    completedProjectIds: [],
    totalSpent: 42000,
    lastCommunication: '2026-11-04',
    portalAccessCode: 'UC-COR-112',
    notes: 'Decorative stamped concrete driveway with drainage trench and custom LED step lighting.'
  },
  {
    id: 'client-4',
    name: 'Patricia & Thomas Anderson',
    email: 'panderson.murrieta@gmail.com',
    phone: '(951) 304-9182',
    address: '39820 Clinton Keith Rd',
    city: 'Murrieta, CA 92562',
    activeProjectIds: ['proj-4'],
    completedProjectIds: [],
    totalSpent: 54000,
    lastCommunication: '2026-11-03',
    portalAccessCode: 'UC-MUR-703',
    notes: 'Luxury master bath spa remodel. Freestanding soaking tub and frameless glass shower enclosure.'
  },
  {
    id: 'client-5',
    name: 'Hector & Maria Garcia',
    email: 'hgarcia_family@gmail.com',
    phone: '(951) 672-4911',
    address: '28100 Newport Rd',
    city: 'Menifee, CA 92584',
    activeProjectIds: ['proj-5'],
    completedProjectIds: [],
    totalSpent: 38500,
    lastCommunication: '2026-11-05',
    portalAccessCode: 'UC-MEN-338',
    notes: 'Solid insulated Alumawood patio cover with 3 ceiling fans and built-in BBQ island counter.'
  },
  {
    id: 'client-6',
    name: 'Julian Torres',
    email: 'julian.torres@irvinecorp.com',
    phone: '(949) 855-3290',
    address: '4100 Jeffrey Rd',
    city: 'Irvine, CA 92620',
    activeProjectIds: ['proj-6'],
    completedProjectIds: [],
    totalSpent: 195000,
    lastCommunication: '2026-11-02',
    portalAccessCode: 'UC-IRV-901',
    notes: 'Luxury poolside modern casita with kitchenette, accordion glass wall and mini-split HVAC.'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Johnson – Modern Kitchen Remodel',
    clientId: 'client-1',
    clientName: 'David & Sarah Johnson',
    clientEmail: 'david.johnson@gmail.com',
    clientPhone: '(951) 829-1402',
    category: 'Kitchen & Bath Remodeling',
    location: 'Temecula, CA',
    address: '32190 Meadows Glen Way, Temecula, CA 92592',
    assignedTeamIds: ['team-1', 'team-2', 'team-6'],
    startDate: '2026-10-05',
    targetCompletion: '2026-11-28',
    budget: 87500,
    amountSpent: 64200,
    progress: 78,
    status: 'In Progress',
    description: 'Complete open-concept kitchen overhaul featuring custom shaker cabinetry, Calacatta quartz countertops with waterfall edge, commercial 6-burner gas range, walk-in pantry, and recessed lighting layout.',
    squareFootage: 380,
    permitNumber: 'TEM-B26-04911',
    coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    milestones: [
      { id: 'm-1', projectId: 'proj-1', title: 'Demolition & Haul Away', date: '2026-10-09', status: 'Completed', notes: 'Removed existing soffits and drywall.' },
      { id: 'm-2', projectId: 'proj-1', title: 'Rough Electrical & Plumbing', date: '2026-10-20', status: 'Completed', notes: 'Island sink plumbing and 240V range circuit.' },
      { id: 'm-3', projectId: 'proj-1', title: 'City Rough-In Inspection', date: '2026-10-24', status: 'Completed', notes: 'Passed with zero corrections.' },
      { id: 'm-4', projectId: 'proj-1', title: 'Cabinetry & Crown Molding Install', date: '2026-11-02', status: 'Completed', notes: 'Solid maple face-frames.' },
      { id: 'm-5', projectId: 'proj-1', title: 'Quartz Countertop Template & Install', date: '2026-11-12', status: 'In Progress', notes: 'Slabs delivered from Anaheim stone yard.' },
      { id: 'm-6', projectId: 'proj-1', title: 'Subway Tile Backsplash & Fixtures', date: '2026-11-20', status: 'Upcoming' },
      { id: 'm-7', projectId: 'proj-1', title: 'Final Inspection & Nancy Walkthrough', date: '2026-11-28', status: 'Upcoming' }
    ],
    tasks: [
      { id: 't-1', projectId: 'proj-1', title: 'Confirm quartz slab delivery time with Anaheim warehouse', assignedTo: 'Carlos Mendez', dueDate: '2026-11-08', priority: 'High', completed: true },
      { id: 't-2', projectId: 'proj-1', title: 'Coordinate under-cabinet LED low-voltage driver hookup', assignedTo: 'David Chen', dueDate: '2026-11-10', priority: 'Medium', completed: false },
      { id: 't-3', projectId: 'proj-1', title: 'Inspect grout color samples with Sarah Johnson', assignedTo: 'Nancy Paramo', dueDate: '2026-11-11', priority: 'High', completed: false },
      { id: 't-4', projectId: 'proj-1', title: 'Schedule final city building & electrical inspection', assignedTo: 'Sofia Rodriguez', dueDate: '2026-11-22', priority: 'Medium', completed: false }
    ]
  },
  {
    id: 'proj-2',
    name: 'Martinez – Backyard ADU & Guest House',
    clientId: 'client-2',
    clientName: 'Elena & Marco Martinez',
    clientEmail: 'elena.martinez@outlook.com',
    clientPhone: '(951) 640-7719',
    category: 'ADUs & Garage Conversions',
    location: 'Riverside, CA',
    address: '5420 Victoria Ave, Riverside, CA 92506',
    assignedTeamIds: ['team-1', 'team-2', 'team-4', 'team-5'],
    startDate: '2026-09-15',
    targetCompletion: '2026-12-20',
    budget: 245000,
    amountSpent: 168000,
    progress: 65,
    status: 'In Progress',
    description: 'Ground-up 750 sq ft single-story 1-bedroom Accessory Dwelling Unit with full kitchen, ADA-compliant roll-in shower bathroom, vaulted living room ceiling, Spanish tile roof matching main residence, and private patio.',
    squareFootage: 750,
    permitNumber: 'RIV-ADU-26-8802',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    milestones: [
      { id: 'm-21', projectId: 'proj-2', title: 'Grading & Trenching for Utilities', date: '2026-09-22', status: 'Completed' },
      { id: 'm-22', projectId: 'proj-2', title: 'Monolithic Slab Foundation Pour', date: '2026-10-04', status: 'Completed', notes: '4000 PSI concrete mix inspected and approved.' },
      { id: 'm-23', projectId: 'proj-2', title: 'Structural Wall Framing & Trusses', date: '2026-10-22', status: 'Completed' },
      { id: 'm-24', projectId: 'proj-2', title: 'Rough Plumbing, Electrical & HVAC', date: '2026-11-06', status: 'In Progress' },
      { id: 'm-25', projectId: 'proj-2', title: 'City 4-Way Combination Inspection', date: '2026-11-14', status: 'Upcoming' },
      { id: 'm-26', projectId: 'proj-2', title: 'Insulation & Drywall Texture', date: '2026-11-25', status: 'Upcoming' },
      { id: 'm-27', projectId: 'proj-2', title: 'Interior Trim, Flooring & Cabinets', date: '2026-12-10', status: 'Upcoming' },
      { id: 'm-28', projectId: 'proj-2', title: 'Final Certificate of Occupancy', date: '2026-12-20', status: 'Upcoming' }
    ],
    tasks: [
      { id: 't-21', projectId: 'proj-2', title: 'Deliver R-19 batt insulation & drywall sheets to site', assignedTo: 'Javier Gutierrez', dueDate: '2026-11-08', priority: 'High', completed: false },
      { id: 't-22', projectId: 'proj-2', title: 'Verify French door threshold meets zero-barrier spec', assignedTo: 'Carlos Mendez', dueDate: '2026-11-09', priority: 'Medium', completed: true },
      { id: 't-23', projectId: 'proj-2', title: 'Review change order #2 with Elena for exterior stucco color match', assignedTo: 'Nancy Paramo', dueDate: '2026-11-07', priority: 'Urgent', completed: false }
    ]
  },
  {
    id: 'proj-3',
    name: 'Williams – Concrete Driveway & Hardscape',
    clientId: 'client-3',
    clientName: 'Robert Williams',
    clientEmail: 'rwilliams.socal@yahoo.com',
    clientPhone: '(951) 279-8830',
    category: 'Concrete Patios & Driveways',
    location: 'Corona, CA',
    address: '1480 Foothill Pkwy, Corona, CA 92882',
    assignedTeamIds: ['team-1', 'team-3'],
    startDate: '2026-10-28',
    targetCompletion: '2026-11-18',
    budget: 42000,
    amountSpent: 36000,
    progress: 88,
    status: 'In Progress',
    description: 'Demolition of cracked 28-year-old asphalt driveway; form, rebar grid #4 12" O.C., and pour 2,400 sq.ft of 4,500 PSI decorative ashlar slate stamped concrete with charcoal integral color and two-tone release wash.',
    squareFootage: 2400,
    permitNumber: 'COR-PW-26-1049',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    milestones: [
      { id: 'm-31', projectId: 'proj-3', title: 'Demo Existing Asphalt & Sub-base Compact', date: '2026-10-30', status: 'Completed' },
      { id: 'm-32', projectId: 'proj-3', title: 'Forms & Rebar Grid Placement', date: '2026-11-03', status: 'Completed' },
      { id: 'm-33', projectId: 'proj-3', title: 'Concrete Pour & Stamp Impression', date: '2026-11-05', status: 'Completed', notes: '5 trucks placed with retardant.' },
      { id: 'm-34', projectId: 'proj-3', title: 'Pressure Wash Release & Acrylic Sealer', date: '2026-11-12', status: 'In Progress' },
      { id: 'm-35', projectId: 'proj-3', title: 'Final Clean & Expansion Joint Caulking', date: '2026-11-18', status: 'Upcoming' }
    ],
    tasks: [
      { id: 't-31', projectId: 'proj-3', title: 'Apply high-solids solvent cure and seal with anti-slip grip', assignedTo: 'Mateo Rivera', dueDate: '2026-11-12', priority: 'High', completed: false },
      { id: 't-32', projectId: 'proj-3', title: 'Deliver warning cones and perimeter ribbon to protect curing surface', assignedTo: 'Mateo Rivera', dueDate: '2026-11-06', priority: 'Medium', completed: true }
    ]
  },
  {
    id: 'proj-4',
    name: 'Anderson – Master Bath Renovation',
    clientId: 'client-4',
    clientName: 'Patricia & Thomas Anderson',
    clientEmail: 'panderson.murrieta@gmail.com',
    clientPhone: '(951) 304-9182',
    category: 'Kitchen & Bath Remodeling',
    location: 'Murrieta, CA',
    address: '39820 Clinton Keith Rd, Murrieta, CA 92562',
    assignedTeamIds: ['team-1', 'team-5', 'team-6'],
    startDate: '2026-10-18',
    targetCompletion: '2026-11-30',
    budget: 54000,
    amountSpent: 29500,
    progress: 52,
    status: 'In Progress',
    description: 'Transforming dated 1990s bathroom into a modern spa retreat with curbless walk-in shower, Schluter waterproofing membrane, freestanding stone resin tub, dual custom vanities, and programmable heated tile floors.',
    squareFootage: 210,
    permitNumber: 'MUR-B26-0811',
    coverImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1000&q=80',
    milestones: [
      { id: 'm-41', projectId: 'proj-4', title: 'Demo Tub Surround & Water Damage Repair', date: '2026-10-22', status: 'Completed' },
      { id: 'm-42', projectId: 'proj-4', title: 'Schluter Kerdi Shower Pan & Water Test', date: '2026-10-31', status: 'Completed', notes: 'Passed 24-hr city flood test.' },
      { id: 'm-43', projectId: 'proj-4', title: 'Heated Floor Wire Mesh & Self-Leveler', date: '2026-11-06', status: 'In Progress' },
      { id: 'm-44', projectId: 'proj-4', title: 'Large Format Porcelain Tile Installation', date: '2026-11-15', status: 'Upcoming' },
      { id: 'm-45', projectId: 'proj-4', title: 'Custom 3/8" Frameless Glass & Plumbing Trim', date: '2026-11-25', status: 'Upcoming' }
    ],
    tasks: [
      { id: 't-41', projectId: 'proj-4', title: 'Measure laser dimensions for custom frameless glass shower door', assignedTo: 'Carlos Mendez', dueDate: '2026-11-14', priority: 'Medium', completed: false },
      { id: 't-42', projectId: 'proj-4', title: 'Confirm Nuheat thermostat GFCI dedicated breaker', assignedTo: 'David Chen', dueDate: '2026-11-07', priority: 'High', completed: false }
    ]
  },
  {
    id: 'proj-5',
    name: 'Garcia – Insulated Alumawood Patio Cover',
    clientId: 'client-5',
    clientName: 'Hector & Maria Garcia',
    clientEmail: 'hgarcia_family@gmail.com',
    clientPhone: '(951) 672-4911',
    category: 'Patio Covers',
    location: 'Menifee, CA',
    address: '28100 Newport Rd, Menifee, CA 92584',
    assignedTeamIds: ['team-1', 'team-3'],
    startDate: '2026-11-02',
    targetCompletion: '2026-11-15',
    budget: 38500,
    amountSpent: 18200,
    progress: 45,
    status: 'In Progress',
    description: 'Custom 18\' x 34\' insulated Alumawood solid patio structure with Roman columns, recessed LED lighting, ceiling fans pre-wire, and stucco match posts anchoring to existing foundation.',
    squareFootage: 612,
    permitNumber: 'MEN-ENG-26-302',
    coverImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
    milestones: [
      { id: 'm-51', projectId: 'proj-5', title: 'Engineering Calculation & City Permit Approval', date: '2026-10-25', status: 'Completed' },
      { id: 'm-52', projectId: 'proj-5', title: 'Footing Excavation & Anchor Bolt Setting', date: '2026-11-04', status: 'Completed' },
      { id: 'm-53', projectId: 'proj-5', title: 'Alumawood Structural Frame & Header Beam', date: '2026-11-08', status: 'In Progress' },
      { id: 'm-54', projectId: 'proj-5', title: 'Insulated Roof Panels & Gutter Integration', date: '2026-11-12', status: 'Upcoming' },
      { id: 'm-55', projectId: 'proj-5', title: 'Final Inspection & Client Handover', date: '2026-11-15', status: 'Upcoming' }
    ],
    tasks: [
      { id: 't-51', projectId: 'proj-5', title: 'Deliver Spanish Brown 3" insulated panels and steel headers', assignedTo: 'Mateo Rivera', dueDate: '2026-11-07', priority: 'High', completed: true },
      { id: 't-52', projectId: 'proj-5', title: 'Verify post spacing with Menifee building inspector stamp', assignedTo: 'Nancy Paramo', dueDate: '2026-11-08', priority: 'High', completed: false }
    ]
  },
  {
    id: 'proj-6',
    name: 'Torres – Luxury Casita & Pool Pavilion',
    clientId: 'client-6',
    clientName: 'Julian Torres',
    clientEmail: 'julian.torres@irvinecorp.com',
    clientPhone: '(949) 855-3290',
    category: 'Casitas & Guest Houses',
    location: 'Irvine, CA',
    address: '4100 Jeffrey Rd, Irvine, CA 92620',
    assignedTeamIds: ['team-1', 'team-4', 'team-5'],
    startDate: '2026-11-15',
    targetCompletion: '2027-02-28',
    budget: 195000,
    amountSpent: 22000,
    progress: 15,
    status: 'Planning',
    description: 'Modern 550 sq.ft pool cabana casita featuring 16-foot Fleetwood bifold glass doors, outdoor wet bar, powder room, linear gas fireplace, and integrated sound system.',
    squareFootage: 550,
    permitNumber: 'IRV-BLD-26-771',
    coverImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
    milestones: [
      { id: 'm-61', projectId: 'proj-6', title: 'Architectural Renderings & Client Signoff', date: '2026-10-15', status: 'Completed' },
      { id: 'm-62', projectId: 'proj-6', title: 'City of Irvine Permit Submission & Plan Check', date: '2026-11-04', status: 'Completed' },
      { id: 'm-63', projectId: 'proj-6', title: 'Site Excavation & Pool Barrier Safety Fencing', date: '2026-11-18', status: 'Upcoming' },
      { id: 'm-64', projectId: 'proj-6', title: 'Underground Sewer & Electrical Lateral', date: '2026-12-05', status: 'Upcoming' }
    ],
    tasks: [
      { id: 't-61', projectId: 'proj-6', title: 'Pick up approved stamped plan set from Irvine Civic Center', assignedTo: 'Sofia Rodriguez', dueDate: '2026-11-10', priority: 'High', completed: false },
      { id: 't-62', projectId: 'proj-6', title: 'Confirm delivery date for Fleetwood multi-slide glass package', assignedTo: 'Nancy Paramo', dueDate: '2026-11-17', priority: 'Medium', completed: false }
    ]
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    clientName: 'Brandon & Lisa Scott',
    phone: '(951) 719-5501',
    email: 'bscott.realtor@gmail.com',
    projectType: 'Kitchen & Bath Remodeling',
    location: 'Temecula, CA',
    inquiryDate: '2026-11-04',
    status: 'Site Visit Scheduled',
    budgetRange: '$70,000 - $95,000',
    notes: [
      { id: 'ln-1', text: 'Inquired via website form. Wants to remove load-bearing wall between dining room and kitchen.', date: '2026-11-04', author: 'Nancy Paramo' },
      { id: 'ln-2', text: 'Spoke over phone, scheduled in-person walkthrough for Saturday at 10 AM.', date: '2026-11-05', author: 'Nancy Paramo' }
    ],
    scheduledVisit: {
      date: '2026-11-08',
      time: '10:00 AM',
      notes: 'Bring laser measure, sample cabinet chips, and structural beam span tables.'
    }
  },
  {
    id: 'lead-2',
    clientName: 'Guillermo Mendoza',
    phone: '(951) 452-9903',
    email: 'gmendoza@inlandventures.com',
    projectType: 'ADUs & Garage Conversions',
    location: 'Riverside, CA',
    inquiryDate: '2026-11-02',
    status: 'Estimate in Progress',
    budgetRange: '$180,000 - $220,000',
    notes: [
      { id: 'ln-3', text: 'Wants to convert 2-car garage into 450 sq ft rental studio unit with separate electric subpanel.', date: '2026-11-02', author: 'Nancy Paramo' },
      { id: 'ln-4', text: 'Site visit completed. Sewer line has easy 12-foot gravity tie-in to main stack.', date: '2026-11-04', author: 'Carlos Mendez' }
    ],
    estimateId: 'est-2'
  },
  {
    id: 'lead-3',
    clientName: 'Sandra & Wayne Miller',
    phone: '(951) 926-8120',
    email: 'miller.menifee@gmail.com',
    projectType: 'Concrete Patios & Driveways',
    location: 'Menifee, CA',
    inquiryDate: '2026-11-05',
    status: 'New',
    budgetRange: '$25,000 - $35,000',
    notes: [
      { id: 'ln-5', text: 'Looking to pour 1,200 sq.ft stamped patio around newly installed in-ground pool.', date: '2026-11-05', author: 'Nancy Paramo' }
    ]
  },
  {
    id: 'lead-4',
    clientName: 'Dr. Gregory Vance',
    phone: '(949) 701-4433',
    email: 'dr.vance@newportdental.com',
    projectType: 'Room Additions',
    location: 'Corona, CA',
    inquiryDate: '2026-10-28',
    status: 'Estimate Sent',
    budgetRange: '$120,000 - $150,000',
    notes: [
      { id: 'ln-6', text: 'Second story master retreat addition over existing 3-car garage. Sent preliminary itemized estimate #EST-1049.', date: '2026-11-01', author: 'Nancy Paramo' }
    ],
    estimateId: 'est-3'
  },
  {
    id: 'lead-5',
    clientName: 'Theresa Hopkins',
    phone: '(951) 698-3310',
    email: 'thopkins@murrietaschools.org',
    projectType: 'Patio Covers',
    location: 'Murrieta, CA',
    inquiryDate: '2026-11-01',
    status: 'Contacted',
    budgetRange: '$20,000 - $30,000',
    notes: [
      { id: 'ln-7', text: 'Wants lattice Alumawood cover with ceiling fan and misting line for hot summers.', date: '2026-11-01', author: 'Nancy Paramo' }
    ]
  },
  {
    id: 'lead-6',
    clientName: 'Ken & Grace Nakamura',
    phone: '(858) 490-2189',
    email: 'knakamura@sandiego-bio.org',
    projectType: 'Architectural Design',
    location: 'San Diego, CA',
    inquiryDate: '2026-10-20',
    status: 'Converted',
    budgetRange: '$350,000+',
    notes: [
      { id: 'ln-8', text: 'Converted to active design consultation phase. Full custom residential expansion.', date: '2026-10-30', author: 'Nancy Paramo' }
    ]
  }
];

export const INITIAL_ESTIMATES: Estimate[] = [
  {
    id: 'est-1',
    estimateNumber: 'EST-2026-1042',
    clientName: 'David & Sarah Johnson',
    clientEmail: 'david.johnson@gmail.com',
    clientPhone: '(951) 829-1402',
    projectAddress: '32190 Meadows Glen Way, Temecula, CA 92592',
    projectType: 'Kitchen & Bath Remodeling',
    scopeOfWork: 'Complete open-concept kitchen demolition, custom shaker soft-close cabinetry, Calacatta quartz countertops with mitered waterfall island, tile backsplash, plumbing fixtures, appliance installation, and Title 24 LED recessed lighting.',
    items: [
      { id: 'ei-1', category: 'Labor', description: 'Demolition of existing cabinets, countertops, drywall & bulkhead', quantity: 1, unit: 'LS', unitCost: 4800, total: 4800 },
      { id: 'ei-2', category: 'Labor', description: 'Rough framing modification for flush 14-ft engineered LVL beam', quantity: 1, unit: 'LS', unitCost: 5500, total: 5500 },
      { id: 'ei-3', category: 'Labor', description: 'Licensed electrical rewiring, 12 recessed cans, 3 pendant circuits', quantity: 1, unit: 'LS', unitCost: 4200, total: 4200 },
      { id: 'ei-4', category: 'Labor', description: 'Plumbing rough & finish trim for undermount sink and pot filler', quantity: 1, unit: 'LS', unitCost: 3400, total: 3400 },
      { id: 'ei-5', category: 'Material', description: 'Solid maple custom shaker cabinets (Painted Chantilly Lace White)', quantity: 26, unit: 'Lin Ft', unitCost: 650, total: 16900 },
      { id: 'ei-6', category: 'Material', description: 'Calacatta Gold quartz slabs (2 full slabs + fabrication & waterfall edge)', quantity: 2, unit: 'Slabs', unitCost: 4200, total: 8400 },
      { id: 'ei-7', category: 'Material', description: 'Handcrafted zellige subway tile backsplash and epoxy grout', quantity: 85, unit: 'Sq Ft', unitCost: 28, total: 2380 },
      { id: 'ei-8', category: 'Equipment / Sub', description: 'Debris dumpster 40-yard roll-off and city recycling diversion fee', quantity: 2, unit: 'Loads', unitCost: 950, total: 1900 },
      { id: 'ei-9', category: 'Permits & Fees', description: 'City of Temecula building, electrical & plumbing plan check permits', quantity: 1, unit: 'LS', unitCost: 2200, total: 2200 }
    ],
    subtotal: 51680,
    contingencyPercent: 10,
    contingencyAmount: 5168,
    totalEstimatedCost: 56848,
    status: 'Approved',
    createdAt: '2026-10-02',
    validUntil: '2026-11-02',
    notes: 'Includes 2-year craftsmanship warranty backed by Unlimited Construction. 10% deposit required upon contract execution.'
  },
  {
    id: 'est-2',
    estimateNumber: 'EST-2026-1048',
    clientName: 'Guillermo Mendoza',
    clientEmail: 'gmendoza@inlandventures.com',
    clientPhone: '(951) 452-9903',
    projectAddress: '1940 Canyon Crest Dr, Riverside, CA 92507',
    projectType: 'ADUs & Garage Conversions',
    scopeOfWork: 'Conversion of existing 440 sq ft 2-car garage into independent ADU studio with full bath, kitchenette, 100A subpanel, mini-split AC/Heat pump, R-15 wall / R-30 ceiling insulation, and private entrance.',
    items: [
      { id: 'ei-21', category: 'Labor', description: 'Garage door removal, stem wall concrete curb and 2x6 infill wall framing', quantity: 1, unit: 'LS', unitCost: 6200, total: 6200 },
      { id: 'ei-22', category: 'Labor', description: 'Slab floor leveling, vapor barrier and moisture remediation coating', quantity: 440, unit: 'Sq Ft', unitCost: 5.5, total: 2420 },
      { id: 'ei-23', category: 'Labor', description: 'Rough plumbing underground sewer trenching & water supply connection', quantity: 1, unit: 'LS', unitCost: 7800, total: 7800 },
      { id: 'ei-24', category: 'Material', description: 'Mitsubishi 18,000 BTU multi-zone mini-split heat pump system', quantity: 1, unit: 'System', unitCost: 4500, total: 4500 },
      { id: 'ei-25', category: 'Material', description: 'Kitchenette package: quartz counters, stainless sink, 2-burner induction', quantity: 1, unit: 'Package', unitCost: 5800, total: 5800 },
      { id: 'ei-26', category: 'Material', description: 'Full bathroom package: fiberglass walk-in shower, vanity, toilet, exhaust', quantity: 1, unit: 'Package', unitCost: 6900, total: 6900 },
      { id: 'ei-27', category: 'Permits & Fees', description: 'City of Riverside ADU impact fee waiver & building permit issuance', quantity: 1, unit: 'LS', unitCost: 3100, total: 3100 }
    ],
    subtotal: 36720,
    contingencyPercent: 12,
    contingencyAmount: 4406,
    totalEstimatedCost: 41126,
    status: 'Draft',
    createdAt: '2026-11-04',
    validUntil: '2026-12-04',
    notes: 'Permit expediting through Riverside City Hall included.'
  },
  {
    id: 'est-3',
    estimateNumber: 'EST-2026-1049',
    clientName: 'Dr. Gregory Vance',
    clientEmail: 'dr.vance@newportdental.com',
    clientPhone: '(949) 701-4433',
    projectAddress: '2310 Eagle Glen Pkwy, Corona, CA 92883',
    projectType: 'Room Additions',
    scopeOfWork: '620 sq ft second story luxury master suite addition over existing 3-car garage, including structural foundation underpinning, engineered TJI floor joists, custom en-suite bathroom, walk-in dressing room, and balcony.',
    items: [
      { id: 'ei-31', category: 'Labor', description: 'Foundation structural footing enlargement per engineering calculations', quantity: 1, unit: 'LS', unitCost: 14500, total: 14500 },
      { id: 'ei-32', category: 'Labor', description: 'Second-story structural framing, roof tie-in, shear wall plywood', quantity: 1, unit: 'LS', unitCost: 28000, total: 28000 },
      { id: 'ei-33', category: 'Material', description: 'Milgard Trinsic black vinyl dual-pane low-E windows and French balcony door', quantity: 7, unit: 'Units', unitCost: 1100, total: 7700 },
      { id: 'ei-34', category: 'Material', description: 'Exterior 3-coat Santa Barbara smooth stucco finish with color coat match', quantity: 950, unit: 'Sq Ft', unitCost: 12, total: 11400 },
      { id: 'ei-35', category: 'Equipment / Sub', description: 'Crane rental for second story roof truss fly-in and beam placement', quantity: 2, unit: 'Days', unitCost: 1800, total: 3600 },
      { id: 'ei-36', category: 'Permits & Fees', description: 'Structural engineering wet-stamp calculation package & city review fees', quantity: 1, unit: 'LS', unitCost: 5500, total: 5500 }
    ],
    subtotal: 70700,
    contingencyPercent: 10,
    contingencyAmount: 7070,
    totalEstimatedCost: 77770,
    status: 'Sent',
    createdAt: '2026-11-01',
    validUntil: '2026-12-01',
    notes: 'Includes temporary weather tarping and structural shoring during roof removal.'
  }
];

export const INITIAL_DAILY_UPDATES: DailyUpdate[] = [
  {
    id: 'upd-1',
    projectId: 'proj-1',
    projectName: 'Johnson – Modern Kitchen Remodel',
    date: '2026-11-06',
    authorName: 'Carlos Mendez',
    authorRole: 'Senior Project Manager',
    workCompleted: 'Finished installing soft-close undermount drawer slides on all lower island cabinets. Pre-drilled countertop support corbels. Cleaned work zone and staged quartz slabs for tomorrow morning’s miter cut.',
    workPlannedTomorrow: 'Countertop fabrication team arrives at 8:00 AM to deliver and set the 10-foot waterfall Calacatta island. Plumber will set brass valve under sink.',
    issuesOrDelays: 'None. Work is tracking 2 days ahead of master schedule.',
    materialsRequired: 'Epoxy adhesive, 2 tubes silicone sealant, 1.25" brass sink drain flange.',
    weather: {
      temp: '74°F',
      condition: 'Sunny & Clear (Temecula Valley)'
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        caption: 'Solid maple shaker island face frames completed and leveled'
      },
      {
        url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
        caption: 'Pendant light junction boxes and range hood duct rough-in'
      }
    ],
    additionalNotes: 'Sarah Johnson stopped by at lunch; loved the finish color on the island base cabinets.',
    createdAt: '2026-11-06T11:45:00Z'
  },
  {
    id: 'upd-2',
    projectId: 'proj-2',
    projectName: 'Martinez – Backyard ADU & Guest House',
    date: '2026-11-06',
    authorName: 'Javier Gutierrez',
    authorRole: 'Framing Lead',
    workCompleted: 'Completed 2x6 interior partition framing for bedroom closet and ADA bath pocket door. Installed structural hurricane ties on all rafters. City plumbing inspector performed rough inspection on under-slab lines.',
    workPlannedTomorrow: 'Electrician David Chen starts pulling 12/2 Romex circuits and establishing 100A exterior subpanel connection.',
    issuesOrDelays: 'Slight delay waiting for inspector; arrived at 1:30 PM instead of 10 AM, but passed without issues.',
    materialsRequired: '500 ft 12/2 Romex, 25 single-gang nail-on boxes, 6 smoke detector hardwire boxes.',
    weather: {
      temp: '78°F',
      condition: 'Warm & Mild (Riverside)'
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
        caption: 'ADU roof truss installation and shear wall nailing pattern'
      },
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        caption: 'Front entry porch framing aligned with main residence breezeway'
      }
    ],
    additionalNotes: 'Nancy Paramo checked on site at 9:00 AM with Spanish clay roof tile samples.',
    createdAt: '2026-11-06T10:15:00Z'
  },
  {
    id: 'upd-3',
    projectId: 'proj-3',
    projectName: 'Williams – Concrete Driveway & Hardscape',
    date: '2026-11-05',
    authorName: 'Mateo Rivera',
    authorRole: 'Concrete Foreman',
    workCompleted: 'Poured 42 yards of 4,500 PSI concrete for the main driveway and entry walkway. Applied deep ashlar slate stamp texture with charcoal release powder while working in sections. Cut control joints at 10-foot intervals.',
    workPlannedTomorrow: 'Allow 48 hours cure time. Will return on Thursday for pressure washing residual release powder and testing moisture before sealer.',
    issuesOrDelays: 'None. Concrete slump was a perfect 4 inches, great workability.',
    materialsRequired: '8 gallons wet-look solvent based acrylic sealer with anti-slip shark grip additive.',
    weather: {
      temp: '76°F',
      condition: 'Sunny & Dry (Corona)'
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
        caption: 'Freshly stamped ashlar slate texture along the Corona driveway'
      }
    ],
    additionalNotes: 'Homeowner Robert Williams watched the pour and was impressed with the crew speed and cleanup.',
    createdAt: '2026-11-05T16:20:00Z'
  },
  {
    id: 'upd-4',
    projectId: 'proj-5',
    projectName: 'Garcia – Insulated Alumawood Patio Cover',
    date: '2026-11-05',
    authorName: 'Mateo Rivera',
    authorRole: 'Foreman',
    workCompleted: 'Dug four 24" x 24" x 30" deep footings for heavy-duty patio support columns. Placed rebar cages and poured 3,000 PSI concrete with galvanized Simpson post base anchor brackets embedded.',
    workPlannedTomorrow: 'Wait for footing concrete cure. Unpack and organize Alumawood rafters, headers, and insulated roof foam panels.',
    issuesOrDelays: 'Encountered small tree root in footing #3; severed cleanly without utility conflict.',
    materialsRequired: 'Alumawood touch-up enamel spray cans, stainless 3/8" carriage bolts.',
    weather: {
      temp: '75°F',
      condition: 'Clear Skies (Menifee)'
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
        caption: 'Footing anchors set to laser level across backyard perimeter'
      }
    ],
    additionalNotes: 'Hector Garcia approved the post location relative to his future BBQ island.',
    createdAt: '2026-11-05T14:10:00Z'
  }
];

export const INITIAL_CHANGE_ORDERS: ChangeOrder[] = [
  {
    id: 'co-1',
    orderNumber: 'CO-001',
    projectId: 'proj-1',
    projectName: 'Johnson – Modern Kitchen Remodel',
    clientName: 'David & Sarah Johnson',
    title: 'Custom Wine Chiller Rough-In & Beverage Station Cabinet',
    description: 'Homeowner requested converting the unused desk nook into an integrated 24" dual-zone wine cooler station with floating white oak shelves, dedicated 20A GFI circuit, and accent under-shelf LED warm strip.',
    reason: 'Client Request',
    laborCost: 1400,
    materialCost: 1950,
    subcontractorCost: 650,
    otherCost: 200,
    totalCost: 4200,
    originalProjectTotal: 83300,
    revisedProjectTotal: 87500,
    status: 'Approved',
    requestedDate: '2026-10-25',
    approvedDate: '2026-10-27',
    notes: 'Client signed electronically via homeowner portal.',
    clientSignature: 'Sarah Johnson'
  },
  {
    id: 'co-2',
    orderNumber: 'CO-002',
    projectId: 'proj-2',
    projectName: 'Martinez – Backyard ADU & Guest House',
    clientName: 'Elena & Marco Martinez',
    title: 'Upgraded Fleetwood Accordion Patio Door & Smooth Stucco',
    description: 'Upgrade from standard sliding glass patio door to an 8-foot wide 3-panel Fleetwood bi-fold accordion glass door opening to the garden patio, plus upgrade exterior from sand finish to Santa Barbara smooth troweled stucco.',
    reason: 'Client Request',
    laborCost: 2800,
    materialCost: 5400,
    subcontractorCost: 1200,
    otherCost: 400,
    totalCost: 9800,
    originalProjectTotal: 235200,
    revisedProjectTotal: 245000,
    status: 'Sent for Approval',
    requestedDate: '2026-11-04',
    notes: 'Awaiting final digital confirmation from Elena Martinez via homeowner portal.'
  },
  {
    id: 'co-3',
    orderNumber: 'CO-003',
    projectId: 'proj-4',
    projectName: 'Anderson – Master Bath Renovation',
    clientName: 'Patricia & Thomas Anderson',
    title: 'Dry Rot Subfloor Replacement Under Existing Tub',
    description: 'Upon tearing out the 1994 fiberglass corner whirlpool tub, significant subfloor water damage and localized joist deterioration was discovered from an old slow drain leak. Sistering 3 floor joists and installing 1-1/8" marine grade plywood subfloor.',
    reason: 'Unforeseen Site Condition',
    laborCost: 1200,
    materialCost: 850,
    subcontractorCost: 0,
    otherCost: 150,
    totalCost: 2200,
    originalProjectTotal: 51800,
    revisedProjectTotal: 54000,
    status: 'Approved',
    requestedDate: '2026-10-24',
    approvedDate: '2026-10-25',
    notes: 'Critical structural remedy required for building code and Schluter warranty.',
    clientSignature: 'Thomas Anderson'
  },
  {
    id: 'co-4',
    orderNumber: 'CO-004',
    projectId: 'proj-5',
    projectName: 'Garcia – Insulated Alumawood Patio Cover',
    clientName: 'Hector & Maria Garcia',
    title: 'Add Built-In Low Voltage LED Step & Post Sconces',
    description: 'Add 6 bronze downlighting post sconces and integrated step riser lights wired into an astronomical timer switch inside the garage.',
    reason: 'Client Request',
    laborCost: 650,
    materialCost: 850,
    subcontractorCost: 0,
    otherCost: 100,
    totalCost: 1600,
    originalProjectTotal: 36900,
    revisedProjectTotal: 38500,
    status: 'Draft',
    requestedDate: '2026-11-05',
    notes: 'Nancy Paramo preparing cost breakdown for review.'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    projectId: 'proj-1',
    projectName: 'Johnson – Modern Kitchen Remodel',
    name: 'Executed Prime Construction Agreement – Johnson.pdf',
    category: 'Contracts',
    uploadDate: '2026-10-04',
    uploadedBy: 'Nancy Paramo',
    fileSize: '3.4 MB',
    fileType: 'PDF'
  },
  {
    id: 'doc-2',
    projectId: 'proj-1',
    projectName: 'Johnson – Modern Kitchen Remodel',
    name: 'Temecula Approved Building Permit #TEM-B26-04911.pdf',
    category: 'Permits',
    uploadDate: '2026-10-18',
    uploadedBy: 'Sofia Rodriguez',
    fileSize: '1.8 MB',
    fileType: 'PDF'
  },
  {
    id: 'doc-3',
    projectId: 'proj-1',
    projectName: 'Johnson – Modern Kitchen Remodel',
    name: 'Architectural Kitchen Layout & Electrical Plan Rev-3.pdf',
    category: 'Architectural Plans',
    uploadDate: '2026-10-06',
    uploadedBy: 'Sofia Rodriguez',
    fileSize: '8.2 MB',
    fileType: 'PDF'
  },
  {
    id: 'doc-4',
    projectId: 'proj-2',
    projectName: 'Martinez – Backyard ADU & Guest House',
    name: 'Riverside County Certified Foundation Engineering & Soils.pdf',
    category: 'Inspection Reports',
    uploadDate: '2026-09-28',
    uploadedBy: 'Nancy Paramo',
    fileSize: '5.1 MB',
    fileType: 'PDF'
  },
  {
    id: 'doc-5',
    projectId: 'proj-2',
    projectName: 'Martinez – Backyard ADU & Guest House',
    name: 'Full Architectural Blueprint Set 750sqft ADU Stamp.dwg.pdf',
    category: 'Architectural Plans',
    uploadDate: '2026-09-12',
    uploadedBy: 'Sofia Rodriguez',
    fileSize: '14.6 MB',
    fileType: 'PDF'
  },
  {
    id: 'doc-6',
    projectId: 'proj-2',
    projectName: 'Martinez – Backyard ADU & Guest House',
    name: 'Progress Milestone Invoice #3 – Framing Completion.pdf',
    category: 'Invoices',
    uploadDate: '2026-10-25',
    uploadedBy: 'Nancy Paramo',
    fileSize: '820 KB',
    fileType: 'PDF'
  },
  {
    id: 'doc-7',
    projectId: 'proj-3',
    projectName: 'Williams – Concrete Driveway & Hardscape',
    name: 'Corona Public Works Encroachment & Curb Permit.pdf',
    category: 'Permits',
    uploadDate: '2026-10-26',
    uploadedBy: 'Nancy Paramo',
    fileSize: '1.2 MB',
    fileType: 'PDF'
  },
  {
    id: 'doc-8',
    projectId: 'proj-4',
    projectName: 'Anderson – Master Bath Renovation',
    name: 'Schluter Systems 25-Year Shower Waterproofing Warranty Spec.pdf',
    category: 'Other Documents',
    uploadDate: '2026-10-29',
    uploadedBy: 'Carlos Mendez',
    fileSize: '2.1 MB',
    fileType: 'PDF'
  }
];

export const INITIAL_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 'evt-1',
    title: 'City of Temecula Electrical Final Check',
    projectId: 'proj-1',
    projectName: 'Johnson – Kitchen Remodel',
    type: 'Inspection',
    date: '2026-11-09',
    time: '09:30 AM',
    assignedTo: 'Carlos Mendez',
    location: '32190 Meadows Glen Way, Temecula',
    status: 'Scheduled',
    notes: 'Inspector Mark Davis. Ensure AFCI breaker labels are visible.'
  },
  {
    id: 'evt-2',
    title: 'Scott Residence Initial Walkthrough & Laser Scope',
    projectId: 'proj-1',
    projectName: 'Lead Consultation – Scott',
    type: 'Site Visit',
    date: '2026-11-08',
    time: '10:00 AM',
    assignedTo: 'Nancy Paramo',
    location: '41880 Calle Nopal, Temecula',
    status: 'Scheduled',
    notes: 'Discuss kitchen open concept & ADU potential in backyard.'
  },
  {
    id: 'evt-3',
    title: 'Calacatta Quartz Slab Delivery & Crane Lift',
    projectId: 'proj-1',
    projectName: 'Johnson – Kitchen Remodel',
    type: 'Material Delivery',
    date: '2026-11-12',
    time: '08:00 AM',
    assignedTo: 'Carlos Mendez',
    location: '32190 Meadows Glen Way, Temecula',
    status: 'Scheduled',
    notes: 'Two 120" slabs arriving on A-frame flatbed.'
  },
  {
    id: 'evt-4',
    title: 'Riverside 4-Way Combination Inspection (Plumbing/Elec/Frame)',
    projectId: 'proj-2',
    projectName: 'Martinez – Backyard ADU',
    type: 'Inspection',
    date: '2026-11-14',
    time: '01:00 PM',
    assignedTo: 'Nancy Paramo',
    location: '5420 Victoria Ave, Riverside',
    status: 'Scheduled',
    notes: 'Nancy will meet Riverside Senior Inspector Rodriguez on site.'
  },
  {
    id: 'evt-5',
    title: 'Concrete Sealer Application & Joint Fill',
    projectId: 'proj-3',
    projectName: 'Williams – Concrete Driveway',
    type: 'Team Assignment',
    date: '2026-11-12',
    time: '07:30 AM',
    assignedTo: 'Mateo Rivera',
    location: '1480 Foothill Pkwy, Corona',
    status: 'Scheduled',
    notes: 'Wait for morning dew to evaporate before spray application.'
  },
  {
    id: 'evt-6',
    title: 'Alumawood Structural Frame Installation',
    projectId: 'proj-5',
    projectName: 'Garcia – Patio Cover',
    type: 'Milestone',
    date: '2026-11-08',
    time: '08:00 AM',
    assignedTo: 'Mateo Rivera',
    location: '28100 Newport Rd, Menifee',
    status: 'Scheduled',
    notes: 'Raise main steel header beam and anchor to footing brackets.'
  },
  {
    id: 'evt-7',
    title: 'Irvine City Hall Stamped Plan Set Retrieval',
    projectId: 'proj-6',
    projectName: 'Torres – Luxury Casita',
    type: 'Site Visit',
    date: '2026-11-10',
    time: '11:00 AM',
    assignedTo: 'Sofia Rodriguez',
    location: 'Irvine Civic Center, 1 Civic Center Plaza',
    status: 'Scheduled',
    notes: 'Pay permit release fees and collect approved job site card.'
  }
];

export const INITIAL_MESSAGES: CommunicationMessage[] = [
  {
    id: 'msg-1',
    projectId: 'proj-2',
    sender: 'Homeowner',
    senderRole: 'Elena Martinez',
    timestamp: '2026-11-05T14:32:00Z',
    content: 'Hi Nancy! Marco and I looked at the change order for the Fleetwood accordion door. We love the idea of opening the living room up to the back patio. Can you confirm if the stucco texture will match our existing house perfectly?',
    isRead: true
  },
  {
    id: 'msg-2',
    projectId: 'proj-2',
    sender: 'Nancy Paramo',
    senderRole: 'General Contractor & Owner',
    timestamp: '2026-11-05T15:10:00Z',
    content: 'Hi Elena! Yes absolutely. We do a custom Santa Barbara smooth coat trowel finish and take a physical core sample to our supplier in Riverside for 100% color matching. You will not be able to tell any difference between the main home and your new ADU!',
    isRead: true
  },
  {
    id: 'msg-3',
    projectId: 'proj-2',
    sender: 'Homeowner',
    senderRole: 'Elena Martinez',
    timestamp: '2026-11-06T09:15:00Z',
    content: 'That sounds wonderful Nancy! I just approved the change order through the portal. So excited to see the framing progress today!',
    isRead: false
  },
  {
    id: 'msg-4',
    projectId: 'proj-1',
    sender: 'Homeowner',
    senderRole: 'Sarah Johnson',
    timestamp: '2026-11-06T10:45:00Z',
    content: 'Carlos and the team did an incredible job leveling the lower island cabinetry today. The quality of the maple is even better than we imagined!',
    isRead: true
  },
  {
    id: 'msg-5',
    projectId: 'proj-1',
    sender: 'Nancy Paramo',
    senderRole: 'General Contractor & Owner',
    timestamp: '2026-11-06T11:20:00Z',
    content: 'Thank you Sarah! Carlos is one of the best master carpenters in Southern California. The quartz slabs are arriving on Tuesday morning for the waterfall installation!',
    isRead: true
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Change Order Pending Signature',
    message: 'CO-002 for Martinez ADU ($9,800) is awaiting Elena Martinez’s signature.',
    timestamp: '2 hours ago',
    type: 'change_order',
    read: false,
    linkTab: 'changeorders',
    projectId: 'proj-2'
  },
  {
    id: 'notif-2',
    title: 'New Daily Site Update Logged',
    message: 'Carlos Mendez uploaded 2 new photos for Johnson Kitchen Remodel.',
    timestamp: '3 hours ago',
    type: 'site_update',
    read: false,
    linkTab: 'updates',
    projectId: 'proj-1'
  },
  {
    id: 'notif-3',
    title: 'Upcoming City Inspection',
    message: 'City of Riverside 4-Way Combination Inspection scheduled for Nov 14 at 1:00 PM.',
    timestamp: '5 hours ago',
    type: 'milestone',
    read: true,
    linkTab: 'schedule',
    projectId: 'proj-2'
  },
  {
    id: 'notif-4',
    title: 'New Lead Inquiry Received',
    message: 'Brandon Scott requested a consultation for a kitchen & structural wall remodel in Temecula.',
    timestamp: '1 day ago',
    type: 'estimate',
    read: true,
    linkTab: 'leads'
  }
];
