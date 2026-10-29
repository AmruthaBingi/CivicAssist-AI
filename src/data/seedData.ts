import { PublicService, Grievance } from '../types/civic';

export const SAMPLE_SERVICES: PublicService[] = [
  {
    id: 'srv-pothole',
    title: 'Pothole Repair & Road Resurfacing',
    department: 'Roads & Infrastructure Maintenance Wing',
    ministry: 'Municipal Administration & Urban Development',
    category: 'Roads & Infrastructure',
    description: 'Report hazardous potholes, damaged asphalt, craters, or sinking road sections on municipal roads and arterial streets.',
    slaDays: 3,
    slaDescription: '48 to 72 Hours for major arterial roads; 5 working days for interior colony lanes.',
    helpline: '1800-425-1980 / 1913',
    requiredDocs: ['Geotagged Photo of Road Defect', 'Nearest Landmark or Street Name', 'Ward Number'],
    processSteps: [
      'Field inspection by Assistant Engineer (Roads)',
      'Job order issued to Hot-Mix asphalt rapid response team',
      'Bitumen cold-mix / hot-mix filling & roller compaction',
      'Before & After photo verification uploaded by site supervisor'
    ],
    officialPortal: 'https://cpgrams.da-rpg.gov.in',
    tags: ['Pothole', 'Tar Road', 'Craters', 'Road Safety', 'Asphalt'],
    reviewDate: 'October 2025',
    source: 'Ministry of Road Transport & State Municipal Citizen Charter'
  },
  {
    id: 'srv-water-leakage',
    title: 'Drinking Water Pipeline Leakage & Burst Mains',
    department: 'Urban Water Supply & Sewerage Board',
    ministry: 'Jal Shakti & Urban Water Resources',
    category: 'Water Supply & Drainage',
    description: 'Report potable drinking water wastage due to underground pipeline fractures, damaged valves, or booster pumping faults.',
    slaDays: 2,
    slaDescription: '24 to 48 Hours for pipeline leakages; 4 hours for major water main bursts.',
    helpline: '1916 (Toll-Free Water Emergency)',
    requiredDocs: ['Consumer Water Connection No. (CAN / RR No. if available)', 'Accurate Location Address with Cross Roads'],
    processSteps: [
      'Valve isolation to prevent clean water contamination & loss',
      'Excavation and pipe-collar replacement / sleeve welding',
      'Water pressure normalization test',
      'Re-charging of distribution main'
    ],
    officialPortal: 'https://jaljeevanmission.gov.in',
    tags: ['Water Pipe', 'Drinking Water', 'Leakage', 'Low Pressure', 'Jal Board'],
    reviewDate: 'September 2025',
    source: 'Central Public Health and Environmental Engineering Organisation (CPHEEO)'
  },
  {
    id: 'srv-power-outage',
    title: 'Frequent Power Outages & Low Voltage Fluctuation',
    department: 'State Electricity Distribution Company (DISCOM)',
    ministry: 'Ministry of Power',
    category: 'Electricity & Power',
    description: 'Log complaints regarding unscheduled load shedding, blown distribution transformer (DTR), neutral fault, or severe voltage drops.',
    slaDays: 1,
    slaDescription: 'Within 4 to 8 Hours for feeder breakdown; 24 hours for transformer replacement.',
    helpline: '1912 (National Power Helpline)',
    requiredDocs: ['Electricity Bill Consumer Account Number (CA / Service No.)', 'Pole Number or DTR Plate Code if visible'],
    processSteps: [
      'Substation line patrol and fault clearance',
      'Fuse wire / HT insulator inspection',
      'DTR replacement if winding burnt',
      'Restoration verification with local feeder engineer'
    ],
    officialPortal: 'https://urjamitra.com',
    tags: ['Power Cut', 'Transformer', 'Low Voltage', 'DISCOM', 'Fuse Off'],
    reviewDate: 'November 2025',
    source: 'State Electricity Regulatory Commission (SERC) Performance Standards'
  },
  {
    id: 'srv-garbage-overflow',
    title: 'Garbage Vulnerable Point (GVP) & Waste Collection',
    department: 'Solid Waste Management & Sanitation Wing',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    category: 'Waste & Sanitation',
    description: 'Report uncollected door-to-door domestic waste, overflowing public dustbins, illegal debris dumping, or non-swept colony streets.',
    slaDays: 1,
    slaDescription: 'Same-day resolution if reported before 11:00 AM; within 24 hours otherwise.',
    helpline: '1969 (Swachh Bharat Helpline)',
    requiredDocs: ['Street / Colony Name', 'Photo of Overflowing Trash or Dumping Spot'],
    processSteps: [
      'Sanitation Supervisor notified on Swachhata command console',
      'Compactor truck / auto-tipper routed to coordinate',
      'Manual sweeping & bleaching powder sanitization applied',
      'Closed-loop visual confirmation by ward sanitary inspector'
    ],
    officialPortal: 'https://swachhbharaturban.gov.in',
    tags: ['Garbage', 'Trash', 'Swachhata', 'Dumping', 'Sanitation'],
    reviewDate: 'January 2026',
    source: 'Solid Waste Management Rules 2016 / Swachh Survekshan Guidelines'
  },
  {
    id: 'srv-stormwater-drain',
    title: 'Stormwater Drain (SWD) Clogging & Urban Waterlogging',
    department: 'Drainage & Flood Mitigation Division',
    ministry: 'Municipal Administration & Urban Development',
    category: 'Water Supply & Drainage',
    description: 'Redressal of choked culverts, silted roadside drains, stagnant floodwater, and broken concrete drain slabs creating safety hazards.',
    slaDays: 3,
    slaDescription: '24 Hours during Monsoon alert; 3 to 5 days during dry season desilting.',
    helpline: '1800-425-4440',
    requiredDocs: ['Location coordinates or landmark', 'Depth/extent of water blockage'],
    processSteps: [
      'Super-sucker machine or manual desilting deployment',
      'Removal of construction debris or plastic blockages',
      'Replacement of broken drain grate / catch-pit cover',
      'Clear waterflow inspection'
    ],
    officialPortal: 'https://smartcities.gov.in',
    tags: ['Drain', 'Waterlogging', 'Monsoon', 'Flood', 'Culvert'],
    reviewDate: 'December 2025',
    source: 'Urban Drainage Manual & Disaster Management Authority'
  },
  {
    id: 'srv-streetlight-darkspots',
    title: 'Defective Streetlights & Hazardous Dark Spots',
    department: 'Electrical Engineering (Streetlighting) Division',
    ministry: 'Urban Local Bodies & Energy Efficiency Services (EESL)',
    category: 'Electricity & Power',
    description: 'Rectify flickering, continuously dark, or daylight-burning LED streetlights and leaning electric poles endangering pedestrians.',
    slaDays: 2,
    slaDescription: '24 to 48 Hours for single-pole repairs; 72 hours for underground cable faults.',
    helpline: '1800-180-3580',
    requiredDocs: ['Pole Identification Number (painted on pole)', 'Street / Cross Road Name'],
    processSteps: [
      'Centralised Control and Monitoring System (CCMS) diagnostics',
      'Cherry-picker hydraulic ladder van dispatched',
      'LED driver or luminaire head replacement',
      'Night-time illumination verification'
    ],
    officialPortal: 'https://eeslindia.org',
    tags: ['Streetlight', 'Dark Spot', 'LED', 'Pole', 'Pedestrian Safety'],
    reviewDate: 'October 2025',
    source: 'National Public Lighting Program Standards'
  },
  {
    id: 'srv-vector-control',
    title: 'Mosquito Fogging & Vector-Borne Disease Control',
    department: 'Public Health & Entomology Wing',
    ministry: 'Ministry of Health and Family Welfare',
    category: 'Public Health & Safety',
    description: 'Request thermal insecticidal fogging, anti-larval spraying, and survey of stagnant open water bodies for dengue/malaria prevention.',
    slaDays: 2,
    slaDescription: 'Within 48 hours of citizen intimation or cluster fever report.',
    helpline: '1800-112-233',
    requiredDocs: ['Locality / Apartment Complex Name', 'Presence of confirmed dengue/malaria cases if applicable'],
    processSteps: [
      'Entomological field worker deployment with knapsack sprayer',
      'Anti-larval oil / temephos application in stagnant water',
      'Evening vehicle-mounted thermal fogging in streets',
      'Community awareness advisory issued'
    ],
    officialPortal: 'https://mohfw.gov.in',
    tags: ['Mosquito', 'Dengue', 'Malaria', 'Fogging', 'Health'],
    reviewDate: 'August 2025',
    source: 'National Vector Borne Disease Control Programme (NVBDCP)'
  },
  {
    id: 'srv-stray-dog-animal',
    title: 'Stray Animal Menace & Animal Birth Control (ABC)',
    department: 'Veterinary Services & Animal Husbandry Cell',
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    category: 'Public Health & Safety',
    description: 'Reporting aggressive dog packs, rabies suspect cases, injured cattle causing highway traffic jams, or dead animal carcass removal.',
    slaDays: 1,
    slaDescription: 'Dead animal removal within 6 Hours; ABC sterilization catch-and-release within 5-7 days.',
    helpline: '1926 / 155304',
    requiredDocs: ['Specific street corner / building compound', 'Approximate number of animals and behavior pattern'],
    processSteps: [
      'Veterinary ambulance dispatched for emergency cases',
      'Capture by trained handlers using humane canvas nets',
      'Sterilization, anti-rabies vaccination, ear-notching at ABC shelter',
      'Release back to the exact same territorial location per law'
    ],
    officialPortal: 'https://dahd.nic.in',
    tags: ['Stray Dog', 'Rabies', 'Cattle', 'Animal Control', 'Carcass'],
    reviewDate: 'November 2025',
    source: 'Animal Birth Control (Dogs) Rules 2023 per Supreme Court of India'
  },
  {
    id: 'srv-footpath-encroachment',
    title: 'Illegal Footpath Encroachment & Unauthorized Hawking',
    department: 'Town Planning & Enforcement Wing',
    ministry: 'Municipal Corporation Town Planning Dept.',
    category: 'Roads & Infrastructure',
    description: 'Lodge complaints against permanent concrete structures, extended shop awnings, or illegal parking blocking pedestrian rights of way.',
    slaDays: 7,
    slaDescription: 'Initial site notice within 48 hours; clearance drive within 7 to 10 working days.',
    helpline: '1800-233-0222',
    requiredDocs: ['Photographs of Encroached Walkway', 'Accurate Location Address with Cross Roads'],
    processSteps: [
      'Town Planning surveyor conducts site boundary measurement against master plan',
      'Show-cause notice served to encroacher per Municipal Corporation Act',
      'Enforcement squad with police accompaniment conducts clearance',
      'Pedestrian walkway restored'
    ],
    officialPortal: 'https://mohua.gov.in',
    tags: ['Footpath', 'Encroachment', 'Hawkers', 'Sidewalk', 'Pedestrian'],
    reviewDate: 'December 2025',
    source: 'Street Vendors (Protection of Livelihood and Regulation) Act & ULB By-laws'
  },
  {
    id: 'srv-tree-fall',
    title: 'Fallen Trees & Hazardous Overhanging Branch Trimming',
    department: 'Horticulture & Urban Forestry Division',
    ministry: 'Environment, Forest & Climate Change / ULB',
    category: 'Public Health & Safety',
    description: 'Emergency clearing of uprooted trees blocking roadways post-storm or pruning dry boughs threatening overhead electric cables.',
    slaDays: 1,
    slaDescription: 'Emergency road obstruction cleared in 2 to 4 Hours; preventive pruning in 5 days.',
    helpline: '1800-425-TREE (8733)',
    requiredDocs: ['Photo of tree or dangling branch', 'Exact street / landmark'],
    processSteps: [
      'Emergency forestry rapid-action team with chainsaws dispatched',
      'Cordoning of traffic zone with local traffic police',
      'Trunk chopping, branch clearance, and wood logging',
      'Roadway cleared for vehicular movement'
    ],
    officialPortal: 'https://moef.gov.in',
    tags: ['Fallen Tree', 'Tree Pruning', 'Overhanging Branches', 'Storm Damage'],
    reviewDate: 'January 2026',
    source: 'State Tree Protection Act & Disaster Quick Response Protocol'
  },
  {
    id: 'srv-ration-pds',
    title: 'Public Distribution System (PDS) & Ration Card Grievance',
    department: 'Food, Civil Supplies and Consumer Affairs',
    ministry: 'Ministry of Consumer Affairs, Food and Public Distribution',
    category: 'Civic Certificates & Welfare',
    description: 'Resolve issues regarding e-POS biometric failure, unfair grain weighing, denial of ration entitlements (NFSA), or fair price shop irregularities.',
    slaDays: 5,
    slaDescription: '5 Working days for Fair Price Shop inspection and grievance redressal.',
    helpline: '1967 / 1800-345-6789',
    requiredDocs: ['Ration Card Number / Aadhaar Number of Beneficiary', 'Fair Price Shop (FPS) License Number or Dealer Name'],
    processSteps: [
      'Ration inspector verifies transaction logs on state Annavitran portal',
      'Surprise physical stock audit of the Fair Price Shop',
      'Manual OTP fallback override if biometric fingerprint fails',
      'Written action report submitted to Taluk Supply Officer (TSO)'
    ],
    officialPortal: 'https://nfsa.gov.in',
    tags: ['Ration Card', 'PDS', 'NFSA', 'Food Grains', 'Fair Price Shop'],
    reviewDate: 'February 2026',
    source: 'National Food Security Act (NFSA) Redressal Rules'
  },
  {
    id: 'srv-cert-delay',
    title: 'Delay in Birth, Death & Caste/Income Certificates',
    department: 'e-Governance & Revenue (Tehsildar / Taluk Office)',
    ministry: 'State Revenue Department & Digital India',
    category: 'Civic Certificates & Welfare',
    description: 'Escalate pending statutory certificates under Guarantee of Services to Citizens (Sakala / Right to Public Services Act).',
    slaDays: 7,
    slaDescription: 'Mandatory disposal within 7 working days; compensatory allowance per day of default.',
    helpline: '1800-425-0002',
    requiredDocs: ['Application Acknowledgement Number (GSC / Sakala No.)', 'Date of Submission', 'Original Citizen ID Proof'],
    processSteps: [
      'System-triggered red alert sent to designated Revenue Inspector / Tehsildar',
      'Physical or digital file scrutiny for pending objections',
      'Digital signature affixing upon compliance',
      'SMS delivery of DigiLocker certificate link to applicant'
    ],
    officialPortal: 'https://services.india.gov.in',
    tags: ['Birth Certificate', 'Death Certificate', 'Caste Certificate', 'Revenue', 'Right to Services'],
    reviewDate: 'October 2025',
    source: 'Right to Public Services Act (RTSA) & DARPG Citizen Charters'
  },
  {
    id: 'srv-water-contamination',
    title: 'Contaminated & Turbid Drinking Water Supply',
    department: 'Water Quality & Laboratory Surveillance Cell',
    ministry: 'Ministry of Jal Shakti',
    category: 'Water Supply & Drainage',
    description: 'Report discolored, foul-smelling, or sedimented tap water indicating cross-contamination with sewage lines or storage sump infection.',
    slaDays: 1,
    slaDescription: 'Water sample collection within 12 Hours; bacteriological test report in 24 hours.',
    helpline: '1916 (Option 2)',
    requiredDocs: ['Customer Connection Number', 'Photo of Turbid Water in Glass/Container'],
    processSteps: [
      'Water quality laboratory technician takes sterile bottle samples at citizen tap',
      'Residual chlorine and fecal coliform rapid testing',
      'Sewerage board teams isolate parallel sewer lines to detect cross-contamination',
      'Superchlorination and water tanker supply provided till main is clean'
    ],
    officialPortal: 'https://jaljeevanmission.gov.in/water-quality',
    tags: ['Dirty Water', 'Contamination', 'Smelly Water', 'Tap Water', 'Chlorine'],
    reviewDate: 'January 2026',
    source: 'Bureau of Indian Standards (BIS 10500:2012 Drinking Water Specification)'
  },
  {
    id: 'srv-industrial-pollution',
    title: 'Industrial Smoke, Noise Pollution & Illegal Chemical Discharge',
    department: 'State Pollution Control Board (SPCB)',
    ministry: 'Ministry of Environment, Forest and Climate Change',
    category: 'Public Health & Safety',
    description: 'Lodge complaints against unpermitted industrial emissions, night-time decibel violations (>55dB in residential zones), or dumping of chemical effluents.',
    slaDays: 4,
    slaDescription: 'Site inspection within 48 Hours; notice of closure/penalty within 5 working days.',
    helpline: '1800-180-1818',
    requiredDocs: ['Facility Name / Industrial Plot Number', 'Decibel / Audio Recording or Smoke Video'],
    processSteps: [
      'Environmental Officer conducts sound-level meter (SLM) & ambient air checks',
      'Flue gas stack emission analysis',
      'Air & Water (Prevention of Pollution) Act Section 33A notice issued if non-compliant',
      'Compliance verification report uploaded'
    ],
    officialPortal: 'https://cpcb.nic.in',
    tags: ['Pollution', 'Smoke', 'Noise', 'SPCB', 'Chemicals', 'Environment'],
    reviewDate: 'November 2025',
    source: 'Central Pollution Control Board (CPCB) Guidelines & Noise Pollution Rules 2000'
  },
  {
    id: 'srv-traffic-signal',
    title: 'Malfunctioning Traffic Signals & Blind Intersection Hazards',
    department: 'Traffic Police Engineering Cell & Urban Mobility',
    ministry: 'Ministry of Road Transport and Highways (MoRTH)',
    category: 'Roads & Infrastructure',
    description: 'Report stuck traffic lights, missing road signage, missing pedestrian pelican crossing buttons, or non-functional junction timers.',
    slaDays: 1,
    slaDescription: 'Urgent signal breakdown repaired within 4 to 6 Hours.',
    helpline: '1095 / 112 (Traffic Police)',
    requiredDocs: ['Junction Name / Intersection Landmarks', 'Direction of Non-working Signal (North/South/etc.)'],
    processSteps: [
      'Traffic control room switches junction to flashing amber or manual traffic warden',
      'Signal hardware technician replaces faulty controller card / LED array',
      'Synchronization with Adaptive Traffic Control System (ATCS)',
      'Site clearance confirmation logged'
    ],
    officialPortal: 'https://morth.nic.in',
    tags: ['Traffic Light', 'Traffic Signal', 'Junction', 'Accident Hazard', 'Road Signs'],
    reviewDate: 'February 2026',
    source: 'Indian Roads Congress (IRC:SP:72) & Traffic Police Standards'
  },
  {
    id: 'srv-fire-safety',
    title: 'Blocked Fire Exits & Commercial Building Safety Hazard',
    department: 'Fire & Emergency Services Department',
    ministry: 'State Disaster Management Authority',
    category: 'Public Health & Safety',
    description: 'Report locked fire escapes, non-functional fire hydrants, combustible material hoarding in basements, or lack of fire NOC in commercial high-rises.',
    slaDays: 3,
    slaDescription: 'Inspection within 48 Hours; compliance notice with 72-hour rectification order.',
    helpline: '101 / 112 (Fire Emergency)',
    requiredDocs: ['Building Name and Complete Address', 'Photographs of Blocked Fire Passages or Extinguishers'],
    processSteps: [
      'Station Fire Officer conducts unannounced physical audit',
      'Verification of wet-riser pressure, smoke alarms and evacuation routes',
      'Issuance of Notice under National Building Code (NBC) Part 4',
      'Follow-up inspection or sealing order if critical violation persists'
    ],
    officialPortal: 'https://ndma.gov.in',
    tags: ['Fire Safety', 'Fire Hydrant', 'Emergency Exit', 'Building Safety', 'NBC'],
    reviewDate: 'October 2025',
    source: 'National Building Code of India (NBC 2016) & State Fire Safety Act'
  }
];

export const INITIAL_SAMPLE_GRIEVANCES: Grievance[] = [
  {
    id: 'CA-2026-7841',
    ownerUid: 'demo-sample-uid',
    subject: 'Massive crater pothole causing 2-wheeler skids near Metro Station Gate 2',
    description: 'A deep 1.5-meter wide pothole has formed on the right lane directly opposite Metro Pillar 124. Yesterday two scooter riders fell during evening rain. Rainwater accumulates inside making it invisible to commuters. Immediate asphalt patching requested.',
    category: 'Roads & Infrastructure',
    department: 'Roads & Infrastructure Maintenance Wing',
    area: 'Ward 82 - Metro Corridor, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    landmark: 'Opposite Metro Pillar 124, Near Gate 2',
    priority: 'High',
    status: 'In Progress',
    citizenName: 'Aarav Sundaram',
    citizenPhone: '+91 98450 12890',
    citizenEmail: 'aarav.sundaram@gmail.com',
    createdAt: '2026-10-25T14:30:00.000Z',
    updatedAt: '2026-10-27T10:15:00.000Z',
    estimatedResolutionDate: '2026-10-28T18:00:00.000Z',
    assignedOfficer: {
      name: 'Er. Rajesh Kumar',
      designation: 'Assistant Executive Engineer (Roads)',
      department: 'BBMP East Zone Roads Division',
      phone: '+91 80 2266 5012'
    },
    timeline: [
      {
        id: 'tl-1',
        status: 'Submitted',
        title: 'Grievance Lodged in Central Portal',
        description: 'Citizen submitted grievance with photographic evidence. Auto-assigned Reference ID CA-2026-7841.',
        timestamp: '2026-10-25T14:30:00.000Z',
        actor: 'Citizen Portal System'
      },
      {
        id: 'tl-2',
        status: 'Under Review',
        title: 'Central Control Room Triage',
        description: 'Grievance verified against Ward 82 geo-fence. High priority flagged due to public road safety risk.',
        timestamp: '2026-10-25T16:00:00.000Z',
        actor: 'Municipal Triage Officer'
      },
      {
        id: 'tl-3',
        status: 'Assigned',
        title: 'Transferred to Field Sub-division',
        description: 'Assigned to Assistant Executive Engineer Er. Rajesh Kumar. Job Code #RD-82-401 issued.',
        timestamp: '2026-10-26T09:30:00.000Z',
        actor: 'Executive Engineer (East)'
      },
      {
        id: 'tl-4',
        status: 'In Progress',
        title: 'Hot-Mix Batching & Site Compactor Dispatched',
        description: 'Site inspected. Traffic police alerted for night-time cold milling and hot-mix bitumen compaction.',
        timestamp: '2026-10-27T10:15:00.000Z',
        actor: 'Er. Rajesh Kumar'
      }
    ]
  },
  {
    id: 'CA-2026-3190',
    ownerUid: 'demo-sample-uid',
    subject: 'Drinking water pipeline ruptured, muddy water entering domestic sumps',
    description: 'Main 6-inch distribution pipeline burst during fiber cable trenching. Highly turbid water with soil sediments is being pumped into over 40 households on 4th Main Road. Residents currently have zero safe drinking water.',
    category: 'Water Supply & Drainage',
    department: 'Urban Water Supply & Sewerage Board',
    area: 'Ward 45 - Gandhi Nagar Block C',
    city: 'Hyderabad',
    pincode: '500080',
    landmark: 'Behind Community Health Clinic',
    priority: 'Emergency',
    status: 'In Progress',
    citizenName: 'Priya Narayanan',
    citizenPhone: '+91 94401 77213',
    citizenEmail: 'priya.n@outlook.com',
    createdAt: '2026-10-26T08:00:00.000Z',
    updatedAt: '2026-10-27T16:45:00.000Z',
    estimatedResolutionDate: '2026-10-28T12:00:00.000Z',
    assignedOfficer: {
      name: 'Venkatesh Rao',
      designation: 'Sub-Divisional Water Engineer',
      department: 'HMWSSB Operations Division IV',
      phone: '+91 40 2343 1916'
    },
    timeline: [
      {
        id: 'tl-21',
        status: 'Submitted',
        title: 'Emergency Water Alert Logged',
        description: 'Citizen Priya Narayanan submitted urgent pipeline burst grievance.',
        timestamp: '2026-10-26T08:00:00.000Z',
        actor: 'Citizen Portal System'
      },
      {
        id: 'tl-22',
        status: 'Assigned',
        title: 'Emergency Response Squad Dispatched',
        description: 'Sector valve immediately shut down to arrest pressure loss. Assigned to Sub-Divisional Engineer Venkatesh Rao.',
        timestamp: '2026-10-26T09:10:00.000Z',
        actor: 'Jal Board Central Grid'
      },
      {
        id: 'tl-23',
        status: 'In Progress',
        title: 'Excavation & Pipe Sleeve Replacement Underway',
        description: 'Damaged cast-iron segment cut away. Water tanker #TK-04 deployed for free temporary supply to residents.',
        timestamp: '2026-10-27T16:45:00.000Z',
        actor: 'Venkatesh Rao'
      }
    ]
  },
  {
    id: 'CA-2026-5524',
    ownerUid: 'demo-sample-uid',
    subject: 'Illegal commercial garbage dumping near Government Primary School',
    description: 'Local banquet hall and commercial caterers are dumping organic waste, plastics, and disposable thermocol plates along the boundary wall of the primary school. Foul stench has made classroom instruction impossible.',
    category: 'Waste & Sanitation',
    department: 'Solid Waste Management & Sanitation Wing',
    area: 'Ward 12 - Anand Vihar Sector 3',
    city: 'New Delhi',
    pincode: '110092',
    landmark: 'Adjacent to Govt Primary School Boundary Wall',
    priority: 'High',
    status: 'Resolved',
    citizenName: 'Manoj Kumar Sharma',
    citizenPhone: '+91 98110 54321',
    citizenEmail: 'mksharma.edu@gmail.com',
    createdAt: '2026-10-22T11:15:00.000Z',
    updatedAt: '2026-10-24T17:30:00.000Z',
    estimatedResolutionDate: '2026-10-23T18:00:00.000Z',
    assignedOfficer: {
      name: 'Dr. Sunita Deshmukh',
      designation: 'Senior Sanitary Inspector',
      department: 'MCD East Zone Sanitation Wing',
      phone: '+91 11 2233 4455'
    },
    resolutionRemarks: 'Spot inspected and 3.2 metric tons of mixed waste lifted via mechanical compactor. Area sanitized with lime and sodium hypochlorite spray. Notice and fine of Rs. 25,000 served to offending banquet operator. Permanent CCTV monitoring installed.',
    feedbackRating: 5,
    feedbackRemarks: 'Quick cleanup and strict fine on the banquet hall! Children can breathe clean air again. Outstanding work.',
    timeline: [
      {
        id: 'tl-31',
        status: 'Submitted',
        title: 'Grievance Registered',
        description: 'Lodged with geotagged school boundary wall photo.',
        timestamp: '2026-10-22T11:15:00.000Z',
        actor: 'Citizen Portal System'
      },
      {
        id: 'tl-32',
        status: 'Under Review',
        title: 'Swachhata Ward Inspection Scheduled',
        description: 'Sanitary Inspector Dr. Sunita Deshmukh reviewed complaint.',
        timestamp: '2026-10-22T13:00:00.000Z',
        actor: 'MCD Sanitation Console'
      },
      {
        id: 'tl-33',
        status: 'In Progress',
        title: 'Compactor & Mechanized Squad Deployed',
        description: 'Two tippers and heavy compactor deployed for total clearance.',
        timestamp: '2026-10-23T07:30:00.000Z',
        actor: 'Dr. Sunita Deshmukh'
      },
      {
        id: 'tl-34',
        status: 'Resolved',
        title: 'Sanitization Completed & Penalties Issued',
        description: 'Site cleared and sanitized. Offending party penalized under SWM Rules 2016.',
        timestamp: '2026-10-24T17:30:00.000Z',
        actor: 'Dr. Sunita Deshmukh'
      }
    ]
  },
  {
    id: 'CA-2026-9012',
    ownerUid: 'demo-sample-uid',
    subject: 'Continuous spark and buzzing sound from 250kVA Pole Mounted Transformer',
    description: 'During peak evening load between 7 PM and 11 PM, the pole-mounted transformer sparks loudly with smoke emissions. There is an imminent fire danger to adjacent residential apartments.',
    category: 'Electricity & Power',
    department: 'State Electricity Distribution Company (DISCOM)',
    area: 'Ward 33 - Shanti Nagar, 8th Cross',
    city: 'Pune',
    pincode: '411038',
    landmark: 'In front of Shanti Enclave gate',
    priority: 'Emergency',
    status: 'Under Review',
    citizenName: 'Sneha Kulkarni',
    citizenPhone: '+91 97654 33210',
    citizenEmail: 'sneha.kulkarni@techindia.org',
    createdAt: '2026-10-27T18:45:00.000Z',
    updatedAt: '2026-10-28T07:15:00.000Z',
    estimatedResolutionDate: '2026-10-28T19:00:00.000Z',
    assignedOfficer: {
      name: 'Rohan Patil',
      designation: 'Junior Engineer (Substation Operations)',
      department: 'MSEDCL Urban Division',
      phone: '+91 20 2560 9912'
    },
    timeline: [
      {
        id: 'tl-41',
        status: 'Submitted',
        title: 'Emergency Power Hazard Registered',
        description: 'Submitted by citizen Sneha Kulkarni regarding sparking transformer.',
        timestamp: '2026-10-27T18:45:00.000Z',
        actor: 'Citizen Portal System'
      },
      {
        id: 'tl-42',
        status: 'Under Review',
        title: 'DISCOM Dispatch Center Verification',
        description: 'Transformer asset ID #PUN-DTR-33-08 verified. Thermal overload suspected. Line maintenance van notified.',
        timestamp: '2026-10-28T07:15:00.000Z',
        actor: 'Central SCADA Operations'
      }
    ]
  },
  {
    id: 'CA-2026-1140',
    ownerUid: 'demo-sample-uid',
    subject: 'Delay in Sakala Caste & Income Certificate verification exceeding 24 days',
    description: 'Submitted online Sakala application #SK-2026-88712 on 2nd October for son college scholarship deadline. Mandatory disposal SLA was 14 working days. File is stuck at Revenue Inspector desk without any query or rejection notice.',
    category: 'Civic Certificates & Welfare',
    department: 'e-Governance & Revenue (Tehsildar / Taluk Office)',
    area: 'Taluk Office - South Zone',
    city: 'Bengaluru',
    pincode: '560002',
    landmark: 'Taluk Mini Vidhana Soudha',
    priority: 'Medium',
    status: 'Assigned',
    citizenName: 'K. Ramesh Babu',
    citizenPhone: '+91 98800 23412',
    citizenEmail: 'ramesh.babu@gmail.com',
    createdAt: '2026-10-26T12:00:00.000Z',
    updatedAt: '2026-10-27T14:20:00.000Z',
    estimatedResolutionDate: '2026-10-29T17:00:00.000Z',
    assignedOfficer: {
      name: 'S. Jayamma',
      designation: 'Tahsildar (Grade II)',
      department: 'Revenue Sub-Division South',
      phone: '+91 80 2221 0044'
    },
    timeline: [
      {
        id: 'tl-51',
        status: 'Submitted',
        title: 'Sakala Delay Grievance Filed',
        description: 'Citizen lodged escalation against Sakala application delay.',
        timestamp: '2026-10-26T12:00:00.000Z',
        actor: 'Citizen Portal System'
      },
      {
        id: 'tl-52',
        status: 'Assigned',
        title: 'Summon Notice Generated to Revenue Inspector',
        description: 'Automated notice generated under Right to Services Act. Tahsildar S. Jayamma tasked to clear file within 48 hours.',
        timestamp: '2026-10-27T14:20:00.000Z',
        actor: 'e-District Vigilance Cell'
      }
    ]
  },
  {
    id: 'CA-2026-6421',
    ownerUid: 'demo-sample-uid',
    subject: 'Five streetlights non-operational for 12 days creating dangerous dark stretch',
    description: 'Streetlights on 14th Cross between 9th and 11th Main (Poles #L-42 to #L-46) are completely off. College students returning from evening coaching classes feel unsafe.',
    category: 'Electricity & Power',
    department: 'Electrical Engineering (Streetlighting) Division',
    area: 'Ward 54 - Malleshwaram',
    city: 'Bengaluru',
    pincode: '560003',
    landmark: 'Between 9th and 11th Main Road, near Post Office',
    priority: 'Medium',
    status: 'Resolved',
    citizenName: 'Ananya Swaminathan',
    citizenPhone: '+91 99801 44556',
    citizenEmail: 'ananya.swami@gmail.com',
    createdAt: '2026-10-18T19:00:00.000Z',
    updatedAt: '2026-10-20T21:10:00.000Z',
    estimatedResolutionDate: '2026-10-21T18:00:00.000Z',
    assignedOfficer: {
      name: 'Pradeep Gowda',
      designation: 'Section Officer (Streetlights)',
      department: 'BBMP Electrical Division West',
      phone: '+91 80 2344 7711'
    },
    resolutionRemarks: 'Underground junction box cable insulation burned out due to road digging. New copper cabling laid across 180 meters. All 5 LED luminaires tested and functional with CCMS timer.',
    feedbackRating: 4,
    feedbackRemarks: 'Fixed nicely! Lights are bright now. Appreciate the SMS tracking updates.',
    timeline: [
      {
        id: 'tl-61',
        status: 'Submitted',
        title: 'Dark Spot Complaint Filed',
        description: 'Lodged with pole numbers L-42 to L-46.',
        timestamp: '2026-10-18T19:00:00.000Z',
        actor: 'Citizen Portal System'
      },
      {
        id: 'tl-62',
        status: 'Assigned',
        title: 'Assigned to Streetlight Contractor',
        description: 'Assigned to Section Officer Pradeep Gowda.',
        timestamp: '2026-10-19T09:00:00.000Z',
        actor: 'Electrical Sub-division'
      },
      {
        id: 'tl-63',
        status: 'In Progress',
        title: 'Cable Fault Detection Truck Deployed',
        description: 'Underground cable burn located at junction box L-44.',
        timestamp: '2026-10-20T11:30:00.000Z',
        actor: 'Pradeep Gowda'
      },
      {
        id: 'tl-64',
        status: 'Resolved',
        title: 'Cabling Replaced & Tested',
        description: 'All 5 luminaires re-energized. Verified at 21:00.',
        timestamp: '2026-10-20T21:10:00.000Z',
        actor: 'Pradeep Gowda'
      }
    ]
  }
];

const STORAGE_KEY = 'civicassist_grievances_v1';

export function getStoredGrievances(): Grievance[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_GRIEVANCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_GRIEVANCES));
      return INITIAL_SAMPLE_GRIEVANCES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SAMPLE_GRIEVANCES;
  } catch (e) {
    console.error('Failed to read grievances from localStorage:', e);
    return INITIAL_SAMPLE_GRIEVANCES;
  }
}

export function saveGrievances(grievances: Grievance[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grievances));
  } catch (e) {
    console.error('Failed to save grievances to localStorage:', e);
  }
}

export function addGrievance(newGrievance: Grievance): void {
  const current = getStoredGrievances();
  const updated = [newGrievance, ...current];
  saveGrievances(updated);
}

export function updateGrievanceStatus(
  id: string,
  newStatus: Grievance['status'],
  remarks: string,
  actor: string = 'Municipal Officer'
): Grievance | null {
  const current = getStoredGrievances();
  const index = current.findIndex((g) => g.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const target = current[index];
  const now = new Date().toISOString();

  const newTimelineEntry = {
    id: 'tl-' + Date.now(),
    status: newStatus,
    title: `Status Updated to ${newStatus}`,
    description: remarks || `Status transitioned to ${newStatus} by ${actor}.`,
    timestamp: now,
    actor: actor
  };

  const updated: Grievance = {
    ...target,
    status: newStatus,
    updatedAt: now,
    resolutionRemarks: newStatus === 'Resolved' ? remarks : target.resolutionRemarks,
    timeline: [...target.timeline, newTimelineEntry]
  };

  current[index] = updated;
  saveGrievances(current);
  return updated;
}

export function addGrievanceFeedback(id: string, rating: number, remarks: string): Grievance | null {
  const current = getStoredGrievances();
  const index = current.findIndex((g) => g.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  current[index] = {
    ...current[index],
    feedbackRating: rating,
    feedbackRemarks: remarks,
    updatedAt: new Date().toISOString()
  };
  saveGrievances(current);
  return current[index];
}

export function resetDemoGrievances(): Grievance[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_GRIEVANCES));
  }
  return INITIAL_SAMPLE_GRIEVANCES;
}

export function generateReferenceNumber(): string {
  const year = '2026';
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `CA-${year}-${randomDigits}`;
}
