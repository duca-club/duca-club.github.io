import { getPerson, type PersonId } from './people';
import type { TeamMember } from './team-types';

export interface TeamDivision {
  name: string;
  description: string;
  members: TeamMember[];
}

export interface TeamAssignment {
  personId: PersonId;
  role: string;
}

// Division names and descriptions are shared across years.
export const divisionDefinitions = {
  "development": {
    "name": "Development Division",
    "description": "We make cool software for the club! Whether you're new to coding or already building things, we'll work together, learn together, and create useful tools for everyone."
  },
  "penetration-testing": {
    "name": "Penetration Testing Division",
    "description": "We explore ethical hacking in a safe, friendly space! Together, we learn how attackers think - and how to stop them - through fun, guided activities."
  },
  "networking": {
    "name": "Networking Division",
    "description": "We dig into how the internet actually works! Through fun, hands-on activities, we learn how devices connect, talk, and stay secure - together!"
  },
  "cyber-essentials": {
    "name": "Cyber Essentials Division",
    "description": "We introduce everyone to the basics of cybersecurity in a super friendly, beginner-friendly way - perfect for easing into the tech world without feeling overwhelmed!"
  },
  "capture-the-flag": {
    "name": "Capture The Flag Division",
    "description": "We're all about solving fun cybersecurity puzzles together! We learn heaps, celebrate progress, and help each other crack challenges in a relaxed, supportive environment."
  },
  "advertising": {
    "name": "Advertising Division",
    "description": "We're the team that makes everything look fun and exciting! We spread the word about our events, projects, and wins so everyone feels welcome and included."
  },
  "presentation": {
    "name": "Presentation Division",
    "description": "We dig into how the internet actually works! Through fun, hands-on activities, we learn how devices connect, talk, and stay secure - together!"
  },
  "general-committee": {
    "name": "General Committee",
    "description": "We're the team that makes everything look fun and exciting! We spread the word about our events, projects, and wins so everyone feels welcome and included."
  }
} as const;

export interface TeamYearRoster {
  executives: TeamAssignment[];
  divisions: {
    divisionId: keyof typeof divisionDefinitions;
    members: TeamAssignment[];
  }[];
}

// Add a year here to make it available in the team selector automatically.
// A person can hold different roles in different years or divisions.
export const teamRosters: Record<string, TeamYearRoster> = {
  "2025": {
    "executives": [
      { personId: "maple-fox", role: "President" },
      { personId: "alfie-gray", role: "Vice President" },
      { personId: "raaid-rushdy", role: "Secretary" },
      { personId: "casey-wilfling", role: "Treasurer" },
      { personId: "paige-haines", role: "Asst. Executive" }
    ],
    "divisions": [
      {
        "divisionId": "development",
        "members": [
          { personId: "george-ferres", role: "Team Lead" },
          { personId: "pasindu-peramuna", role: "Team Lead" },
          { personId: "hirusha-adikari", role: "Team Member" }
        ]
      },
      {
        "divisionId": "penetration-testing",
        "members": [
          { personId: "kat-ho", role: "Team Lead" }
        ]
      },
      {
        "divisionId": "networking",
        "members": [
          { personId: "paige-haines", role: "Team Lead" },
          { personId: "nokutendaishe-masuku", role: "Team Member" }
        ]
      },
      {
        "divisionId": "cyber-essentials",
        "members": [
          { personId: "aarnav-singh", role: "Team Lead" },
          { personId: "anika-g", role: "Team Member" }
        ]
      },
      {
        "divisionId": "capture-the-flag",
        "members": [
          { personId: "long-do", role: "Team Lead" },
          { personId: "azelma-aghakishiyeva", role: "Team Member" }
        ]
      },
      {
        "divisionId": "advertising",
        "members": [
          { personId: "ashley-mathew", role: "Team Lead" }
        ]
      }
    ]
  },
  "2026": {
    "executives": [
      { personId: "sham-polavarapu", role: "President" },
      { personId: "aditya-kapoor", role: "Vice President" },
      { personId: "ashley-mathew", role: "Secretary" },
      { personId: "kat-ho", role: "Treasurer" },
      { personId: "hirusha-adikari", role: "Asst. Secretary" },
      { personId: "george-ferres", role: "Developer" },
      { personId: "paige-haines", role: "Relations" },
      { personId: "maple-fox", role: "Advisor" }
    ],
    "divisions": [
      {
        "divisionId": "development",
        "members": [
          { personId: "george-ferres", role: "Team Lead" },
          { personId: "hirusha-adikari", role: "Team Lead" },
          { personId: "lia-mccracken", role: "Team Member" },
          { personId: "ryan-lee", role: "Team Member" },
          { personId: "bang-mach", role: "Team Member" }
        ]
      },
      {
        "divisionId": "capture-the-flag",
        "members": [
          { personId: "hirusha-adikari", role: "Team Lead" },
          { personId: "long-do", role: "Challenge Lead" },
          { personId: "lia-mccracken", role: "Team Member" }
        ]
      },
      {
        "divisionId": "presentation",
        "members": [
          { personId: "kat-ho", role: "Team Lead" },
          { personId: "pratigya-pal", role: "Team Member" },
          { personId: "navya-midha", role: "Team Member" },
          { personId: "corina-pascoe", role: "Team Member" },
          { personId: "sagar-nayar", role: "Team Member" }
        ]
      },
      {
        "divisionId": "advertising",
        "members": [
          { personId: "ashley-mathew", role: "Team Lead" },
          { personId: "rebecca-joseph", role: "Team Member" }
        ]
      },
      {
        "divisionId": "general-committee",
        "members": [
          { personId: "anika-g", role: "Team Member" },
          { personId: "casey-wilfling", role: "Team Member" },
          { personId: "alex-wu", role: "Team Member" },
          { personId: "alfie-gray", role: "Team Member" },
          { personId: "mauro-sunda", role: "Team Member" },
          { personId: "pasindu-peramuna", role: "Team Member" },
          { personId: "raaid-rushdy", role: "Team Member" },
          { personId: "shounak-bhalerao", role: "Team Member" },
          { personId: "azelma-aghakishiyeva", role: "Team Member" }
        ]
      }
    ]
  }
};

// Inactive 2026 assignments after the T2 restructuring; these are reference only.
// Executive: { personId: 'pasindu-peramuna', role: 'Developer' }
// Development: { personId: 'lily-ha', role: 'Team Member' },
//   { personId: 'pasindu-peramuna', role: 'Team Lead' },
//   { personId: 'alex-wu', role: 'Team Member' },
//   { personId: 'raaid-rushdy', role: 'Team Member' },
//   { personId: 'shounak-bhalerao', role: 'Team Member' }
// Capture The Flag: { personId: 'azelma-aghakishiyeva', role: 'Team Member' },
//   { personId: 'marco', role: 'Team Member' },
//   { personId: 'jasmin-smallu', role: 'Team Member' }
// Presentation: { personId: 'paige-haines', role: 'Team Lead' },
//   { personId: 'nokutendaishe-masuku', role: 'Team Member' }
// Advertising: { personId: 'mauro-sunda', role: 'Team Member' }
// Penetration Testing division: { personId: 'kat-ho', role: 'Team Lead' },
//   { personId: 'sagar-nayar', role: 'Team Member' },
//   { personId: 'dipen-thaker', role: 'Team Member' }
// Cyber Essentials division: { personId: 'aarnav-singh', role: 'Team Lead' },
//   { personId: 'anika-g', role: 'Team Member' },
//   { personId: 'corina-pascoe', role: 'Team Member' },
//   { personId: 'meetkumar-patel', role: 'Team Member' },
//   { personId: 'shweta', role: 'Team Member' }

export const teamYears = Object.keys(teamRosters).map(Number).sort((a, b) => a - b);
export const latestTeamYear = Math.max(...teamYears);
if (!Number.isFinite(latestTeamYear) || teamYears.some(year => !Number.isInteger(year))) {
  throw new Error('Team rosters need at least one valid calendar year in src/data/team.ts.');
}

function resolveAssignment(assignment: TeamAssignment): TeamMember {
  const profile = getPerson(assignment.personId);
  return {
    ...profile,
    role: assignment.role,
  };
}

export const executives: Record<string, TeamMember[]> = Object.fromEntries(
  Object.entries(teamRosters).map(([year, roster]) => [
    year,
    roster.executives.map(resolveAssignment),
  ]),
);

export const divisions: Record<string, TeamDivision[]> = Object.fromEntries(
  Object.entries(teamRosters).map(([year, roster]) => [
    year,
    roster.divisions.map(division => {
      const definition = divisionDefinitions[division.divisionId];
      if (!definition) throw new Error(`Unknown division "${division.divisionId}" in the ${year} team roster.`);
      return {
        ...definition,
        members: division.members.map(resolveAssignment),
      };
    }),
  ]),
);
