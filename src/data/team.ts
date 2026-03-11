import type { TeamMember } from "@components/ui/team-card";

export interface TeamDivision {
  name: string;
  description: string;
  members: TeamMember[];
}

export const executives: TeamMember[] = [
  {
    name: "Sham Polavarapu",
    role: "President",
    image: "/team/sham-polavarapu.png",
    linkedIn: "https://www.linkedin.com/in/p-shambhavi/",
    bio: "Built a 'dog' with arduino when she was 15 because her parents said no to pet.",
  },
  {
    name: "Aditya Kapoor",
    role: "Vice President",
    image: "/team/aditya-kapoor.png",
    linkedIn: "https://www.linkedin.com/in/adityakapoor23/",
    bio: "Can chug a full liter of vodka with a straight face.",
  },
  {
    name: "Ashley Mathew",
    role: "Secretary",
    image: "/team/ashley-mathew.png",
    linkedIn: "https://www.linkedin.com/in/ashleyymathew/",
    bio: "Chess enthusiast who loves CATS and all things tech.",
  },
  {
    name: "Kat Ho",
    role: "Treasurer",
    image: "/team/kat-ho.png",
    linkedIn: "https://www.linkedin.com/in/kat-ho/",
    bio: "Her biggest leap of faith was skydiving out fo a plane.",
  },
  {
    name: "Hirusha Adikari",
    role: "Asst. Secretary",
    image: "/team/hirusha-adikari.png",
    linkedIn: "https://www.linkedin.com/in/hirusha-adi/",
    bio: "A sleep deprived nerd. Jack of all trades, master of none.",
  },
  {
    name: "George Ferres",
    role: "Developer",
    image: "/team/george-ferres.png",
    linkedIn: "https://www.linkedin.com/in/georgeferres/",
    bio: "",
  },
  {
    name: "Pasindu Peramuna",
    role: "Developer",
    image: "/team/pasindu-peramuna.png",
    linkedIn: "https://www.linkedin.com/in/pasinduperamuna/",
    bio: "",
  },
  {
    name: "Paige Haines",
    role: "Relations",
    image: "/team/paige-haines.png",
    linkedIn: "https://www.linkedin.com/in/paigehai/",
    bio: "Hacked in-game currency into moshi monsters using cheat engine in 2009.",
  },
  {
    name: "Maple Fox",
    role: "Advisor",
    image: "/team/maple-fox.png",
    linkedIn: "https://www.linkedin.com/in/maplefox/",
    bio: "Full-time caffeinated nerd/dweeb/dork/dingus that likes lifting heavy things.",
  },
];

export const divisions: TeamDivision[] = [
  {
    name: "Development Division",
    description:
      "We make cool software for the club! Whether you're new to coding or already building things, we'll work together, learn together, and create useful tools for everyone.",
    members: [
      { name: "Bojack Horseman", role: "Team Lead", image: "", linkedIn: "#" },
      { name: "Diane Nguyen", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Lisa Simpson", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Dr. Heinz Doofenshmirtz", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Courage the Cowardly Dog", role: "Team Member", image: "", linkedIn: "#" },
    ],
  },
  {
    name: "Penetration Testing Division",
    description:
      "We explore ethical hacking in a safe, friendly space! Together, we learn how attackers think - and how to stop them - through fun, guided activities.",
    members: [
      { name: "Bojack Horseman", role: "Team Lead", image: "", linkedIn: "#" },
      { name: "Diane Nguyen", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Lisa Simpson", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Dr. Heinz Doofenshmirtz", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Courage the Cowardly Dog", role: "Team Member", image: "", linkedIn: "#" },
    ],
  },
  {
    name: "Networking Division",
    description:
      "We dig into how the internet actually works! Through fun, hands-on activities, we learn how devices connect, talk, and stay secure - together!",
    members: [
      { name: "Bojack Horseman", role: "Team Lead", image: "", linkedIn: "#" },
      { name: "Diane Nguyen", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Lisa Simpson", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Dr. Heinz Doofenshmirtz", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Courage the Cowardly Dog", role: "Team Member", image: "", linkedIn: "#" },
    ],
  },
  {
    name: "Cyber Essentials Division",
    description:
      "We introduce everyone to the basics of cybersecurity in a super friendly, beginner-friendly way - perfect for easing into the tech world without feeling overwhelmed!",
    members: [
      { name: "Bojack Horseman", role: "Team Lead", image: "", linkedIn: "#" },
      { name: "Diane Nguyen", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Lisa Simpson", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Dr. Heinz Doofenshmirtz", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Courage the Cowardly Dog", role: "Team Member", image: "", linkedIn: "#" },
    ],
  },
  {
    name: "Capture The Flag Division",
    description:
      "We're all about solving fun cybersecurity puzzles together! We learn heaps, celebrate progress, and help each other crack challenges in a relaxed, supportive environment.",
    members: [
      { name: "Bojack Horseman", role: "Team Lead", image: "", linkedIn: "#" },
      { name: "Diane Nguyen", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Lisa Simpson", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Dr. Heinz Doofenshmirtz", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Courage the Cowardly Dog", role: "Team Member", image: "", linkedIn: "#" },
    ],
  },
  {
    name: "Remote Events Division",
    description:
      "We make sure everyone can join in the fun from anywhere! We host online workshops, games, streams, and events so no one ever feels left out.",
    members: [
      { name: "Bojack Horseman", role: "Team Lead", image: "", linkedIn: "#" },
      { name: "Diane Nguyen", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Lisa Simpson", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Dr. Heinz Doofenshmirtz", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Courage the Cowardly Dog", role: "Team Member", image: "", linkedIn: "#" },
    ],
  },
  {
    name: "Advertising Division",
    description:
      "We're the team that makes everything look fun and exciting! We spread the word about our events, projects, and wins so everyone feels welcome and included.",
    members: [
      { name: "Bojack Horseman", role: "Team Lead", image: "", linkedIn: "#" },
      { name: "Diane Nguyen", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Lisa Simpson", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Dr. Heinz Doofenshmirtz", role: "Team Member", image: "", linkedIn: "#" },
      { name: "Courage the Cowardly Dog", role: "Team Member", image: "", linkedIn: "#" },
    ],
  },
];
