export interface Alumni {
  id: string;
  name: string;
  country: string;
  role: string;
  company: string;
  graduationYear: number;
  imageUrl: string;
  linkedIn?: string;
}

export const mockAlumni: Alumni[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    country: 'CN',
    role: 'Senior Software Engineer',
    company: 'Alibaba',
    graduationYear: 2018,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    linkedIn: 'https://linkedin.com/in/example1'
  },
  {
    id: '2',
    name: 'John Smith',
    role: 'Product Manager',
    country: 'US',
    company: 'Google',
    graduationYear: 2019,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    linkedIn: 'https://linkedin.com/in/example2'
  },
  {
    id: '3',
    name: 'Maria Garcia',
    country: 'ES',
    role: 'Data Scientist',
    company: 'Telefónica',
    graduationYear: 2020,
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    linkedIn: 'https://linkedin.com/in/example3'
  },
  {
    id: '4',
    name: 'Akiko Tanaka',
    country: 'JP',
    role: 'AI Research Lead',
    company: 'Sony',
    graduationYear: 2017,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    linkedIn: 'https://linkedin.com/in/example4'
  },
  {
    id: '5',
    name: 'Marcus Schmidt',
    country: 'DEU',
    role: 'Technical Director',
    company: 'PK',
    graduationYear: 2016,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    linkedIn: 'https://linkedin.com/in/example5'
  },
  {
    id: '6',
    name: 'Priya Patel',
    country: 'IN',
    role: 'Engineering Manager',
    company: 'Microsoft',
    graduationYear: 2018,
    imageUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb',
    linkedIn: 'https://linkedin.com/in/example6'
  },
  // pakistan mock
  {
    id: '7',
    name: 'Ali Khan',
    country: 'PK',
    role: 'Software Engineer',
    company: 'Careem',
    graduationYear: 2019,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    linkedIn: 'https://linkedin.com/in/example7'
  }
];
