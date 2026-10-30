export interface PersonProfile {
  name: string;
  image: string;
  linkedIn?: string;
  bio?: string;
}

export interface TeamMember extends PersonProfile {
  role: string;
}
